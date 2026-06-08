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

function cloudinaryRawUploadUrl(publicId: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId.replace(/^\/+/, "")}`;
}

function cloudinaryRawPublicId(value: string) {
  const publicId = value
    .replace(/^\/+/, "")
    .replace(/^https:\/\/res\.cloudinary\.com\/[^/]+\/raw\/upload\/(?:v\d+\/)?/i, "")
    .replace(/^raw\/upload\/(?:v\d+\/)?/i, "");

  if (!publicId.startsWith("unveil/lead-magnets/pdfs/")) return "";
  return /\.pdf$/i.test(publicId) ? publicId : `${publicId}.pdf`;
}

export function normalizeLeadMagnetPdfUrl(value: string) {
  const pdfUrl = sanitizeString(value);
  if (!pdfUrl) return "";
  if (/^https:\/\//i.test(pdfUrl)) return pdfUrl;
  if (/^http:\/\//i.test(pdfUrl) || pdfUrl.startsWith("/")) return "";

  const publicId = cloudinaryRawPublicId(pdfUrl);
  return publicId ? cloudinaryRawUploadUrl(publicId) : "";
}

export function validatePublishedLeadMagnetFields(input: Record<string, unknown>) {
  const errors: string[] = [];
  const title = sanitizeString(input.title);
  const slug = normalizeLeadMagnetSlug(sanitizeString(input.slug), title);
  const description = sanitizeString(input.description);
  const pdfUrl = normalizeLeadMagnetPdfUrl(sanitizeString(input.pdfUrl));

  if (!title) errors.push("title is required before publishing");
  if (!slug) errors.push("slug is required before publishing");
  if (slug && slug !== sanitizeString(input.slug)) errors.push("slug must be normalized before publishing");
  if (!description) errors.push("description is required before publishing");
  if (!pdfUrl) errors.push("pdfUrl must be a full https:// URL or supported Cloudinary raw public ID before publishing");

  return errors;
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

  if (source.publicationStatus === "published" || source.isPublished === true) {
    errors.push(...validatePublishedLeadMagnetFields({ ...source, title, slug, description, pdfUrl }));
  }

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
