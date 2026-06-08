import { booleanValue, sanitizeString, slugify, type ValidationResult } from "./shared";

const PUBLISHING_STATUSES = ["draft", "scheduled", "published", "archived"] as const;

export function normalizeLeadMagnetSlug(value: string, title = "") {
  const normalizedTitle = slugify(title);
  const normalizedValue = slugify(value);
  if (normalizedTitle === "the-7-hygiene-mistakes-most-men-make") return "7-hygiene-mistakes";
  if (normalizedValue === "the-7-hygiene-mistakes-most-men-make") return "7-hygiene-mistakes";
  if (normalizedValue === "hygiene-mistakes" && normalizedTitle.includes("7-hygiene-mistakes")) {
    return "7-hygiene-mistakes";
  }
  return normalizedValue || normalizedTitle;
}

export function normalizeLeadMagnetPdfUrl(value: string) {
  const pdfUrl = sanitizeString(value);
  if (!pdfUrl) return "";
  if (/^https?:\/\//i.test(pdfUrl) || pdfUrl.startsWith("/")) return pdfUrl;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";

  return `https://res.cloudinary.com/${cloudName}/raw/upload/${pdfUrl.replace(/^\/+/, "")}`;
}

export function validateLeadMagnetInput(body: unknown, partial = false): ValidationResult<Record<string, unknown>> {
  const source = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const errors: string[] = [];
  const title = sanitizeString(source.title);
  const slug = normalizeLeadMagnetSlug(sanitizeString(source.slug), title);
  const description = sanitizeString(source.description);
  const pdfUrl = normalizeLeadMagnetPdfUrl(sanitizeString(source.pdfUrl));
  const category = sanitizeString(source.category);
  const coverImageSource =
    typeof source.coverImage === "object" && source.coverImage !== null
      ? (source.coverImage as Record<string, unknown>)
      : undefined;

  if (!partial && !title) errors.push("title is required");
  if (!partial && !slug) errors.push("slug is required");
  if (!partial && !description) errors.push("description is required");
  if (!partial && !pdfUrl) errors.push("pdfUrl is required");
  if (!partial && !category) errors.push("category is required");

  const value: Record<string, unknown> = {
    title,
    slug,
    description,
    pdfUrl,
    category,
    coverImage: coverImageSource
      ? { url: sanitizeString(coverImageSource.url), alt: sanitizeString(coverImageSource.alt) }
      : undefined,
    isPublished: source.isPublished !== undefined ? booleanValue(source.isPublished) : undefined,
    publicationStatus:
      typeof source.publicationStatus === "string" && PUBLISHING_STATUSES.includes(source.publicationStatus as (typeof PUBLISHING_STATUSES)[number])
        ? source.publicationStatus
        : undefined,
    scheduledAt: source.scheduledAt ? new Date(String(source.scheduledAt)) : undefined,
    publishedAt: source.publishedAt ? new Date(String(source.publishedAt)) : undefined,
  };

  Object.keys(value).forEach((key) => {
    if (value[key] === undefined || value[key] === "") delete value[key];
  });

  return errors.length ? { ok: false, errors } : { ok: true, value };
}
