import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "unveil_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

type AdminSessionPayload = {
  exp: number;
  sub: string;
};

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function createAdminSession(username: string) {
  const secret = getAdminSessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is required");

  const payload: AdminSessionPayload = {
    sub: username,
    exp: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyAdminSession(token?: string) {
  const secret = getAdminSessionSecret();
  if (!secret || !token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expected = sign(encodedPayload, secret);
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function safeCompare(a = "", b = "") {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    crypto.timingSafeEqual(left, left);
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}
