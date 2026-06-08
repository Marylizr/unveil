import crypto from "crypto";
import Lead from "../../models/Lead";
import { cloudinarySignedRawUploadUrl, isLeadMagnetCloudinaryRawUploadUrl } from "../../lib/server/cloudinary";
import { getAppUrl, sendEmail } from "../email";
import { normalizeLeadMagnetPdfUrl, normalizeLeadMagnetSlug } from "../validators/leadMagnetValidator";
import { sendSequenceEmail } from "./emailSequenceService";
import { findLeadMagnetDocumentBySlug } from "./leadMagnetService";

const CONFIRMATION_TTL_HOURS = 48;
const DOWNLOAD_TTL_DAYS = 14;

function createRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(valueBuffer, expectedBuffer);
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
  return safeCompare(token, createSignedUnsubscribeToken(lead));
}

function createSignedDownloadToken(lead: { _id: unknown; email: string }, slug: string) {
  const id = String(lead._id);
  const nonce = crypto.randomBytes(24).toString("hex");
  const signature = crypto.createHmac("sha256", getTokenSecret()).update(`${id}:${lead.email}:${slug}:${nonce}`).digest("hex");
  return `${id}.${nonce}.${signature}`;
}

function parseSignedDownloadToken(token: string) {
  const [id, nonce, signature] = token.split(".");
  if (!id || !nonce || !signature) return null;
  return { id, nonce, signature };
}

function isValidSignedDownloadToken(token: string, lead: { _id: unknown; email: string }, slug: string) {
  const parsed = parseSignedDownloadToken(token);
  if (!parsed || parsed.id !== String(lead._id)) return false;
  const expectedSignature = crypto
    .createHmac("sha256", getTokenSecret())
    .update(`${parsed.id}:${lead.email}:${slug}:${parsed.nonce}`)
    .digest("hex");
  return safeCompare(parsed.signature, expectedSignature);
}

function logLeadDownloadDebug(event: string, details: Record<string, unknown>) {
  if (process.env.LEAD_DOWNLOAD_DEBUG !== "true" && process.env.NODE_ENV !== "production") return;
  console.info(`[lead-download:${event}] ${JSON.stringify(details)}`);
}

function logLeadEmail(event: string, details: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production" && process.env.EMAIL_DEBUG !== "true") return;
  console.info(`[lead-email:${event}] ${JSON.stringify(details)}`);
}

async function checkPublicDeliveryStatus(url: string) {
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    return response.status;
  } catch {
    return "unavailable" as const;
  }
}

function logProtectedDownloadDecision(details: {
  leadTokenValid: boolean;
  leadFound: boolean;
  leadStatus?: string;
  slugMatch?: boolean;
  leadMagnetFound?: boolean;
  pdfUrlExists?: boolean;
  pdfUrlIsCloudinaryRaw?: boolean;
  publicDeliveryStatus?: number | "unavailable" | "not_checked";
  signedFallbackGenerated?: boolean;
  finalRedirectMode?: "public" | "signed" | "none";
}) {
  logLeadDownloadDebug("protected-download-decision", details);
}

function getConfirmationUrl(token: string) {
  return `${getAppUrl()}/confirm-email?token=${encodeURIComponent(token)}`;
}

function getEmailLogoUrl() {
  return `${getAppUrl()}/brand/unveil-logo-dark.png`;
}

function getUnsubscribeUrl(lead: { _id: unknown; email: string }) {
  const token = createSignedUnsubscribeToken(lead);
  return `${getAppUrl()}/unsubscribe?token=${encodeURIComponent(token)}`;
}

function getDownloadUrl(slug: string, token: string) {
  return `${getAppUrl()}/download/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}`;
}

