import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import User, { type IUser } from "@/models/User";
import { connectToDatabase } from "@/lib/server/db";

export const USER_SESSION_COOKIE = "unveil_user_session";
export const USER_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

const SCRYPT_KEY_LENGTH = 64;

type UserSessionPayload = {
  exp: number;
  role: IUser["role"];
  sub: string;
};

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function getUserSessionSecret() {
  return process.env.USER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "unveil-local-user-session-secret";
}

export function createRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function createHashedToken() {
  const raw = createRawToken();
  return { raw, hash: hashToken(raw) };
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const key = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
  return `scrypt$${salt}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, key] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !key) return false;

  const candidate = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
  return timingSafeEqual(candidate.toString("base64url"), key);
}

export function createUserSession(user: Pick<IUser, "_id" | "role">) {
  const payload: UserSessionPayload = {
    sub: String(user._id),
    role: user.role,
    exp: Date.now() + USER_SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, getUserSessionSecret())}`;
}

export function verifyUserSession(token?: string) {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload, getUserSessionSecret());
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as UserSessionPayload;
    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setUserSessionCookie(user: Pick<IUser, "_id" | "role">) {
  cookies().set(USER_SESSION_COOKIE, createUserSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: USER_SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export function clearUserSessionCookie() {
  cookies().set(USER_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
}

export async function getCurrentUser() {
  const session = verifyUserSession(cookies().get(USER_SESSION_COOKIE)?.value);
  if (!session) return null;

  await connectToDatabase();
  return User.findById(session.sub).select("-passwordHash");
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export function createVerificationUrl(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;
}

export function createResetUrl(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
}

export function tokenHash(token: string) {
  return hashToken(token);
}
