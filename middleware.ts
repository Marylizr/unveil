import { NextResponse, type NextRequest } from "next/server";

const encoder = new TextEncoder();
const ADMIN_SESSION_COOKIE = "unveil_admin_session";
const USER_SESSION_COOKIE = "unveil_user_session";

function base64urlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

function bytesToBase64url(bytes: ArrayBuffer) {
  const byteArray = new Uint8Array(bytes);
  let binary = "";
  for (let index = 0; index < byteArray.length; index += 1) {
    binary += String.fromCharCode(byteArray[index]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function verifySignedSession(token: string | undefined, secret: string | undefined) {
  if (!secret || !token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = bytesToBase64url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
  if (signature !== expected) return false;

  try {
    const session = JSON.parse(new TextDecoder().decode(base64urlToBytes(payload))) as { exp?: number };
    return typeof session.exp === "number" && session.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const protectedAccountPaths = ["/account", "/library", "/purchases", "/membership"];
  const isAccountPath = protectedAccountPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!isAdminPath || pathname === "/admin/login" || pathname.startsWith("/admin/api")) {
    if (!isAccountPath) return NextResponse.next();
  }

  if (isAdminPath) {
    const isAuthenticated = await verifySignedSession(
      request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
      process.env.ADMIN_SESSION_SECRET
    );
    if (isAuthenticated) return NextResponse.next();

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAccountPath) {
    const isAuthenticated = await verifySignedSession(
      request.cookies.get(USER_SESSION_COOKIE)?.value,
      process.env.USER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "unveil-local-user-session-secret"
    );
    if (isAuthenticated) return NextResponse.next();

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/library/:path*", "/purchases/:path*", "/membership/:path*"],
};
