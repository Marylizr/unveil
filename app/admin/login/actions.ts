"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSession,
  safeCompare,
} from "@/lib/admin/session";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function safeNext(value?: string) {
  if (!value?.startsWith("/admin") || value.startsWith("/admin/login")) return "/admin";
  return value;
}

function getLoginAttemptKey() {
  const headerStore = headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

function isLoginRateLimited(key: string) {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || record.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }

  if (record.count >= LOGIN_MAX_ATTEMPTS) return true;
  record.count += 1;
  return false;
}

function clearLoginAttempts(key: string) {
  loginAttempts.delete(key);
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const expectedUsername = process.env.ADMIN_USERNAME || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  const next = safeNext(String(formData.get("next") || ""));
  const attemptKey = getLoginAttemptKey();

  if (!expectedUsername || !expectedPassword || !process.env.ADMIN_SESSION_SECRET) {
    redirect("/admin/login?error=config");
  }

  if (isLoginRateLimited(attemptKey)) {
    redirect(`/admin/login?error=rate&next=${encodeURIComponent(next)}`);
  }

  const valid = safeCompare(username, expectedUsername) && safeCompare(password, expectedPassword);
  if (!valid) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  clearLoginAttempts(attemptKey);

  cookies().set(ADMIN_SESSION_COOKIE, createAdminSession(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: "/admin",
  });

  redirect(next);
}
