import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/server/db";
import { setUserSessionCookie, verifyPassword } from "@/lib/auth/userAuth";

type LoginPageProps = {
  searchParams?: {
    error?: string;
    next?: string;
    verified?: string;
  };
};

function safeNext(value?: string) {
  if (!value?.startsWith("/") || value.startsWith("//") || value.startsWith("/auth")) return "/account";
  return value;
}

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const next = safeNext(String(formData.get("next") || ""));

  await connectToDatabase();
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect(`/auth/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  user.lastLoginAt = new Date();
  await user.save();
  setUserSessionCookie(user);
  redirect(next);
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const next = safeNext(searchParams?.next);

  return (
    <AuthCard
      eyebrow="Member access"
      title="Sign in"
      body="Access your future UNVEIL library, account settings, and membership area."
    >
      <form action={login} className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="admin-label">Email</span>
          <input className="admin-input" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="block">
          <span className="admin-label">Password</span>
          <input className="admin-input" name="password" type="password" autoComplete="current-password" required />
        </label>

        {searchParams?.error === "invalid" && (
          <p className="font-sans text-sm text-red-200">The email or password is incorrect.</p>
        )}
        {searchParams?.verified === "1" && (
          <p className="font-sans text-sm text-mist">Email verified. You can sign in now.</p>
        )}

        <button className="w-full bg-mist px-5 py-3 font-sans text-xs uppercase tracking-widest text-deep transition-colors hover:bg-cream" type="submit">
          Sign in
        </button>
      </form>
      <div className="mt-6 flex justify-between gap-4 font-sans text-xs uppercase tracking-widest text-sage">
        <Link href="/auth/signup" className="hover:text-cream">Create account</Link>
        <Link href="/auth/forgot-password" className="hover:text-cream">Forgot password</Link>
      </div>
    </AuthCard>
  );
}
