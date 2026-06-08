import LeadMagnet from "../../models/LeadMagnet";
import { serializeAdminLeadMagnet, serializeLeadMagnet } from "../serializers/leadMagnetSerializer";
import { normalizeLeadMagnetSlug, validatePublishedLeadMagnetFields } from "../validators/leadMagnetValidator";
import { normalizePublishingFields, publicPublishedQuery } from "./publishingWorkflow";

export async function listLeadMagnets() {
  const leadMagnets = await LeadMagnet.find(publicPublishedQuery()).sort({ createdAt: -1 });
  return leadMagnets.map(serializeLeadMagnet);
}

export async function listAdminLeadMagnets() {
  const leadMagnets = await LeadMagnet.find().sort({ createdAt: -1 });
  return leadMagnets.map(serializeAdminLeadMagnet);
}

export async function getAdminLeadMagnetById(id: string) {
  const leadMagnet = await LeadMagnet.findById(id);
  return leadMagnet ? serializeAdminLeadMagnet(leadMagnet) : null;
}

export async function findLeadMagnetDocumentBySlug(slug: string, query: Record<string, unknown> = {}) {
  const normalizedSlug = normalizeLeadMagnetSlug(slug);
  const directMatch = await LeadMagnet.findOne({ slug: normalizedSlug, ...query });
  if (directMatch) return directMatch;

  const candidates = await LeadMagnet.find(query);
  return (
    candidates.find((candidate) => normalizeLeadMagnetSlug(candidate.slug || "", candidate.title || "") === normalizedSlug) || null
  );
}

export async function getLeadMagnetBySlug(slug: string) {
  const leadMagnet = await findLeadMagnetDocumentBySlug(slug, publicPublishedQuery());
  return leadMagnet ? serializeLeadMagnet(leadMagnet) : null;
}

function normalizeLeadMagnetInput(input: Record<string, unknown>) {
  const normalized = normalizePublishingFields(input) as Record<string, unknown>;
  const title = typeof normalized.title === "string" ? normalized.title : "";
  const slug = typeof normalized.slug === "string" ? normalized.slug : "";
  if (slug || title) normalized.slug = normalizeLeadMagnetSlug(slug, title);
  return normalized;
}

export async function createLeadMagnet(input: Record<string, unknown>) {
  return serializeAdminLeadMagnet(await LeadMagnet.create(normalizeLeadMagnetInput(input)));
}

export async function updateLeadMagnet(id: string, input: Record<string, unknown>) {
  const leadMagnet = await LeadMagnet.findByIdAndUpdate(id, normalizeLeadMagnetInput(input), { new: true, runValidators: true });
  return leadMagnet ? serializeAdminLeadMagnet(leadMagnet) : null;
}

export async function deleteLeadMagnet(id: string) {
  return LeadMagnet.findByIdAndDelete(id);
}

export async function setLeadMagnetPublished(id: string, isPublished: boolean) {
  if (!isPublished) return updateLeadMagnet(id, { publicationStatus: "draft" });

  const leadMagnet = await LeadMagnet.findById(id);
  if (!leadMagnet) return null;

  const errors = validatePublishedLeadMagnetFields({
    title: leadMagnet.title,
    slug: leadMagnet.slug,
    description: leadMagnet.description,
    pdfUrl: leadMagnet.pdfUrl,
  });

  if (errors.length) {
    const error = new Error(errors.join("; "));
    error.name = "LeadMagnetPublishValidationError";
    throw error;
  }

  return updateLeadMagnet(id, { publicationStatus: "published" });
}
