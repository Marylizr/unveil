import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/server/db";
import { getAppUrl } from "@/server/email";
import { trackSequenceClick } from "@/server/services/emailSequenceService";

export const dynamic = "force-dynamic";

function safeRedirectTarget(rawTarget: string | null, requestOrigin: string) {
  const fallback = new URL("/learn", requestOrigin);
  if (!rawTarget) return fallback;

  try {
    const target = rawTarget.startsWith("/") ? new URL(rawTarget, requestOrigin) : new URL(rawTarget);
    const allowedOrigins = new Set([requestOrigin]);

    try {
      allowedOrigins.add(new URL(getAppUrl()).origin);
    } catch {
      // Keep request origin as the safe fallback when the app URL is not configured.
    }

    return allowedOrigins.has(target.origin) ? target : fallback;
  } catch {
    return fallback;
  }
}

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const requestUrl = new URL(request.url);

  await connectToDatabase()
    .then(() => trackSequenceClick(params.token))
    .catch(() => false);

  const target = safeRedirectTarget(requestUrl.searchParams.get("url"), requestUrl.origin);
  return NextResponse.redirect(target);
}
