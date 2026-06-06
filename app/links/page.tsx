import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Unveil Links",
  description: "Free guides, articles, and education from Unveil.",
  openGraph: {
    title: "Unveil Links",
    description: "Free guides, articles, and education from Unveil.",
    type: "website",
  },
};

const secondaryLinks = [
  {
    href: "/learn",
    title: "Read the Unveil Journal",
    subtitle: "Editorial guides on hygiene, pleasure, body literacy, and mature confidence.",
  },
  {
    href: "/modern-man-code",
    title: "The Modern Man Code",
    subtitle: "A foundational digital guide to refined masculine care and self-respect.",
  },
  {
    href: "/understanding-female-pleasure",
    title: "Understanding Female Pleasure",
    subtitle: "Communication, anatomy literacy, emotional safety, and attentive intimacy.",
  },
  {
    href: "/the-art-of-connection",
    title: "The Art of Connection",
    subtitle: "Presence, calm confidence, communication, and emotionally intelligent dating.",
  },
  {
    href: "/#newsletter",
    title: "Join the Newsletter",
    subtitle: "Private educational updates for men who prefer substance over noise.",
  },
  {
    href: "/",
    title: "Visit Unveil",
    subtitle: "Enter the full platform for education, resources, and the latest releases.",
  },
];

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-deep px-5 py-8 text-cream sm:px-6 sm:py-12">
      <div className="absolute inset-0 editorial-grain opacity-40" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(178,142,94,0.24),rgba(175,171,134,0.08)_42%,transparent_68%)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-12rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(77,92,42,0.34),transparent_66%)] blur-2xl"
        aria-hidden="true"
      />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[600px] flex-col py-6">
        <header className="mb-9 text-center">
          <div className="mb-7 flex justify-center">
            <BrandLogo variant="white" context="footer" />
          </div>
          <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-[rgba(232,232,226,0.76)]">
            Male pleasure, hygiene, confidence & sexual health education.
          </p>
        </header>

        <div className="rounded-[30px] border border-[#E8E8E2]/14 bg-[#E8E8E2]/[0.075] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur">
          <Link
            href="/lead-magnets/7-hygiene-mistakes"
            className="links-primary-cta group block rounded-[24px] border border-gold/35 bg-[#F4F1E8] p-6 text-deep transition duration-300 hover:-translate-y-0.5 hover:border-gold focus-visible:-translate-y-0.5 sm:p-7"
            aria-label="Download the free guide: The 7 Hygiene Mistakes Most Men Make"
            data-track="links-primary-guide"
          >
            <span className="mb-5 inline-flex rounded-full bg-deep px-4 py-2 font-sans text-[10px] uppercase tracking-[0.26em] text-gold">
              Free guide
            </span>
            <h1 className="font-serif text-4xl leading-[1.04] text-deep sm:text-5xl">
              Free Guide: The 7 Hygiene Mistakes Most Men Make
            </h1>
            <p className="mt-5 font-sans text-sm leading-relaxed text-[#5F6648] sm:text-[15px]">
              A practical, science-backed guide to help men upgrade the hygiene habits nobody ever properly taught them.
            </p>
            <span className="mt-7 flex min-h-[52px] items-center justify-center rounded-full bg-deep px-6 text-center font-sans text-xs uppercase tracking-widest text-[#E8E8E2] transition-colors group-hover:bg-olive">
              Download the Free Guide
            </span>
          </Link>
        </div>

        <div className="mt-4 grid gap-3" aria-label="Unveil links">
          {secondaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="links-secondary-card group block rounded-[22px] border border-[#E8E8E2]/12 bg-[#E8E8E2]/[0.055] px-5 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-gold/45 hover:bg-[#E8E8E2]/[0.085] focus-visible:-translate-y-0.5"
              data-track={`links-${item.href.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home"}`}
            >
              <span className="block font-sans text-[13px] font-semibold leading-tight text-[#F4F1E8]">
                {item.title}
              </span>
              <span className="mt-2 block font-sans text-xs leading-relaxed text-[rgba(232,232,226,0.62)]">
                {item.subtitle}
              </span>
            </Link>
          ))}
        </div>

        <footer className="mt-auto pt-10 text-center">
          <p className="mx-auto max-w-sm font-sans text-xs leading-relaxed text-[rgba(232,232,226,0.58)]">
            Education for men who want to understand their body, intimacy, and confidence with more honesty.
          </p>
          <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.28em] text-gold">@unveil</p>
        </footer>
      </section>
    </main>
  );
}
