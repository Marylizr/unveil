"use client";

import { useSearchParams } from "next/navigation";
import { login } from "./actions";

function safeNext(value?: string | null) {
  if (!value?.startsWith("/admin") || value.startsWith("/admin/login")) return "/admin";
  return value;
}

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const next = safeNext(searchParams.get("next"));

  return (
    <form action={login} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="admin-label">Username</span>
        <input
          className="admin-input"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
      </label>
      <label className="block">
        <span className="admin-label">Password</span>
        <input
          className="admin-input"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error === "invalid" && (
        <p className="font-sans text-sm text-red-200">The username or password is incorrect.</p>
      )}
      {error === "config" && (
        <p className="font-sans text-sm text-red-200">Admin login is not configured. Check the required environment variables.</p>
      )}
      {error === "rate" && (
        <p className="font-sans text-sm text-red-200">Too many login attempts. Please wait and try again.</p>
      )}

      <button className="w-full bg-mist px-5 py-3 font-sans text-xs uppercase tracking-widest text-deep transition-colors hover:bg-cream" type="submit">
        Sign in
      </button>
    </form>
  );
}
