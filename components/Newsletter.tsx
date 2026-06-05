"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { trackLeadSubmission, trackNewsletterSignup } from "@/lib/analytics";
import { createLead } from "@/lib/api";

const NEWSLETTER_CONSENT =
  "I agree to receive UNVEIL educational emails and understand I can unsubscribe at any time.";

export default function Newsletter() {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createLead({
        email,
        language,
        consent,
        source: "newsletter",
        interests: ["newsletter"],
        consentText: NEWSLETTER_CONSENT,
        consentVersion: "2026-05-31",
        privacyPolicyUrl: "/privacy",
      });
      trackLeadSubmission({ source: "newsletter", interests: "newsletter" });
      trackNewsletterSignup({ source: "newsletter", language });
      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="newsletter" className="editorial-section editorial-grain bg-deep px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold mb-6">{t.newsletter.label}</p>
        <h2 className="font-serif text-5xl md:text-7xl text-[#E8E8E2] leading-tight mb-6 whitespace-pre-line">
          {t.newsletter.title}
        </h2>
        <p className="font-sans text-base text-[rgba(232,232,226,0.72)] leading-relaxed mb-10 max-w-md mx-auto">
          {t.newsletter.body}
        </p>

        {status === "success" ? (
          <p className="font-sans text-sm text-[#E8E8E2] tracking-wider uppercase">
            Check your email to confirm your subscription.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="newsletter-email">
                {t.newsletter.placeholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                autoComplete="email"
                className="flex-1 rounded-full border border-[#E8E8E2]/25 bg-transparent px-5 py-3 font-sans text-sm text-[#E8E8E2] placeholder-[#E8E8E2]/45 focus:border-gold"
              />
              <button
                type="submit"
                disabled={!consent}
                className="rounded-full bg-[#E8E8E2] px-6 py-3 font-sans text-xs uppercase tracking-widest text-deep transition-colors duration-300 hover:bg-cream focus-visible:bg-cream whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.newsletter.cta}
              </button>
            </div>
            <label className="mt-4 flex items-start gap-3 text-left font-sans text-xs leading-relaxed text-[rgba(232,232,226,0.72)]">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-olive"
              />
              <span>{NEWSLETTER_CONSENT}</span>
            </label>
            <p className="mt-3 text-left font-sans text-[11px] leading-relaxed text-[rgba(232,232,226,0.62)]">
              We use your email for educational updates only. No sensitive health details are required. Read the{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-cream">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}

        {status === "error" && (
          <p className="font-sans text-xs text-cream mt-3">{t.newsletter.error}</p>
        )}
      </div>
    </section>
  );
}
