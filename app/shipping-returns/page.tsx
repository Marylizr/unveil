import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "UNVEIL shipping and returns readiness for future wellness essentials, digital guides, and educational resources.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-cream pt-24 text-deep">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Legal</p>
        <h1 className="mb-8 font-serif text-5xl leading-tight md:text-7xl">Shipping & Returns</h1>
        <div className="space-y-8 font-sans text-sm leading-relaxed text-olive">
          <p>
            UNVEIL checkout is not active yet. This page sets expectations for future physical products, digital guides, and service-based resources.
          </p>
          <section className="border-t border-olive/20 pt-6">
            <h2 className="font-serif text-3xl leading-tight text-deep">Physical products</h2>
            <p className="mt-3">
              Future shipping timelines, regions, fulfillment partners, discreet packaging standards, and tracking details should be shown before purchase.
            </p>
          </section>
          <section className="border-t border-olive/20 pt-6">
            <h2 className="font-serif text-3xl leading-tight text-deep">Digital guides</h2>
            <p className="mt-3">
              Digital resources should be delivered by email or account access after purchase. Refund terms for digital content should be stated clearly before checkout is enabled.
            </p>
          </section>
          <section className="border-t border-olive/20 pt-6">
            <h2 className="font-serif text-3xl leading-tight text-deep">Returns</h2>
            <p className="mt-3">
              For hygiene-sensitive items, return eligibility may be limited once packaging is opened. Final rules should be clear, fair, and compliant with applicable consumer law.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}

