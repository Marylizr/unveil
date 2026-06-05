import { NextResponse } from "next/server";
import { fallbackLeadMagnets } from "@/lib/fallbackContent";
import { connectToDatabase } from "@/lib/server/db";
import { listLeadMagnets } from "@/server/services/leadMagnetService";
import type { LeadMagnet } from "@/types/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const leadMagnets = (await listLeadMagnets()) as unknown as LeadMagnet[];
    return NextResponse.json(leadMagnets.length > 0 ? leadMagnets : fallbackLeadMagnets);
  } catch {
    return NextResponse.json(fallbackLeadMagnets);
  }
}
