"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmLeadEmail } from "@/lib/api";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "confirmed" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    confirmLeadEmail(token)
      .then(() => setStatus("confirmed"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-cream px-6 pt-32 text-deep">
      <section className="mx-auto max-w-2xl border border-olive/20 bg-off-white p-8">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Email confirmation</p>
        {status === "loading" && <h1 className="font-serif text-5xl leading-tight">Confirming your subscription.</h1>}
        {status === "confirmed" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">You are confirmed.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/80">
              Welcome to UNVEIL. Your educational updates are now active.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">This confirmation link is unavailable.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/80">
              The link may have expired. Please submit the form again to receive a fresh confirmation email.
            </p>
          </>
        )}
        <Link href="/" className="mt-8 inline-flex bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-cream">
          Return home
        </Link>
      </section>
    </div>
  );
}

