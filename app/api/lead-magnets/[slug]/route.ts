import { NextResponse } from "next/server";
import { getFallbackLeadMagnet } from "@/lib/fallbackContent";
import { connectToDatabase } from "@/lib/server/db";
import { getLeadMagnetBySlug } from "@/server/services/leadMagnetService";
import type { LeadMagnet } from "@/types/content";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();
    const leadMagnet = (await getLeadMagnetBySlug(params.slug)) as unknown as LeadMagnet | null;
    if (leadMagnet) return NextResponse.json(leadMagnet);
  } catch {
    const fallback = getFallbackLeadMagnet(params.slug);
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: "Failed to fetch lead magnet" }, { status: 500 });
  }

  const fallback = getFallbackLeadMagnet(params.slug);
  if (fallback) return NextResponse.json(fallback);

  return NextResponse.json({ error: "Lead magnet not found" }, { status: 404 });
}
