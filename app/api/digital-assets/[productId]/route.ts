import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "fs";
import { connectToDatabase } from "@/lib/server/db";
import { getProtectedDigitalAsset } from "@/lib/server/digitalAssets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    productId: string;
  };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const token = request.nextUrl.searchParams.get("token") || "";

  await connectToDatabase();

  const result = await getProtectedDigitalAsset(context.params.productId, token);
  if (result.status === "unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (result.status === "unsupported") {
    return NextResponse.json({ error: "Private storage provider is not connected yet" }, { status: 501 });
  }
  if (result.status !== "ready") {
    return NextResponse.json({ error: "Digital asset is unavailable" }, { status: 404 });
  }

  const file = await fs.readFile(result.absolutePath);
  return new NextResponse(file, {
    headers: {
      "Content-Type": result.contentType,
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
