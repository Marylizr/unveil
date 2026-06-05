import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "UNVEIL terms for educational wellness content, lead magnets, and pre-commerce product previews.",
  openGraph: {
    title: "UNVEIL Terms & Conditions",
    description: "Terms for using UNVEIL educational content and pre-commerce wellness resources.",
  },
};

const sections = [
  {
    title: "Educational purpose",
    body: "UNVEIL provides educational wellness content for adults interested in hygiene, body literacy, emotional intelligence, intimacy education, grooming, and modern self-care. Content is informational and does not replace professional medical advice.",
  },
  {
    title: "Product previews",
    body: "Product pages may describe future physical, digital, or service-based resources. Checkout is not enabled yet. Final product, delivery, refund, and support terms should be completed before monetization.",
  },
  {
    title: "Responsible use",
    body: "Visitors are responsible for using UNVEIL content thoughtfully and for seeking qualified professional support when symptoms, distress, or safety concerns are present.",
  },
  {
    title: "Intellectual property",
    body: "UNVEIL content, visuals, copy, educational frameworks, and brand assets are owned by UNVEIL or its licensors and may not be reused without permission.",
  },
  {
    title: "Updates",
    body: "These terms are an MVP foundation and may be updated as commerce, digital products, services, or regional availability are introduced.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream pt-24 text-deep">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Legal</p>
        <h1 className="mb-8 font-serif text-5xl leading-tight md:text-7xl">Terms & Conditions</h1>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-olive/20 pt-6">
              <h2 className="font-serif text-3xl leading-tight">{section.title}</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-olive">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

