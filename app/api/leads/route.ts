import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/server/db";
import { createLead } from "@/server/services/leadService";
import { validateLeadInput } from "@/server/validators/leadValidator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validated = validateLeadInput(body);
    if (!validated.ok) {
      return NextResponse.json({ errors: validated.errors }, { status: 400 });
    }

    const requestHeaders = headers();
    await connectToDatabase();
    const result = await createLead(validated.value, {
      ip: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
      userAgent: requestHeaders.get("user-agent") || undefined,
    });

    return NextResponse.json(
      {
        message: "Please check your email to confirm your subscription.",
        status: result.status,
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
