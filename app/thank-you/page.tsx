"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const resource = searchParams.get("resource");

  return (
    <div className="min-h-screen bg-cream px-6 pt-32 text-deep">
      <section className="mx-auto max-w-2xl border border-olive/20 bg-off-white p-8 md:p-10">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Almost there</p>
        <h1 className="font-serif text-5xl leading-tight md:text-6xl">Check your email to confirm access.</h1>
        <p className="mt-6 font-sans text-sm leading-relaxed text-olive/85">
          UNVEIL uses double opt-in to keep the list private, intentional, and compliant. Confirm your email, then your guide access will be sent securely.
        </p>
        {resource && (
          <p className="mt-4 font-sans text-xs uppercase tracking-widest text-olive/60">
            Resource requested: {resource.replace(/-/g, " ")}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/learn" className="inline-flex bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-cream">
            Read the journal
          </Link>
          <Link href="/privacy" className="inline-flex border border-olive/30 px-6 py-3 font-sans text-xs uppercase tracking-widest text-olive">
            Privacy policy
          </Link>
        </div>
      </section>
    </div>
  );
}
