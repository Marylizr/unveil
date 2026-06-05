export const PUBLISHING_STATUSES = ["draft", "scheduled", "published", "archived"] as const;
export type PublishingStatus = (typeof PUBLISHING_STATUSES)[number];

export function isPublishingStatus(value: unknown): value is PublishingStatus {
  return typeof value === "string" && PUBLISHING_STATUSES.includes(value as PublishingStatus);
}

export function normalizePublishingFields(input: Record<string, unknown>) {
  const next = { ...input };
  const status = isPublishingStatus(next.publicationStatus)
    ? next.publicationStatus
    : next.isPublished === true
      ? "published"
      : next.isPublished === false
        ? "draft"
        : undefined;

  if (!status) return next;

  next.publicationStatus = status;
  next.isPublished = status === "published";

  if (status === "published" && !next.publishedAt) {
    next.publishedAt = new Date();
  }

  if (status !== "scheduled") {
    next.scheduledAt = undefined;
  }

  return next;
}

export function publicPublishedQuery() {
  return {
    $or: [{ isPublished: true }, { publicationStatus: "published" }],
    publicationStatus: { $ne: "archived" },
  };
}
