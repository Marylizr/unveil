import crypto from "crypto";
import Lead from "../../models/Lead";
import LeadMagnet from "../../models/LeadMagnet";
import { getAppUrl, sendEmail } from "../email";
import { sendSequenceEmail } from "./emailSequenceService";

const CONFIRMATION_TTL_HOURS = 48;
const DOWNLOAD_TTL_DAYS = 14;

function createRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getTokenSecret() {
  if (process.env.LEAD_TOKEN_SECRET) return process.env.LEAD_TOKEN_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("LEAD_TOKEN_SECRET is required in production");
  }
  return process.env.ADMIN_API_TOKEN || "unveil-local-token-secret";
}

function createSignedUnsubscribeToken(lead: { _id: unknown; email: string }) {
  const id = String(lead._id);
  const signature = crypto.createHmac("sha256", getTokenSecret()).update(`${id}:${lead.email}`).digest("hex");
  return `${id}.${signature}`;
}

function isValidUnsubscribeToken(token: string, lead: { _id: unknown; email: string }) {
  const expected = createSignedUnsubscribeToken(lead);
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  return tokenBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
}

function getConfirmationUrl(token: string) {
  return `${getAppUrl()}/confirm-email?token=${encodeURIComponent(token)}`;
}

function getUnsubscribeUrl(lead: { _id: unknown; email: string }) {
  const token = createSignedUnsubscribeToken(lead);
  return `${getAppUrl()}/unsubscribe?token=${encodeURIComponent(token)}`;
}

function getDownloadUrl(slug: string, token: string) {
  return `${getAppUrl()}/download/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}`;
}

function confirmationEmailHtml(url: string) {
  return `
    <div style="font-family: Georgia, serif; color: #1a2010; line-height: 1.6;">
      <h1 style="font-weight: 400;">Confirm your UNVEIL subscription</h1>
      <p>Thank you for joining UNVEIL. Please confirm your email to receive discreet educational notes on body literacy, hygiene, and modern self-care.</p>
      <p><a href="${url}" style="color: #4d5c2a;">Confirm my email</a></p>
      <p style="font-size: 13px; color: #4d5c2a;">If you did not request this, you can ignore this email.</p>
    </div>
  `;
}

export async function listLeads() {
  return Lead.find().sort({ createdAt: -1 });
}

export async function createLead(input: Record<string, unknown>, context: { ip?: string; userAgent?: string } = {}) {
  const confirmationToken = createRawToken();
  const confirmationTokenHash = hashToken(confirmationToken);
  const confirmationTokenExpiresAt = new Date(Date.now() + CONFIRMATION_TTL_HOURS * 60 * 60 * 1000);
  const consentFields = {
    ...input,
    consentIp: context.ip,
    consentUserAgent: context.userAgent,
    status: "pending",
    confirmationTokenHash,
    confirmationTokenExpiresAt,
    unsubscribedAt: undefined,
    unsubscribeReason: undefined,
  };

  const existing = await Lead.findOne({ email: input.email });
  if (existing) {
    existing.set({
      ...consentFields,
      interests: Array.from(new Set([...(existing.interests || []), ...((input.interests as string[]) || [])])),
      source: input.source || existing.source,
      language: input.language || existing.language,
      welcomeSequenceStatus: existing.welcomeSequenceStatus || "not_started",
      emailSequenceStep: existing.emailSequenceStep || 0,
    });
    await existing.save();
    await sendConfirmationEmail(existing.email, confirmationToken);
    return { status: "pending" as const, lead: existing };
  }

  const lead = await Lead.create({
    ...consentFields,
    welcomeSequenceStatus: "not_started",
  });
  await sendConfirmationEmail(lead.email, confirmationToken);
  return { status: "pending" as const, lead };
}

export async function sendConfirmationEmail(email: string, token: string) {
  const url = getConfirmationUrl(token);
  return sendEmail({
    to: email,
    subject: "Confirm your UNVEIL subscription",
    html: confirmationEmailHtml(url),
    text: `Confirm your UNVEIL subscription: ${url}`,
  });
}

export async function confirmLead(token: string) {
  const lead = await Lead.findOne({
    confirmationTokenHash: hashToken(token),
    confirmationTokenExpiresAt: { $gt: new Date() },
  });

  if (!lead) return { status: "invalid" as const };

  lead.status = "confirmed";
  lead.emailConfirmedAt = new Date();
  lead.confirmationTokenHash = undefined;
  lead.confirmationTokenExpiresAt = undefined;
  lead.welcomeSequenceStatus = "active";
  lead.emailSequenceStep = 0;
  const downloadToken = lead.requestedLeadMagnetSlug ? createRawToken() : "";
  if (downloadToken) {
    lead.downloadTokenHash = hashToken(downloadToken);
    lead.downloadTokenExpiresAt = new Date(Date.now() + DOWNLOAD_TTL_DAYS * 24 * 60 * 60 * 1000);
  }
  await lead.save();

  const downloadUrl =
    lead.requestedLeadMagnetSlug && downloadToken
      ? getDownloadUrl(lead.requestedLeadMagnetSlug, downloadToken)
      : undefined;
  await sendSequenceEmail(lead, 1, downloadUrl);

  return { status: "confirmed" as const, lead };
}

export async function unsubscribeLead(token: string) {
  const [id] = token.split(".");
  const lead = await Lead.findById(id);

  if (!lead || !isValidUnsubscribeToken(token, lead)) return { status: "invalid" as const };

  lead.unsubscribedAt = new Date();
  lead.unsubscribeReason = "self-service";
  lead.welcomeSequenceStatus = "completed";
  await lead.save();

  return { status: "unsubscribed" as const, lead };
}

export async function getLeadMagnetDownload(slug: string, token: string) {
  const lead = await Lead.findOne({
    requestedLeadMagnetSlug: slug,
    downloadTokenHash: hashToken(token),
    downloadTokenExpiresAt: { $gt: new Date() },
    status: "confirmed",
    unsubscribedAt: { $exists: false },
  });

  if (!lead) return { status: "invalid" as const };

  const leadMagnet = await LeadMagnet.findOne({ slug, isPublished: true });
  if (!leadMagnet) return { status: "missing" as const };

  return { status: "ready" as const, pdfUrl: leadMagnet.pdfUrl };
}
