import { BLOG_CATEGORY_VALUES } from "../../models/BlogArticle";
import {
  booleanValue,
  enumValue,
  localizedText,
  numberValue,
  optionalString,
  sanitizeString,
  slugify,
  stringArray,
  type ValidationResult,
} from "./shared";

const CONTENT_TYPES = ["article", "guide", "ebook", "research", "case-study"] as const;
const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
const PUBLISHING_STATUSES = ["draft", "scheduled", "published", "archived"] as const;

export function validateBlogInput(body: unknown, partial = false): ValidationResult<Record<string, unknown>> {
  const source = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const errors: string[] = [];
  const title = source.title !== undefined || !partial ? localizedText(source.title, "title", errors) : undefined;
  const slug = sanitizeString(source.slug) || (title?.en ? slugify(title.en) : "");
  const readingTime = numberValue(source.readingTime, "readingTime", errors);
  const estimatedReadingMinutes = numberValue(source.estimatedReadingMinutes, "estimatedReadingMinutes", errors);

  if (!partial && !slug) errors.push("slug is required");

  const coverImageSource =
    typeof source.coverImage === "object" && source.coverImage !== null
      ? (source.coverImage as Record<string, unknown>)
      : undefined;

  const authorSource =
    typeof source.author === "object" && source.author !== null
      ? (source.author as Record<string, unknown>)
      : {};
  const authorName = sanitizeString(authorSource.name);
  if (!partial && !authorName) errors.push("author.name is required");

  const value: Record<string, unknown> = {};

  if (title) value.title = title;
  if (slug) value.slug = slug;
  if (source.excerpt !== undefined || !partial) value.excerpt = localizedText(source.excerpt, "excerpt", errors);
  if (source.content !== undefined || !partial) value.content = localizedText(source.content, "content", errors);
  if (source.category !== undefined || !partial) value.category = enumValue(source.category, BLOG_CATEGORY_VALUES, "category", errors, BLOG_CATEGORY_VALUES[0]);
  if (source.tags !== undefined || !partial) value.tags = stringArray(source.tags);
  if (coverImageSource) value.coverImage = { url: sanitizeString(coverImageSource.url), alt: sanitizeString(coverImageSource.alt) };
  if (source.author !== undefined || !partial) value.author = { name: authorName, role: sanitizeString(authorSource.role) };
  if (readingTime || estimatedReadingMinutes || !partial) value.readingTime = readingTime || estimatedReadingMinutes || 5;
  if (estimatedReadingMinutes || readingTime || !partial) value.estimatedReadingMinutes = estimatedReadingMinutes || readingTime || 5;
  if (source.contentType !== undefined || !partial) value.contentType = enumValue(source.contentType, CONTENT_TYPES, "contentType", errors, "article");
  if (source.difficulty !== undefined || !partial) value.difficulty = enumValue(source.difficulty, DIFFICULTIES, "difficulty", errors, "beginner");
  if (source.relatedArticles !== undefined || !partial) value.relatedArticles = Array.isArray(source.relatedArticles) ? source.relatedArticles.map(sanitizeString).filter(Boolean) : [];
  if (source.relatedProducts !== undefined || !partial) value.relatedProducts = Array.isArray(source.relatedProducts) ? source.relatedProducts.map(sanitizeString).filter(Boolean) : [];
  if (source.seoTitle !== undefined) value.seoTitle = optionalString(source.seoTitle);
  if (source.seoDescription !== undefined) value.seoDescription = optionalString(source.seoDescription);
  if (source.isPublished !== undefined) value.isPublished = booleanValue(source.isPublished);
  if (source.publicationStatus !== undefined) value.publicationStatus = enumValue(source.publicationStatus, PUBLISHING_STATUSES, "publicationStatus", errors, "draft");
  if (source.scheduledAt) value.scheduledAt = new Date(String(source.scheduledAt));
  if (source.publishedAt) value.publishedAt = new Date(String(source.publishedAt));

  Object.keys(value).forEach((key) => {
    if (value[key] === undefined) delete value[key];
  });

  return errors.length ? { ok: false, errors } : { ok: true, value };
}
