import type { ILeadMagnet } from "../../models/LeadMagnet";
import { normalizeLeadMagnetSlug } from "../validators/leadMagnetValidator";

export function serializeLeadMagnet(leadMagnet: ILeadMagnet) {
  const data = leadMagnet.toObject ? leadMagnet.toObject() : leadMagnet;
  const { pdfUrl, ...publicLeadMagnet } = data as Record<string, unknown>;
  return {
    ...publicLeadMagnet,
    slug: normalizeLeadMagnetSlug(String(publicLeadMagnet.slug || ""), String(publicLeadMagnet.title || "")),
  };
}

export function serializeAdminLeadMagnet(leadMagnet: ILeadMagnet) {
  return leadMagnet.toObject ? leadMagnet.toObject() : leadMagnet;
}
