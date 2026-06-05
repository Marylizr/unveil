import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "UNVEIL Links",
  description: "Start with UNVEIL's educational guides, journal, and discreet wellness resources.",
  openGraph: {
    title: "UNVEIL Links",
    description: "Educational male wellness resources from UNVEIL.",
    type: "website",
  },
};

const links = [
  {
    href: "/lead-magnets/body-literacy-checklist",
    label: "Free body literacy checklist",
    body: "Begin with a discreet, educational self-care framework.",
  },
  {
    href: "/learn",
    label: "Read the journal",
    body: "Body literacy, hygiene, emotional intelligence, and modern self-care.",
  },
  {
    href: "/products",
    label: "Explore resources",
    body: "Education-first tools and digital guides, without pressure.",
  },
  {
    href: "/responsible-use",
    label: "Responsible use",
    body: "Clear boundaries for educational wellness content.",
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-deep px-6 pt-28 text-cream">
      <section className="mx-auto max-w-xl py-12">
        <div className="mb-10 flex justify-center">
          <BrandLogo variant="white" context="footer" />
        </div>
        <div className="mb-10 text-center">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-mist/70">UNVEIL</p>
          <h1 className="font-serif text-5xl leading-tight">Education before products.</h1>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-sage">
            Premium male wellness education for body literacy, hygiene, emotional intelligence, and discreet self-care.
          </p>
        </div>
        <div className="space-y-3">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="block border border-forest/60 bg-forest/20 p-5 transition-colors hover:border-mist/40">
              <span className="font-sans text-xs uppercase tracking-widest text-mist">{item.label}</span>
              <span className="mt-2 block font-sans text-sm leading-relaxed text-sage">{item.body}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
