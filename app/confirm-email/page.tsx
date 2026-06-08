"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmLeadEmail } from "@/lib/api";

type ConfirmState = {
  status: "loading" | "confirmed" | "error";
  downloadUrl?: string;
  leadMagnetTitle?: string;
  leadMagnetSlug?: string;
  downloadError?: string;
};

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState<ConfirmState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "error" });
      return;
    }

    confirmLeadEmail(token)
      .then((result) =>
        setState({
          status: "confirmed",
          downloadUrl: result.downloadUrl,
          leadMagnetTitle: result.leadMagnetTitle,
          leadMagnetSlug: result.leadMagnetSlug,
          downloadError: result.downloadError,
        })
      )
      .catch(() => setState({ status: "error" }));
  }, [token]);

  return (
    <div className="min-h-screen bg-cream px-6 pt-32 text-deep">
      <section className="mx-auto max-w-2xl rounded-[28px] border border-olive/20 bg-off-white p-8 shadow-[0_24px_70px_rgba(26,32,16,0.12)] md:p-10">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Email confirmation</p>
        {state.status === "loading" && <h1 className="font-serif text-5xl leading-tight">Confirming your subscription.</h1>}
        {state.status === "confirmed" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">Your guide is ready.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/80">
              Your email is confirmed. You can now access the requested UNVEIL guide securely.
            </p>
            {state.leadMagnetTitle && (
              <p className="mt-5 rounded-2xl border border-olive/15 bg-cream px-5 py-4 font-sans text-sm text-olive">
                {state.leadMagnetTitle}
              </p>
            )}
            {state.downloadUrl ? (
              <Link href={state.downloadUrl} className="mt-8 inline-flex bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-cream">
                Download guide
              </Link>
            ) : (
              <div className="mt-8 rounded-2xl border border-gold/30 bg-cream px-5 py-4">
                <p className="font-sans text-sm leading-relaxed text-olive/85">
                  Your subscription is confirmed, but no downloadable guide link was generated.
                </p>
                {state.downloadError && (
                  <p className="mt-3 font-sans text-xs leading-relaxed text-red-900">
                    Admin note: {state.downloadError}
                  </p>
                )}
                {state.leadMagnetSlug && (
                  <p className="mt-3 font-sans text-xs uppercase tracking-widest text-olive/60">
                    Requested resource: {state.leadMagnetSlug.replace(/-/g, " ")}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        {state.status === "error" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">This confirmation link is unavailable.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/80">
              The link may have expired. Please submit the form again to receive a fresh confirmation email.
            </p>
          </>
        )}
        <Link href="/" className="mt-8 inline-flex border border-olive/30 px-6 py-3 font-sans text-xs uppercase tracking-widest text-olive">
          Return home
        </Link>
      </section>
    </div>
  );
}