function confirmationEmailHtml(url: string) {
  const logoUrl = getEmailLogoUrl();

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
                    <img src="${logoUrl}" width="168" alt="UNVEIL" style="display:block; width:168px; max-width:168px; height:auto; border:0; outline:none; text-decoration:none; margin:0 auto;" />
                    <div style="font-family:Arial, Helvetica, sans-serif; font-size:10px; line-height:1.7; letter-spacing:0.24em; text-transform:uppercase; color:#626b4a; padding-top:12px;">UNVEIL · Male wellness education</div>
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
    await sendConfirmationEmail(existing.email, confirmationToken, existing._id);
    return { status: "pending" as const, lead: existing };
  }

  const lead = await Lead.create({
    ...consentFields,
    welcomeSequenceStatus: "not_started",
  });
  await sendConfirmationEmail(lead.email, confirmationToken, lead._id);
  return { status: "pending" as const, lead };
}

export async function sendConfirmationEmail(email: string, token: string, leadId?: unknown) {
  const url = getConfirmationUrl(token);
  const result = await sendEmail({
    to: email,
    subject: "Confirm your UNVEIL subscription",
    html: confirmationEmailHtml(url),
    text: `Confirm your UNVEIL subscription: ${url}`,
  });

  logLeadEmail("confirmation", {
    leadId: leadId ? String(leadId) : undefined,
    confirmationEmailSent: !result?.skipped,
    skipped: Boolean(result?.skipped),
  });

  return result;
}

