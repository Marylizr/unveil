import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/server/db";
import { unsubscribeLead } from "@/server/services/leadService";
import { validateTokenInput } from "@/server/validators/leadValidator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validated = validateTokenInput(body?.token);
    if (!validated.ok) {
      return NextResponse.json({ errors: validated.errors }, { status: 400 });
    }

    await connectToDatabase();
    const result = await unsubscribeLead(validated.value.token);
    if (result.status === "invalid") {
      return NextResponse.json({ error: "Unsubscribe link is invalid" }, { status: 400 });
    }

    return NextResponse.json({ message: "You have been unsubscribed", status: result.status });
  } catch {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
