import { booleanValue, optionalString, sanitizeString, slugify, type ValidationResult } from "./shared";

const PUBLISHING_STATUSES = ["draft", "scheduled", "published", "archived"] as const;

export function validateLeadMagnetInput(body: unknown, partial = false): ValidationResult<Record<string, unknown>> {
  const source = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const errors: string[] = [];
  const title = sanitizeString(source.title);
  const slug = sanitizeString(source.slug) || (title ? slugify(title) : "");
  const description = sanitizeString(source.description);
  const pdfUrl = sanitizeString(source.pdfUrl);
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
