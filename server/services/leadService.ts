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
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirm your UNVEIL subscription</title>
      </head>
      <body style="margin:0; padding:0; background:#f3efe5; color:#1a2010;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3efe5; margin:0; padding:0; width:100%;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:620px;">
                <tr>
                  <td align="center" style="padding:0 0 18px 0;">
                    <div style="font-family:Georgia, 'Times New Roman', serif; font-size:34px; line-height:1; letter-spacing:0.04em; color:#1a2010;">UNVEIL</div>
                    <div style="font-family:Arial, Helvetica, sans-serif; font-size:10px; line-height:1.7; letter-spacing:0.24em; text-transform:uppercase; color:#626b4a; padding-top:10px;">Male wellness education</div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#fffdf7; border:1px solid #d8cfbd; border-radius:24px; padding:0; overflow:hidden;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding:42px 34px 34px 34px;">
                          <div style="font-family:Arial, Helvetica, sans-serif; font-size:11px; line-height:1.5; letter-spacing:0.22em; text-transform:uppercase; color:#b28e5e; padding-bottom:18px;">Confirm access</div>
                          <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:42px; line-height:1.04; font-weight:400; color:#1a2010;">Confirm your UNVEIL subscription</h1>
                          <p style="margin:22px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.75; color:#626b4a;">Thank you for joining UNVEIL. Please confirm your email to receive discreet educational notes on body literacy, hygiene, confidence, and modern self-care.</p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0 0 0;">
                            <tr>
                              <td align="center" bgcolor="#18210f" style="border-radius:999px;">
                                <a href="${url}" style="display:inline-block; padding:15px 26px; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1; letter-spacing:0.16em; text-transform:uppercase; text-decoration:none; color:#fffdf7; background:#18210f; border-radius:999px;">Confirm my email</a>
                              </td>
                            </tr>
                          </table>
                          <p style="margin:26px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.7; color:#626b4a;">If the button does not work, copy and paste this link into your browser:</p>
                          <p style="margin:8px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.7; word-break:break-all; color:#626b4a;"><a href="${url}" style="color:#4d5c2a; text-decoration:underline;">${url}</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top:1px solid #d8cfbd; padding:22px 34px 28px 34px; background:#fbf8ef;">
                          <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.7; color:#626b4a;">If you did not request this, you can ignore this email. UNVEIL handles sensitive wellness topics with discretion. You can unsubscribe from educational emails at any time after confirming.</p>
                          <p style="margin:12px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:11px; line-height:1.7; color:#626b4a;">Privacy reference: <a href="${getAppUrl()}/privacy" style="color:#4d5c2a; text-decoration:underline;">UNVEIL Privacy Policy</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
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

  let leadMagnetTitle: string | undefined;
  let downloadError: string | undefined;
  if (lead.requestedLeadMagnetSlug) {
    const leadMagnet = await LeadMagnet.findOne({ slug: lead.requestedLeadMagnetSlug, isPublished: true });
    leadMagnetTitle = leadMagnet?.title;
    if (!leadMagnet) {
      downloadError = "The requested lead magnet is not published or could not be found.";
    } else if (!leadMagnet.pdfUrl) {
      downloadError = "The requested lead magnet is missing its PDF URL in the CMS.";
    }
  }

  return {
    status: "confirmed" as const,
    lead,
    downloadUrl,
    leadMagnetSlug: lead.requestedLeadMagnetSlug,
    leadMagnetTitle,
    downloadError,
  };
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
  const lead = await Lead.findOne({ downloadTokenHash: hashToken(token) });

  if (!lead) return { status: "invalid" as const, reason: "token_not_found" as const };
  if (lead.status !== "confirmed") return { status: "invalid" as const, reason: "lead_not_confirmed" as const };
  if (lead.requestedLeadMagnetSlug !== slug) return { status: "invalid" as const, reason: "resource_mismatch" as const };
  if (!lead.downloadTokenExpiresAt || lead.downloadTokenExpiresAt <= new Date()) {
    return { status: "invalid" as const, reason: "token_expired" as const };
  }
  if (lead.unsubscribedAt) return { status: "invalid" as const, reason: "lead_unsubscribed" as const };

  const leadMagnet = await LeadMagnet.findOne({ slug, isPublished: true });
  if (!leadMagnet) return { status: "missing" as const };
  if (!leadMagnet.pdfUrl) return { status: "no_asset" as const };

  return { status: "ready" as const, pdfUrl: leadMagnet.pdfUrl, title: leadMagnet.title };
}
