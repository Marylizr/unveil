import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/server/db";
import { hashPassword, tokenHash } from "@/lib/auth/userAuth";

type ResetPasswordPageProps = {
  searchParams?: {
    error?: string;
    token?: string;
  };
};

async function resetPassword(formData: FormData) {
  "use server";

  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  if (!token || password.length < 10) {
    redirect(`/auth/reset-password?token=${encodeURIComponent(token)}&error=invalid`);
  }

  await connectToDatabase();
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash(token),
    passwordResetTokenExpiresAt: { $gt: new Date() },
  }).select("+passwordHash +passwordResetTokenHash +passwordResetTokenExpiresAt");

  if (!user) {
    redirect("/auth/reset-password?error=expired");
  }

  user.passwordHash = await hashPassword(password);
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  await user.save();
  redirect("/auth/login?reset=1");
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = searchParams?.token || "";

  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Choose a new password"
      body="Use a strong password with at least 10 characters."
    >
      {!token ? (
        <p className="font-sans text-sm leading-relaxed text-sage">
          This reset link is missing or incomplete.{" "}
          <Link href="/auth/forgot-password" className="text-mist underline underline-offset-4">
            Request a new link.
          </Link>
        </p>
      ) : (
        <form action={resetPassword} className="space-y-5">
          <input type="hidden" name="token" value={token} />
          <label className="block">
            <span className="admin-label">New password</span>
            <input className="admin-input" name="password" type="password" autoComplete="new-password" minLength={10} required />
          </label>
          {searchParams?.error && (
            <p className="font-sans text-sm text-red-200">This reset link is invalid or expired.</p>
          )}
          <button className="w-full bg-mist px-5 py-3 font-sans text-xs uppercase tracking-widest text-deep transition-colors hover:bg-cream" type="submit">
            Update password
          </button>
        </form>
      )}
    </AuthCard>
  );
}
