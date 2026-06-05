import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import type { SalesProductSlug } from "@/lib/salesProducts";
import { salesProducts } from "@/lib/salesProducts";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
}

export default function SalesPage({ slug }: { slug: SalesProductSlug }) {
  const product = salesProducts[slug];

  return (
    <main className="min-h-screen bg-[#F4F1E8] text-deep">
      <section className="relative overflow-hidden bg-deep px-6 pb-20 pt-32 text-[#E8E8E2] md:pb-28">
        <div className="absolute inset-0 editorial-grain opacity-35" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-gold">Digital education</p>
            <h1 className="font-serif text-6xl leading-tight md:text-8xl">{product.title}</h1>
            <p className="mt-7 max-w-2xl font-sans text-base leading-relaxed text-[rgba(232,232,226,0.74)] md:text-lg">
              {product.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#checkout"
                className="rounded-full bg-[#E8E8E2] px-7 py-4 text-center font-sans text-xs uppercase tracking-widest text-deep transition hover:bg-[#F4F1E8]"
              >
                Get instant access
              </a>
              <Link
                href="#checkout"
                className="rounded-full border border-[#E8E8E2]/25 px-7 py-4 text-center font-sans text-xs uppercase tracking-widest text-[#E8E8E2] transition hover:border-gold"
              >
                Start checkout
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md rounded-[42px] border border-[#E8E8E2]/12 bg-[#E8E8E2]/8 p-4 shadow-[0_32px_90px_rgba(0,0,0,0.28)]">
            <img src={product.image} alt={`${product.title} digital guide cover`} className="w-full rounded-[32px] object-cover" />
          </div>
        </div>
      </section>

      <section className="px-6 py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[36px] bg-[#E8E8E2] p-[clamp(1.5rem,4vw,3rem)]">
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">Positioning</p>
            <h2 className="font-serif text-5xl leading-tight text-deep">For education first, sales second.</h2>
            <p className="mt-5 font-sans text-sm leading-relaxed text-[#5F6648]">
              Built as a private learning resource for adults who want calm, responsible, non-explicit education.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard title="Who it is for" items={product.audience} />
            <InfoCard title="What it teaches" items={product.teaches} />
          </div>
        </div>
      </section>

      <section className="bg-[#E8E8E2] px-6 py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <InfoCard title="Benefits" items={product.benefits} />
          <InfoCard title="Chapter list" items={product.chapters} />
          <InfoCard title="Included" items={product.included} />
        </div>
      </section>

      <section id="checkout" className="px-6 py-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto grid max-w-5xl gap-8 rounded-[42px] bg-deep p-[clamp(2rem,5vw,4rem)] text-[#E8E8E2] md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">Secure checkout</p>
            <h2 className="font-serif text-5xl leading-tight">{formatPrice(product.price, product.currency)}</h2>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-[rgba(232,232,226,0.72)]">
              Enter the email where your protected download link should be delivered after payment confirmation.
            </p>
          </div>
          <div className="w-full md:w-80">
            <CheckoutButton productSlug={product.slug} />
          </div>
        </div>
      </section>

      <section className="bg-[#F4F1E8] px-6 pb-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">FAQ</p>
          <div className="grid gap-4">
            {product.faq.map(([question, answer]) => (
              <div key={question} className="rounded-[28px] border border-[rgba(77,80,57,0.16)] bg-white p-6">
                <h3 className="font-sans text-xl font-semibold text-deep">{question}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-[#5F6648]">{answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[28px] bg-[#E8E8E2] p-6 font-sans text-sm leading-relaxed text-[#5F6648]">
            <strong className="text-deep">Responsible use:</strong> UNVEIL provides educational wellness content only. It does not replace medical, psychological, or relationship safety support. For persistent pain, infection symptoms, erectile dysfunction, severe anxiety, depression, or relationship violence, seek qualified professional help.
            <span className="mt-3 block">
              Read our <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link> and{" "}
              <Link href="/terms" className="underline underline-offset-4">Terms</Link>.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <article className="rounded-[32px] border border-[rgba(77,80,57,0.16)] bg-white p-[clamp(1.5rem,3vw,2.25rem)]">
      <h2 className="font-sans text-2xl font-semibold leading-tight text-deep">{title}</h2>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 font-sans text-sm leading-relaxed text-[#5F6648]">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
