import crypto from "crypto";
import type { ILead } from "../../models/Lead";
import Lead from "../../models/Lead";
import { getAppUrl, sendEmail } from "../email";

const SEQUENCE_LENGTH = 5;
const ONE_PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64"
);

const sequence = [
  {
    delayHours: 0,
    subject: "Welcome to UNVEIL",
    title: "Welcome to UNVEIL",
    body:
      "You are confirmed. UNVEIL is education-first: calm guidance on male hygiene, body literacy, emotional intelligence, intimacy education, and refined self-care.",
    cta: "Begin with the journal",
    href: "/learn",
  },
  {
    delayHours: 24,
    subject: "The foundation: body literacy",
    title: "Your body is a system",
    body:
      "The first step is not performance pressure. It is literacy: understanding signals, hygiene, comfort, stress, and routines with more clarity.",
    cta: "Read the journal",
    href: "/learn/your-body-is-not-instinct-it-is-a-system",
  },
  {
    delayHours: 48,
    subject: "A better hygiene routine",
    title: "Small rituals, better confidence",
    body:
      "Refined self-care is practical and discreet. This note focuses on simple hygiene habits that support comfort without harshness or shame.",
    cta: "Explore hygiene education",
    href: "/learn/male-intimate-hygiene-what-most-men-were-never-taught",
  },
  {
    delayHours: 72,
    subject: "Emotional intelligence and intimacy",
    title: "Communication is a skill",
    body:
      "Confidence grows when a man can listen, speak clearly, regulate stress, and approach intimacy with respect and emotional maturity.",
    cta: "Read communication guidance",
    href: "/learn/talking-about-sex-is-a-learnable-skill",
  },
  {
    delayHours: 96,
    subject: "Your UNVEIL path",
    title: "Continue with intention",
    body:
      "You now have the foundations: literacy, hygiene, emotional intelligence, and responsible education. Keep the work calm, private, and consistent.",
    cta: "View resources",
    href: "/products",
  },
] as const;

function getTokenSecret() {
  if (process.env.LEAD_TOKEN_SECRET) return process.env.LEAD_TOKEN_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("LEAD_TOKEN_SECRET is required in production");
  return process.env.ADMIN_API_TOKEN || "unveil-local-token-secret";
}

function sequenceToken(lead: { _id: unknown; email: string }, step: number) {
  const id = String(lead._id);
  const signature = crypto.createHmac("sha256", getTokenSecret()).update(`${id}:${lead.email}:${step}`).digest("hex");
  return `${id}.${step}.${signature}`;
}

function parseSequenceToken(token: string) {
  const [id, stepRaw, signature] = token.split(".");
  const step = Number(stepRaw);
  if (!id || !Number.isInteger(step) || step < 1 || step > SEQUENCE_LENGTH || !signature) return null;
  return { id, step, signature };
}

function isValidSequenceToken(token: string, lead: ILead, step: number) {
  const expected = sequenceToken(lead, step);
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  return tokenBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
}

function getUnsubscribeUrl(lead: { _id: unknown; email: string }) {
  const id = String(lead._id);
  const signature = crypto.createHmac("sha256", getTokenSecret()).update(`${id}:${lead.email}`).digest("hex");
  return `${getAppUrl()}/unsubscribe?token=${encodeURIComponent(`${id}.${signature}`)}`;
}

function getPublicApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_PUBLIC_URL || getAppUrl();
}

function getNextSendDate(step: number) {
  const next = sequence[step];
  if (!next) return undefined;
  return new Date(Date.now() + next.delayHours * 60 * 60 * 1000);
}

function upsertEvent(lead: ILead, step: number, patch: Partial<ILead["emailSequenceEvents"][number]>) {
  const existing = lead.emailSequenceEvents.find((event) => event.step === step);
  if (existing) {
    Object.assign(existing, patch);
  } else {
    lead.emailSequenceEvents.push({ step, ...patch });
  }
}

