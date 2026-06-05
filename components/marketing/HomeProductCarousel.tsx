"use client";

import Link from "next/link";
import ProductCard from "@/components/ecommerce/ProductCard";
import type { Product } from "@/types/content";

export default function HomeProductCarousel({ products }: { products: Product[] }) {
  const featured = products.filter((product) => product.isFeatured);
  const selected = (featured.length ? featured : products).slice(0, 6);

  return (
    <section className="editorial-section overflow-hidden bg-[#F4F1E8] px-6">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">Selected resources</p>
            <h2 className="font-serif text-5xl leading-tight text-deep md:text-6xl">
              Tools with context,
              <br className="hidden md:block" /> not pressure.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-sans text-sm leading-relaxed text-[#5F6648]">
              A considered preview of digital guides, hygiene resources, and self-care essentials built around education first.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full border border-olive/25 px-6 py-3 font-sans text-xs uppercase tracking-widest text-olive transition-colors hover:border-gold hover:text-deep"
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
          <div className="reveal rounded-[32px] border border-[rgba(77,80,57,0.16)] bg-[#E8E8E2] p-[clamp(1.5rem,3vw,2.5rem)]">
            <h3 className="font-sans text-2xl font-semibold text-deep">The first resource selection is being prepared.</h3>
            <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-[#5F6648]">
              UNVEIL resources will arrive with responsible use notes, practical context, and discreet guidance.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
