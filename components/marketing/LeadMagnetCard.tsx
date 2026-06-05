"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { trackLeadSubmission } from "@/lib/analytics";
import { createLead } from "@/lib/api";
import { leadMagnetFallbackImage } from "@/lib/brandAssets";
import type { LeadMagnet } from "@/types/content";

const LEAD_MAGNET_CONSENT =
  "I agree to receive UNVEIL educational emails and understand I can unsubscribe at any time.";

export default function LeadMagnetCard({ leadMagnet, source = "homepage-lead-magnet" }: { leadMagnet: LeadMagnet; source?: string }) {
  const { language } = useLanguage();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const imageUrl = leadMagnet.coverImage?.url || leadMagnetFallbackImage();
  const imageAlt = leadMagnet.coverImage?.alt || `${leadMagnet.title} cover`;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("idle");

    try {
      await createLead({
        email,
        language,
        consent,
        interests: [leadMagnet.category],
        source,
        requestedLeadMagnetSlug: leadMagnet.slug,
        consentText: LEAD_MAGNET_CONSENT,
        consentVersion: "2026-05-31",
        privacyPolicyUrl: "/privacy",
      });
      trackLeadSubmission({
        source,
        interests: leadMagnet.category,
        lead_magnet_slug: leadMagnet.slug,
      });
      setEmail("");
      setConsent(false);
      setStatus("success");
      router.push(`/thank-you?resource=${encodeURIComponent(leadMagnet.slug)}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.article
      data-unveil-card
      initial={shouldReduceMotion ? false : { opacity: 1, y: 18, scale: 0.992 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-1 overflow-hidden rounded-[32px] border border-[rgba(77,80,57,0.18)] bg-[#F4F1E8] text-[#202315] transition-colors duration-300 hover:border-gold/45 md:grid-cols-[0.82fr_1.18fr]"
    >
      <div className="relative min-h-[300px] bg-[#ABAC96]/35 p-6">
        <div className="mx-auto flex h-full max-w-[280px] items-center justify-center rounded-[24px] bg-[#E8E8E2] p-4 shadow-[0_24px_60px_rgba(26,32,16,0.16)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-1">
          <img src={imageUrl} alt={imageAlt} className="aspect-[4/5] w-full rounded-[18px] object-cover" loading="lazy" decoding="async" />
        </div>
        <span className="absolute bottom-8 left-8 h-px w-16 origin-left scale-x-50 bg-gold/60 transition-transform duration-700 group-hover:scale-x-100" />
      </div>
      <div className="p-8 md:p-10">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">{leadMagnet.category}</p>
        <span className="mb-6 block h-px w-10 bg-gold/35 transition-all duration-500 group-hover:w-20 group-hover:bg-gold/70" />
        <h3 className="font-sans text-4xl leading-tight text-deep">{leadMagnet.title}</h3>
        <p className="mt-5 font-sans text-sm leading-relaxed text-[#5F6648]">{leadMagnet.description}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor={`lead-${leadMagnet.slug}`}>
              Email address
            </label>
            <input
              id={`lead-${leadMagnet.slug}`}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className="min-w-0 flex-1 rounded-full border border-olive/30 bg-transparent px-5 py-3 font-sans text-sm text-deep placeholder-olive/45 focus:border-gold"
            />
            <button
              type="submit"
              disabled={!consent}
              className="rounded-full bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-cream transition-colors hover:bg-forest focus-visible:bg-forest disabled:cursor-not-allowed disabled:opacity-50"
            >
              Receive guide
            </button>
          </div>
          <label className="flex items-start gap-3 font-sans text-xs leading-relaxed text-[#5F6648]">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-olive"
            />
            <span>{LEAD_MAGNET_CONSENT} We handle wellness topics with discretion.</span>
          </label>
          <p className="font-sans text-[11px] leading-relaxed text-[#5F6648]/80">
            Your email is used to deliver this resource and send occasional educational updates. No sensitive health details are required. Read the{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-deep">
              Privacy Policy
            </Link>
            .
          </p>
          {status === "success" && <p className="font-sans text-xs uppercase tracking-widest text-olive">Check your inbox to confirm access.</p>}
          {status === "error" && <p className="font-sans text-xs text-red-800">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </motion.article>
  );
}
