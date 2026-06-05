"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { unsubscribeLead } from "@/lib/api";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    unsubscribeLead(token)
      .then(() => setStatus("done"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-cream px-6 pt-32 text-deep">
      <section className="mx-auto max-w-2xl border border-olive/20 bg-off-white p-8">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Email preferences</p>
        {status === "loading" && <h1 className="font-serif text-5xl leading-tight">Updating your preferences.</h1>}
        {status === "done" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">You have been unsubscribed.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/80">
              You will no longer receive UNVEIL educational emails.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">This unsubscribe link is unavailable.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/80">
              The link may be invalid. You can contact UNVEIL to update your email preferences.
            </p>
          </>
        )}
        <Link href="/privacy" className="mt-8 inline-flex bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-cream">
          Privacy policy
        </Link>
      </section>
    </div>
  );
}