export async function confirmLead(token: string) {
  const lead = await Lead.findOne({
    confirmationTokenHash: hashToken(token),
    confirmationTokenExpiresAt: { $gt: new Date() },
  });

  if (!lead) {
    logLeadDownloadDebug("confirm", { tokenPresent: Boolean(token), leadFound: false });
    return { status: "invalid" as const };
  }

  const downloadSlug = normalizeLeadMagnetSlug(lead.requestedLeadMagnetSlug || "");

  logLeadDownloadDebug("confirm", {
    tokenPresent: Boolean(token),
    leadFound: true,
    leadId: String(lead._id),
    statusBefore: lead.status,
    requestedLeadMagnetSlug: lead.requestedLeadMagnetSlug,
    normalizedLeadRequestedSlug: downloadSlug,
  });

  lead.status = "confirmed";
  lead.emailConfirmedAt = new Date();
  lead.confirmationTokenHash = undefined;
  lead.confirmationTokenExpiresAt = undefined;
  lead.welcomeSequenceStatus = "active";
  lead.emailSequenceStep = 0;

  const downloadToken = downloadSlug ? createSignedDownloadToken(lead, downloadSlug) : "";
  if (downloadToken) {
    lead.downloadTokenHash = hashToken(downloadToken);
    lead.downloadTokenExpiresAt = new Date(Date.now() + DOWNLOAD_TTL_DAYS * 24 * 60 * 60 * 1000);
  }
  await lead.save();

  const downloadUrl = downloadSlug && downloadToken ? getDownloadUrl(downloadSlug, downloadToken) : undefined;

  logLeadDownloadDebug("confirm-created-download", {
    leadId: String(lead._id),
    leadStatus: lead.status,
    requestedLeadMagnetSlug: lead.requestedLeadMagnetSlug,
    normalizedLeadRequestedSlug: downloadSlug,
    downloadTokenCreated: Boolean(downloadToken),
    downloadTokenFormatRecognized: Boolean(downloadToken && parseSignedDownloadToken(downloadToken)),
    downloadTokenHashSaved: Boolean(lead.downloadTokenHash),
    downloadTokenExpired: lead.downloadTokenExpiresAt ? lead.downloadTokenExpiresAt <= new Date() : null,
  });

  const welcomeEmailSent = await sendSequenceEmail(lead, 1, downloadUrl);
  logLeadEmail("welcome", { leadId: String(lead._id), sequenceStep: 1, welcomeEmailSent });

  let leadMagnetTitle: string | undefined;
  let downloadError: string | undefined;
  if (downloadSlug) {
    const leadMagnet = await findLeadMagnetDocumentBySlug(downloadSlug, { isPublished: true });
    const resolvedPdfUrl = leadMagnet ? normalizeLeadMagnetPdfUrl(leadMagnet.pdfUrl) : "";
    leadMagnetTitle = leadMagnet?.title;
    if (!leadMagnet) {
      downloadError = "The requested lead magnet is not published or could not be found.";
    } else if (!resolvedPdfUrl) {
      downloadError = "The requested lead magnet is missing its PDF URL in the CMS.";
    }
  }

  return {
    status: "confirmed" as const,
    lead,
    downloadUrl,
    leadMagnetSlug: downloadSlug,
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
  const normalizedSlug = normalizeLeadMagnetSlug(slug);
  const tokenHash = hashToken(token);
  const parsedToken = parseSignedDownloadToken(token);

  logLeadDownloadDebug("start", {
    requestedSlug: slug,
    normalizedSlug,
    tokenPresent: Boolean(token),
    tokenFormatRecognized: Boolean(parsedToken),
    decodedLeadId: parsedToken?.id,
  });

  let lead = await Lead.findOne({ downloadTokenHash: tokenHash });
  let signedTokenVerificationResult: boolean | null = null;

  if (!lead && parsedToken) {
    lead = await Lead.findById(parsedToken.id);
    signedTokenVerificationResult = Boolean(lead && isValidSignedDownloadToken(token, lead, normalizedSlug));

    if (!lead || !signedTokenVerificationResult) {
      logLeadDownloadDebug("invalid", {
        requestedSlug: slug,
        normalizedSlug,
        tokenPresent: Boolean(token),
        tokenFormatRecognized: true,
        signedTokenVerificationResult,
        decodedLeadId: parsedToken.id,
        leadFound: Boolean(lead),
        reason: "token_not_found",
      });
      logProtectedDownloadDecision({ leadTokenValid: false, leadFound: Boolean(lead), finalRedirectMode: "none" });
      return { status: "invalid" as const, reason: "token_not_found" as const };
    }

    if (lead.downloadTokenHash && lead.downloadTokenHash !== tokenHash) {
      const leadRequestedSlug = normalizeLeadMagnetSlug(lead.requestedLeadMagnetSlug || "");
      logLeadDownloadDebug("invalid", {
        requestedSlug: slug,
        normalizedSlug,
        tokenPresent: true,
        tokenFormatRecognized: true,
        signedTokenVerificationResult,
        decodedLeadId: parsedToken.id,
        leadFound: true,
        leadStatus: lead.status,
        requestedLeadMagnetSlug: lead.requestedLeadMagnetSlug,
        normalizedLeadRequestedSlug: leadRequestedSlug,
        reason: "token_replaced",
      });
      logProtectedDownloadDecision({
        leadTokenValid: false,
        leadFound: true,
        leadStatus: lead.status,
        slugMatch: leadRequestedSlug === normalizedSlug,
        finalRedirectMode: "none",
      });
      return { status: "invalid" as const, reason: "token_replaced" as const };
    }
  }

  if (!lead) {
    const confirmationLead = await Lead.findOne({
      confirmationTokenHash: tokenHash,
      confirmationTokenExpiresAt: { $gt: new Date() },
    });

    if (confirmationLead) {
      const confirmationLeadSlug = normalizeLeadMagnetSlug(confirmationLead.requestedLeadMagnetSlug || "");
      if (confirmationLeadSlug !== normalizedSlug) {
        logLeadDownloadDebug("invalid", {
          requestedSlug: slug,
          normalizedSlug,
          tokenPresent: true,
          tokenFormatRecognized: false,
          leadFound: true,
          leadId: String(confirmationLead._id),
          leadStatus: confirmationLead.status,
          requestedLeadMagnetSlug: confirmationLead.requestedLeadMagnetSlug,
          normalizedLeadRequestedSlug: confirmationLeadSlug,
          slugMatch: false,
          reason: "resource_mismatch",
        });
        logProtectedDownloadDecision({
          leadTokenValid: false,
          leadFound: true,
          leadStatus: confirmationLead.status,
          slugMatch: false,
          finalRedirectMode: "none",
        });
        return { status: "invalid" as const, reason: "resource_mismatch" as const };
      }

      const confirmationResult = await confirmLead(token);
      if (confirmationResult.status !== "confirmed" || !confirmationResult.downloadUrl) {
        logProtectedDownloadDecision({
          leadTokenValid: false,
          leadFound: true,
          leadStatus: confirmationResult.status,
          slugMatch: true,
          finalRedirectMode: "none",
        });
        return { status: "invalid" as const, reason: "confirmation_failed" as const };
      }

      logLeadDownloadDebug("confirmed-from-download", {
        requestedSlug: slug,
        normalizedSlug,
        tokenPresent: true,
        tokenFormatRecognized: false,
        leadFound: true,
        leadId: String(confirmationResult.lead._id),
        leadStatus: confirmationResult.lead.status,
        requestedLeadMagnetSlug: confirmationResult.leadMagnetSlug,
        normalizedLeadRequestedSlug: normalizeLeadMagnetSlug(confirmationResult.leadMagnetSlug || ""),
        slugMatch: normalizeLeadMagnetSlug(confirmationResult.leadMagnetSlug || "") === normalizedSlug,
      });

      return {
        status: "redirect" as const,
        downloadUrl: confirmationResult.downloadUrl,
        title: confirmationResult.leadMagnetTitle,
      };
    }

    logLeadDownloadDebug("invalid", {
      requestedSlug: slug,
      normalizedSlug,
      tokenPresent: Boolean(token),
      tokenFormatRecognized: Boolean(parsedToken),
      signedTokenVerificationResult,
      decodedLeadId: parsedToken?.id,
      leadFound: false,
      reason: "token_not_found",
    });
    logProtectedDownloadDecision({ leadTokenValid: false, leadFound: false, finalRedirectMode: "none" });
    return { status: "invalid" as const, reason: "token_not_found" as const };
  }

  const leadRequestedSlug = normalizeLeadMagnetSlug(lead.requestedLeadMagnetSlug || "");
  const slugMatch = leadRequestedSlug === normalizedSlug;
  const tokenExpired = !lead.downloadTokenExpiresAt || lead.downloadTokenExpiresAt <= new Date();
  const unsubscribed = Boolean(lead.unsubscribedAt);
  const baseLog = {
    requestedSlug: slug,
    normalizedSlug,
    tokenPresent: Boolean(token),
    tokenFormatRecognized: Boolean(parsedToken),
    signedTokenVerificationResult,
    decodedLeadId: parsedToken?.id,
    leadFound: true,
    leadId: String(lead._id),
    leadStatus: lead.status,
    requestedLeadMagnetSlug: lead.requestedLeadMagnetSlug,
    normalizedLeadRequestedSlug: leadRequestedSlug,
    slugMatch,
    tokenExpired,
    unsubscribed,
  };

  if (lead.status !== "confirmed") {
    logLeadDownloadDebug("invalid", { ...baseLog, reason: "lead_not_confirmed" });
    logProtectedDownloadDecision({ leadTokenValid: false, leadFound: true, leadStatus: lead.status, slugMatch, finalRedirectMode: "none" });
    return { status: "invalid" as const, reason: "lead_not_confirmed" as const };
  }
  if (!slugMatch) {
    logLeadDownloadDebug("invalid", { ...baseLog, reason: "resource_mismatch" });
    logProtectedDownloadDecision({ leadTokenValid: false, leadFound: true, leadStatus: lead.status, slugMatch, finalRedirectMode: "none" });
    return { status: "invalid" as const, reason: "resource_mismatch" as const };
  }
  if (tokenExpired) {
    logLeadDownloadDebug("invalid", { ...baseLog, reason: "token_expired" });
    logProtectedDownloadDecision({ leadTokenValid: false, leadFound: true, leadStatus: lead.status, slugMatch, finalRedirectMode: "none" });
    return { status: "invalid" as const, reason: "token_expired" as const };
  }
  if (unsubscribed) {
    logLeadDownloadDebug("invalid", { ...baseLog, reason: "lead_unsubscribed" });
    logProtectedDownloadDecision({ leadTokenValid: false, leadFound: true, leadStatus: lead.status, slugMatch, finalRedirectMode: "none" });
    return { status: "invalid" as const, reason: "lead_unsubscribed" as const };
  }

  const leadMagnet = await findLeadMagnetDocumentBySlug(normalizedSlug);
  const resolvedPdfUrl = leadMagnet ? normalizeLeadMagnetPdfUrl(leadMagnet.pdfUrl) : "";
  const leadMagnetFound = Boolean(leadMagnet);
  const leadMagnetPublished = Boolean(leadMagnet?.isPublished);
  const pdfUrlPresent = Boolean(resolvedPdfUrl);
  const leadMagnetLog = {
    ...baseLog,
    leadMagnetFound,
    leadMagnetPublished,
    leadMagnetSlug: leadMagnet?.slug,
    normalizedLeadMagnetSlug: leadMagnet ? normalizeLeadMagnetSlug(leadMagnet.slug || "", leadMagnet.title || "") : undefined,
    pdfUrlPresent,
  };

  if (!leadMagnet || !leadMagnet.isPublished) {
    logLeadDownloadDebug("invalid", { ...leadMagnetLog, reason: "lead_magnet_missing_or_unpublished" });
    logProtectedDownloadDecision({ leadTokenValid: true, leadFound: true, leadStatus: lead.status, slugMatch, leadMagnetFound, pdfUrlExists: pdfUrlPresent, finalRedirectMode: "none" });
    return { status: "missing" as const };
  }
  if (!resolvedPdfUrl) {
    logLeadDownloadDebug("invalid", { ...leadMagnetLog, reason: "no_asset" });
    logProtectedDownloadDecision({ leadTokenValid: true, leadFound: true, leadStatus: lead.status, slugMatch, leadMagnetFound, pdfUrlExists: false, finalRedirectMode: "none" });
    return { status: "no_asset" as const };
  }

  const pdfUrlIsCloudinaryRaw = /^https:\/\//i.test(resolvedPdfUrl) && isLeadMagnetCloudinaryRawUploadUrl(resolvedPdfUrl);
  const publicDeliveryStatus = pdfUrlIsCloudinaryRaw ? await checkPublicDeliveryStatus(resolvedPdfUrl) : "not_checked";
  const signedCloudinaryUrl = pdfUrlIsCloudinaryRaw && publicDeliveryStatus !== 200
    ? cloudinarySignedRawUploadUrl(resolvedPdfUrl)
    : "";
  const finalRedirectMode = signedCloudinaryUrl ? "signed" : /^https:\/\//i.test(resolvedPdfUrl) ? "public" : "none";

  logProtectedDownloadDecision({
    leadTokenValid: true,
    leadFound: true,
    leadStatus: lead.status,
    slugMatch,
    leadMagnetFound,
    pdfUrlExists: pdfUrlPresent,
    pdfUrlIsCloudinaryRaw,
    publicDeliveryStatus,
    signedFallbackGenerated: Boolean(signedCloudinaryUrl),
    finalRedirectMode,
  });
  logLeadDownloadDebug("ready", {
    ...leadMagnetLog,
    pdfDeliveryMode: signedCloudinaryUrl ? "signed-cloudinary" : /^https:\/\//i.test(resolvedPdfUrl) ? "public-https" : "direct",
    publicDeliveryStatus,
    signedFallbackGenerated: Boolean(signedCloudinaryUrl),
  });
  if (/^https:\/\//i.test(resolvedPdfUrl)) {
    return { status: "redirect" as const, downloadUrl: signedCloudinaryUrl || resolvedPdfUrl, title: leadMagnet.title };
  }
  return { status: "ready" as const, pdfUrl: resolvedPdfUrl, title: leadMagnet.title };
}
