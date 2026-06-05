"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { trackLeadSubmission, trackNewsletterSignup } from "@/lib/analytics";
import { createLead } from "@/lib/api";

const NEWSLETTER_CONSENT =
  "I agree to receive UNVEIL educational emails and understand I can unsubscribe at any time.";

const subscriptionCards = [
  {
    id: "journal",
    eyebrow: "Journal",
    title: "Educational notes",
    body: "Weekly body literacy, hygiene, emotional intelligence, and self-care essays.",
  },
  {
    id: "resources",
    eyebrow: "Resources",
    title: "Guides & early access",
    body: "Launch resources, PDF drops, and selected product education before public release.",
  },
];

export default function HomeNewsletterSplit() {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 0.55, 1], shouldReduceMotion ? [0, 0, 0] : [34, 0, -44]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0.72, 1, 1, 0.78]);
  const ruleScale = useTransform(scrollYProgress, [0.12, 0.58], shouldReduceMotion ? [1, 1] : [0.18, 1]);

  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(["journal"]);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function toggleInterest(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createLead({
        email,
        language,
        consent,
        source: "newsletter",
        interests: selected.length ? selected : ["newsletter"],
        consentText: NEWSLETTER_CONSENT,
        consentVersion: "2026-05-31",
        privacyPolicyUrl: "/privacy",
      });
      trackLeadSubmission({ source: "newsletter", interests: selected.join(",") || "newsletter" });
      trackNewsletterSignup({ source: "newsletter", language });
      setStatus("success");
      setEmail("");
      setSelected(["journal"]);
      setConsent(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section ref={sectionRef} id="newsletter" className="bg-[#E8E8E2] px-6 py-[clamp(5rem,8vw,8rem)]">
      <div className="mx-auto grid max-w-7xl gap-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[0.86fr_1.14fr]">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-gold">{t.newsletter.label}</p>
          <motion.h2
            style={{ y: titleY, opacity: titleOpacity }}
            className="font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.82] text-deep"
          >
            Join the
            <br />
            private
            <br />
            notes.
          </motion.h2>
          <motion.div
            style={{ scaleX: ruleScale }}
            className="mt-9 h-px w-40 origin-left bg-gold/55"
          />
          <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-[#5F6648]">
            {t.newsletter.body}
          </p>
        </div>

        <div className="reveal rounded-[40px] bg-[#F4F1E8] p-[clamp(1rem,2vw,1.5rem)] shadow-[0_24px_70px_rgba(26,32,16,0.08)]">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {subscriptionCards.map((card) => {
                const checked = selected.includes(card.id);
                return (
                  <label
                    key={card.id}
                    className={`group min-h-[280px] cursor-pointer rounded-[32px] border p-7 transition duration-300 hover:-translate-y-1 ${
                      checked
                        ? "border-gold/55 bg-[#1A2010] text-[#E8E8E2]"
                        : "border-[rgba(77,80,57,0.16)] bg-[#E8E8E2] text-deep hover:border-gold/45"
                    }`}
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className={`font-sans text-[11px] uppercase tracking-[0.26em] ${checked ? "text-gold" : "text-[#7E8B78]"}`}>
                        {card.eyebrow}
                      </span>
                      <span
                        className={`grid h-6 w-6 place-items-center rounded-full border transition ${
                          checked ? "border-gold bg-gold text-deep" : "border-olive/30 bg-[#F4F1E8] text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        <span className="font-sans text-xs font-bold">✓</span>
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInterest(card.id)}
                      className="sr-only"
                    />
                    <span className="mt-16 block font-sans text-3xl font-semibold leading-tight">{card.title}</span>
                    <span className={`mt-5 block font-sans text-sm leading-relaxed ${checked ? "text-[rgba(232,232,226,0.72)]" : "text-[#5F6648]"}`}>
                      {card.body}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="rounded-[32px] border border-[rgba(77,80,57,0.16)] bg-white p-[clamp(1.25rem,3vw,2rem)]">
              {status === "success" ? (
                <p className="font-sans text-sm uppercase tracking-[0.18em] text-deep">
                  Check your email to confirm your subscription.
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="sr-only" htmlFor="home-newsletter-email">
                      {t.newsletter.placeholder}
                    </label>
                    <input
                      id="home-newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t.newsletter.placeholder}
                      autoComplete="email"
                      className="min-h-[50px] flex-1 rounded-full border border-olive/20 bg-[#F4F1E8] px-5 font-sans text-sm font-medium text-deep placeholder-[#5F6648]/60 outline-none transition focus:border-gold focus:bg-white"
                    />
                    <button
                      type="submit"
                      disabled={!consent || selected.length === 0}
                      className="min-h-[50px] rounded-full bg-deep px-7 font-sans text-xs uppercase tracking-widest text-[#E8E8E2] transition hover:bg-olive disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.newsletter.cta}
                    </button>
                  </div>
                  <label className="mt-5 flex items-start gap-3 font-sans text-xs leading-relaxed text-[#5F6648]">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#B28E5E]"
                    />
                    <span>{NEWSLETTER_CONSENT}</span>
                  </label>
                  <p className="mt-3 font-sans text-[11px] leading-relaxed text-[#5F6648]">
                    We use your email for educational updates only. Read the{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-deep">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </>
              )}

              {status === "error" && (
                <p className="mt-4 font-sans text-xs text-red-900">{t.newsletter.error}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
