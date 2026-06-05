import AuthCard from "@/components/auth/AuthCard";
import User from "@/models/User";
import { sendEmail } from "@/server/email";
import { connectToDatabase } from "@/lib/server/db";
import { createHashedToken, createResetUrl } from "@/lib/auth/userAuth";
import { redirect } from "next/navigation";

type ForgotPasswordPageProps = {
  searchParams?: {
    sent?: string;
  };
};

async function requestReset(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").toLowerCase().trim();
  await connectToDatabase();
  const user = await User.findOne({ email }).select("+passwordResetTokenHash +passwordResetTokenExpiresAt");

  if (user) {
    const reset = createHashedToken();
    user.passwordResetTokenHash = reset.hash;
    user.passwordResetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = createResetUrl(reset.raw);
    await sendEmail({
      to: email,
      subject: "Reset your UNVEIL password",
      html: `<p>Reset your UNVEIL password:</p><p><a href="${resetUrl}">Reset password</a></p>`,
      text: `Reset your UNVEIL password: ${resetUrl}`,
    });
  }

  redirect("/auth/forgot-password?sent=1");
}

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Reset access"
      body="Enter your email and, if an account exists, UNVEIL will send a reset link."
    >
      {searchParams?.sent === "1" ? (
        <p className="font-sans text-sm leading-relaxed text-sage">If that email exists, a reset link has been sent.</p>
      ) : (
        <form
          action={requestReset}
          className="space-y-5"
        >
          <label className="block">
            <span className="admin-label">Email</span>
            <input className="admin-input" name="email" type="email" autoComplete="email" required />
          </label>
          <button className="w-full bg-mist px-5 py-3 font-sans text-xs uppercase tracking-widest text-deep transition-colors hover:bg-cream" type="submit">
            Send reset link
          </button>
        </form>
      )}
    </AuthCard>
  );
}
