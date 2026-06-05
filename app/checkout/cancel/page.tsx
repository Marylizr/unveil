import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Canceled | UNVEIL",
  description: "Return to UNVEIL digital guides.",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#F4F1E8] px-6 py-32 text-deep">
      <section className="mx-auto max-w-3xl rounded-[40px] bg-white p-[clamp(2rem,5vw,4rem)]">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">Checkout canceled</p>
        <h1 className="font-serif text-5xl leading-tight md:text-7xl">No payment was completed.</h1>
        <p className="mt-6 font-sans text-base leading-relaxed text-[#5F6648]">
          You can return to the guide when you are ready. No entitlement is created unless Stripe confirms payment.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-deep px-6 py-3 font-sans text-xs uppercase tracking-widest text-[#E8E8E2]">
            View resources
          </Link>
          <Link href="/learn" className="rounded-full border border-olive/25 px-6 py-3 font-sans text-xs uppercase tracking-widest text-olive">
            Read journal
          </Link>
        </div>
      </section>
    </main>
  );
}
