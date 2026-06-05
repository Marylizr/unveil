import { sanitizeString, stringArray, type ValidationResult } from "./shared";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORTED_LANGUAGES = new Set(["en", "pt", "es"]);
const DEFAULT_CONSENT_TEXT =
  "I agree to receive UNVEIL educational emails and understand I can unsubscribe at any time.";

export function validateLeadInput(body: unknown): ValidationResult<Record<string, unknown>> {
  const source = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const errors: string[] = [];
  const email = sanitizeString(source.email).toLowerCase();
  const language = SUPPORTED_LANGUAGES.has(String(source.language)) ? String(source.language) : "en";

  if (!EMAIL_PATTERN.test(email)) errors.push("A valid email is required");
  if (source.consent !== true) errors.push("Consent is required");

  const value = {
    email,
    firstName: sanitizeString(source.firstName),
    country: sanitizeString(source.country),
    interests: stringArray(source.interests),
    source: sanitizeString(source.source) || "newsletter",
    requestedLeadMagnetSlug: sanitizeString(source.requestedLeadMagnetSlug),
    language,
    consent: true,
    consentedAt: new Date(),
    consentText: sanitizeString(source.consentText) || DEFAULT_CONSENT_TEXT,
    consentVersion: sanitizeString(source.consentVersion) || "2026-05-31",
    privacyPolicyUrl: sanitizeString(source.privacyPolicyUrl) || "/privacy",
  };

  return errors.length ? { ok: false, errors } : { ok: true, value };
}

export function validateTokenInput(token: unknown): ValidationResult<{ token: string }> {
  const value = sanitizeString(token);
  if (!value) return { ok: false, errors: ["A valid token is required"] };
  return { ok: true, value: { token: value } };
}
