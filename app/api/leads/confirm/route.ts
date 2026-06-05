import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/server/db";
import { confirmLead } from "@/server/services/leadService";
import { validateTokenInput } from "@/server/validators/leadValidator";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validated = validateTokenInput(searchParams.get("token"));
    if (!validated.ok) {
      return NextResponse.json({ errors: validated.errors }, { status: 400 });
    }

    await connectToDatabase();
    const result = await confirmLead(validated.value.token);
    if (result.status === "invalid") {
      return NextResponse.json({ error: "Confirmation link is invalid or expired" }, { status: 400 });
    }

    return NextResponse.json({ message: "Email confirmed", status: result.status });
  } catch {
    return NextResponse.json({ error: "Failed to confirm lead" }, { status: 500 });
  }
}