function emailHtml(lead: ILead, step: number, downloadUrl?: string) {
  const item = sequence[step - 1];
  const token = sequenceToken(lead, step);
  const openUrl = `${getPublicApiUrl()}/api/leads/sequence/open/${encodeURIComponent(token)}.gif`;
  const clickTarget = downloadUrl && step === 1 ? downloadUrl : `${getAppUrl()}${item.href}`;
  const clickUrl = `${getPublicApiUrl()}/api/leads/sequence/click/${encodeURIComponent(token)}?url=${encodeURIComponent(clickTarget)}`;
  const unsubscribeUrl = getUnsubscribeUrl(lead);

  return `
    <div style="font-family: Georgia, serif; color: #1a2010; line-height: 1.6;">
      <h1 style="font-weight: 400;">${item.title}</h1>
      <p>${item.body}</p>
      <p><a href="${clickUrl}" style="color: #4d5c2a;">${step === 1 && downloadUrl ? "Download your UNVEIL guide" : item.cta}</a></p>
      <p style="font-size: 13px; color: #4d5c2a;"><a href="${unsubscribeUrl}" style="color: #4d5c2a;">Unsubscribe</a> at any time.</p>
      <img src="${openUrl}" alt="" width="1" height="1" style="display:block;border:0;" />
    </div>
  `;
}

function emailText(lead: ILead, step: number, downloadUrl?: string) {
  const item = sequence[step - 1];
  const token = sequenceToken(lead, step);
  const clickTarget = downloadUrl && step === 1 ? downloadUrl : `${getAppUrl()}${item.href}`;
  const clickUrl = `${getPublicApiUrl()}/api/leads/sequence/click/${encodeURIComponent(token)}?url=${encodeURIComponent(clickTarget)}`;
  return `${item.title}\n\n${item.body}\n\n${step === 1 && downloadUrl ? "Download your UNVEIL guide" : item.cta}: ${clickUrl}\n\nUnsubscribe: ${getUnsubscribeUrl(lead)}`;
}

export async function sendSequenceEmail(lead: ILead, step: number, downloadUrl?: string) {
  const item = sequence[step - 1];
  if (!item || lead.unsubscribedAt || lead.status !== "confirmed") return false;

  await sendEmail({
    to: lead.email,
    subject: item.subject,
    html: emailHtml(lead, step, downloadUrl),
    text: emailText(lead, step, downloadUrl),
  });

  const now = new Date();
  lead.emailSequenceStep = step;
  lead.welcomeSequenceStatus = step >= SEQUENCE_LENGTH ? "completed" : "active";
  lead.emailSequenceNextSendAt = step >= SEQUENCE_LENGTH ? undefined : getNextSendDate(step);
  if (step === 1) lead.welcomeEmailSentAt = now;
  if (step >= SEQUENCE_LENGTH) lead.emailSequenceCompletedAt = now;
  upsertEvent(lead, step, { sentAt: now, completedAt: step >= SEQUENCE_LENGTH ? now : undefined });
  await lead.save();
  return true;
}

export async function processDueEmailSequences(limit = 50) {
  const leads = await Lead.find({
    status: "confirmed",
    unsubscribedAt: { $exists: false },
    welcomeSequenceStatus: "active",
    emailSequenceNextSendAt: { $lte: new Date() },
    emailSequenceStep: { $lt: SEQUENCE_LENGTH },
  })
    .sort({ emailSequenceNextSendAt: 1 })
    .limit(limit);

  let sent = 0;
  for (const lead of leads) {
    const didSend = await sendSequenceEmail(lead, lead.emailSequenceStep + 1);
    if (didSend) sent += 1;
  }
  return { checked: leads.length, sent };
}

export async function trackSequenceOpen(token: string) {
  const parsed = parseSequenceToken(token.replace(/\.gif$/, ""));
  if (!parsed) return false;
  const lead = await Lead.findById(parsed.id);
  if (!lead || !isValidSequenceToken(token.replace(/\.gif$/, ""), lead, parsed.step)) return false;
  upsertEvent(lead, parsed.step, { openedAt: new Date() });
  await lead.save();
  return true;
}

export async function trackSequenceClick(token: string) {
  const parsed = parseSequenceToken(token);
  if (!parsed) return false;
  const lead = await Lead.findById(parsed.id);
  if (!lead || !isValidSequenceToken(token, lead, parsed.step)) return false;
  upsertEvent(lead, parsed.step, { clickedAt: new Date() });
  await lead.save();
  return true;
}

export function trackingPixel() {
  return ONE_PIXEL_GIF;
}

export function startEmailSequenceWorker() {
  const intervalMinutes = Number(process.env.EMAIL_SEQUENCE_INTERVAL_MINUTES || 15);
  const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;

  setInterval(() => {
    processDueEmailSequences().catch((error) => {
      console.error("Email sequence worker failed:", error);
    });
  }, intervalMs);
}
