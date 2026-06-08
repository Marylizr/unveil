"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trackLeadMagnetDownload } from "@/lib/analytics";
import { getLeadMagnetDownload } from "@/lib/api";

export default function ProtectedDownloadPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const slug = params.slug;
  const [pdfUrl, setPdfUrl] = useState("");
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!slug || !token) {
      setStatus("error");
      return;
    }

    getLeadMagnetDownload(slug, token)
      .then((result) => {
        if (result.needsRedirect && result.downloadUrl) {
          window.location.replace(result.downloadUrl);
          return;
        }
        if (!result.pdfUrl) {
          throw new Error("PDF file is not attached in admin.");
        }
        setPdfUrl(result.pdfUrl);
        setTitle(result.title || "UNVEIL guide");
        setStatus("ready");
        trackLeadMagnetDownload({ source: "protected-download", lead_magnet_slug: slug });
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "The link may have expired. Please request the guide again to receive fresh access.");
        setStatus("error");
      });
  }, [slug, token]);

  return (
    <div className="min-h-screen bg-cream px-6 pt-32 text-deep">
      <section className="mx-auto max-w-2xl border border-olive/20 bg-off-white p-8 md:p-10">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">UNVEIL download</p>
        {status === "loading" && <h1 className="font-serif text-5xl leading-tight">Preparing your guide.</h1>}
        {status === "ready" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">Your guide is ready.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/85">
              This private access link is intended for confirmed subscribers.
            </p>
            {title && (
              <p className="mt-5 rounded-2xl border border-olive/15 bg-off-white px-5 py-4 font-sans text-sm text-olive">
                {title}
              </p>
            )}
            <a href={pdfUrl} className="mt-8 inline-flex bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-cream">
              Download PDF
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="font-serif text-5xl leading-tight">This download link is unavailable.</h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-olive/85">
              {errorMessage || "The link may have expired. Please request the guide again to receive fresh access."}
            </p>
            <Link href="/" className="mt-8 inline-flex bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-cream">
              Return home
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
