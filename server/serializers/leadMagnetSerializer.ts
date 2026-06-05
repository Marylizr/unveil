import type { ILeadMagnet } from "../../models/LeadMagnet";

export function serializeLeadMagnet(leadMagnet: ILeadMagnet) {
  const data = leadMagnet.toObject ? leadMagnet.toObject() : leadMagnet;
  const { pdfUrl, ...publicLeadMagnet } = data as Record<string, unknown>;
  return publicLeadMagnet;
}

export function serializeAdminLeadMagnet(leadMagnet: ILeadMagnet) {
  return leadMagnet.toObject ? leadMagnet.toObject() : leadMagnet;
}
