import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Success | UNVEIL",
  description: "Your UNVEIL order is being confirmed.",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F4F1E8] px-6 py-32 text-deep">
      <section className="mx-auto max-w-3xl rounded-[40px] bg-white p-[clamp(2rem,5vw,4rem)]">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">Payment received</p>
        <h1 className="font-serif text-5xl leading-tight md:text-7xl">Your guide is being prepared.</h1>
        <p className="mt-6 font-sans text-base leading-relaxed text-[#5F6648]">
          If payment was completed, Stripe will confirm it securely and UNVEIL will email your protected download link.
          This can take a moment.
        </p>
        <Link href="/learn" className="mt-8 inline-flex rounded-full bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-[#E8E8E2]">
          Continue reading
        </Link>
      </section>
    </main>
  );
}
