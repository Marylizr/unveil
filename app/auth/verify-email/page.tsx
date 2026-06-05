import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/server/db";
import { tokenHash } from "@/lib/auth/userAuth";

type VerifyEmailPageProps = {
  searchParams?: {
    token?: string;
  };
};

async function verifyEmail(token?: string) {
  if (!token) return false;

  await connectToDatabase();
  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash(token),
    emailVerificationTokenExpiresAt: { $gt: new Date() },
  }).select("+emailVerificationTokenHash +emailVerificationTokenExpiresAt");

  if (!user) return false;

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationTokenExpiresAt = undefined;
  await user.save();
  return true;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const verified = await verifyEmail(searchParams?.token);

  return (
    <AuthCard
      eyebrow="Email verification"
      title={verified ? "Email verified" : "Link unavailable"}
      body={verified ? "Your UNVEIL account email has been confirmed." : "This verification link is invalid or expired."}
    >
      <Link href="/account" className="inline-flex bg-mist px-5 py-3 font-sans text-xs uppercase tracking-widest text-deep transition-colors hover:bg-cream">
        Continue
      </Link>
    </AuthCard>
  );
}
