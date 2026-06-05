import LeadMagnet from "../../models/LeadMagnet";
import { serializeAdminLeadMagnet, serializeLeadMagnet } from "../serializers/leadMagnetSerializer";
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

export async function getLeadMagnetBySlug(slug: string) {
  const leadMagnet = await LeadMagnet.findOne({ slug, ...publicPublishedQuery() });
  return leadMagnet ? serializeLeadMagnet(leadMagnet) : null;
}

export async function createLeadMagnet(input: Record<string, unknown>) {
  return serializeAdminLeadMagnet(await LeadMagnet.create(normalizePublishingFields(input)));
}

export async function updateLeadMagnet(id: string, input: Record<string, unknown>) {
  const leadMagnet = await LeadMagnet.findByIdAndUpdate(id, normalizePublishingFields(input), { new: true, runValidators: true });
  return leadMagnet ? serializeAdminLeadMagnet(leadMagnet) : null;
}

export async function deleteLeadMagnet(id: string) {
  return LeadMagnet.findByIdAndDelete(id);
}

export async function setLeadMagnetPublished(id: string, isPublished: boolean) {
  return updateLeadMagnet(id, { publicationStatus: isPublished ? "published" : "draft" });
}
