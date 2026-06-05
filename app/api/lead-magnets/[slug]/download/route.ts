import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/server/db";
import { getLeadMagnetDownload } from "@/server/services/leadService";
import { validateTokenInput } from "@/server/validators/leadValidator";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const validated = validateTokenInput(searchParams.get("token"));
    if (!validated.ok) {
      return NextResponse.json({ errors: validated.errors }, { status: 400 });
    }

    await connectToDatabase();
    const result = await getLeadMagnetDownload(params.slug, validated.value.token);
    if (result.status !== "ready") {
      return NextResponse.json({ error: "Download link is invalid or expired" }, { status: 403 });
    }

    return NextResponse.json({ pdfUrl: result.pdfUrl });
  } catch {
    return NextResponse.json({ error: "Failed to prepare download" }, { status: 500 });
  }
}
