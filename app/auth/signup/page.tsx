import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import User from "@/models/User";
import { sendEmail } from "@/server/email";
import {
  createHashedToken,
  createVerificationUrl,
  hashPassword,
  setUserSessionCookie,
} from "@/lib/auth/userAuth";
import { connectToDatabase } from "@/lib/server/db";

type SignupPageProps = {
  searchParams?: {
    error?: string;
  };
};

async function signup(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").toLowerCase().trim();
  const firstName = String(formData.get("firstName") || "").trim();
  const password = String(formData.get("password") || "");

  if (password.length < 10) {
    redirect("/auth/signup?error=password");
  }

  await connectToDatabase();
  const existing = await User.findOne({ email });
  if (existing) {
    redirect("/auth/signup?error=exists");
  }

  const verification = createHashedToken();
  const user = await User.create({
    email,
    firstName,
    role: "member",
    passwordHash: await hashPassword(password),
    isEmailVerified: false,
    emailVerificationTokenHash: verification.hash,
    emailVerificationTokenExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  const verifyUrl = createVerificationUrl(verification.raw);
  await sendEmail({
    to: email,
    subject: "Verify your UNVEIL account",
    html: `<p>Confirm your UNVEIL account:</p><p><a href="${verifyUrl}">Verify email</a></p>`,
    text: `Verify your UNVEIL account: ${verifyUrl}`,
  });

  setUserSessionCookie(user);
  redirect("/account?created=1");
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  return (
    <AuthCard
      eyebrow="Member foundation"
      title="Create account"
      body="Prepare your private UNVEIL account for future ebooks, guides, courses, and membership access."
    >
      <form action={signup} className="space-y-5">
        <label className="block">
          <span className="admin-label">First name</span>
          <input className="admin-input" name="firstName" type="text" autoComplete="given-name" />
        </label>
        <label className="block">
          <span className="admin-label">Email</span>
          <input className="admin-input" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="block">
          <span className="admin-label">Password</span>
          <input className="admin-input" name="password" type="password" autoComplete="new-password" minLength={10} required />
        </label>

        {searchParams?.error === "exists" && (
          <p className="font-sans text-sm text-red-200">An account already exists for that email.</p>
        )}
        {searchParams?.error === "password" && (
          <p className="font-sans text-sm text-red-200">Use at least 10 characters for your password.</p>
        )}

        <button className="w-full bg-mist px-5 py-3 font-sans text-xs uppercase tracking-widest text-deep transition-colors hover:bg-cream" type="submit">
          Create account
        </button>
      </form>
      <p className="mt-6 font-sans text-xs leading-relaxed text-sage">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-mist underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
