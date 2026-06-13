"use client";

import Link from "next/link";
import ProductCard from "@/components/ecommerce/ProductCard";
import type { Product } from "@/types/content";

export default function HomeProductCarousel({ products }: { products: Product[] }) {
  const featured = products.filter((product) => product.isFeatured);
  const selected = (featured.length ? featured : products).slice(0, 6);

  return (
    <section className="editorial-section overflow-hidden bg-[#efe9df] px-6 text-[#444f26]">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">Selected resources</p>
            <h2 className="font-serif text-5xl leading-tight text-[#444f26] md:text-6xl">
              Tools with context,
              <br className="hidden md:block" /> not pressure.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-sans text-sm leading-relaxed text-[#444f26]/72">
              A considered preview of digital guides, hygiene resources, and self-care essentials built around education first.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full border border-[#90844a]/45 px-6 py-3 font-sans text-xs uppercase tracking-widest text-[#444f26] transition-colors hover:bg-[#90844a] hover:text-[#efe9df]"
            >
              View resources →
            </Link>
          </div>
        </div>

        {selected.length > 0 ? (
          <div className="reveal -mx-6 overflow-x-auto px-6 pb-4 [scrollbar-width:thin]">
            <div className="flex min-w-full gap-[clamp(1rem,2vw,1.5rem)]">
              {selected.map((product) => (
                <div key={product._id} className="w-[82vw] flex-none sm:w-[22rem] lg:w-[24rem]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="reveal rounded-3xl border border-[#90844a]/20 bg-[#f8f3ea] p-[clamp(1.5rem,3vw,2.5rem)] text-[#444f26] shadow-[0_20px_60px_rgba(35,38,24,0.10)]">
            <h3 className="font-sans text-2xl font-semibold text-[#444f26]">The first resource selection is being prepared.</h3>
            <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-[#444f26]/72">
              UNVEIL resources will arrive with responsible use notes, practical context, and discreet guidance.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
