"use client";

import { useEffect, useMemo, useState } from "react";
import CategoryFilter from "@/components/ecommerce/CategoryFilter";
import FeaturedProducts from "@/components/ecommerce/FeaturedProducts";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import TrustBadges from "@/components/marketing/TrustBadges";
import { getProducts } from "@/lib/api";
import type { Product, ProductType } from "@/types/content";

const PRODUCT_TYPES: Array<{ label: string; value: ProductType | "all" }> = [
  { label: "All formats", value: "all" },
  { label: "Physical", value: "physical" },
  { label: "Digital", value: "digital" },
  { label: "Service", value: "service" },
];

const catalogSignals = [
  {
    title: "Editorial shop surface",
    imageUrl: "https://res.cloudinary.com/dnaq4a9do/image/upload/v1781348990/editorial-shop-surface_rxhfmv.webp",
  },
  {
    title: "Protected backoffice",
    imageUrl: "https://res.cloudinary.com/dnaq4a9do/image/upload/v1781349326/protected-backoffice_a3aueq.webp",
  },
  {
    title: "Structured catalog logic",
    imageUrl: "https://res.cloudinary.com/dnaq4a9do/image/upload/v1781349465/structured-cataloglogic_h4pn1y.webp",
  },
  {
    title: "Conversion path",
    imageUrl: "https://res.cloudinary.com/dnaq4a9do/image/upload/v1781349682/convertion-path_jfbc4p.webp",
  },
];

export default function ProductCatalogExperience() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState<ProductType | "all">("all");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category))).filter(Boolean);
    return [{ label: "All categories", value: "all" }, ...unique.map((value) => ({ label: value, value }))];
  }, [products]);

  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 3);
  const filtered = products.filter((product) => {
    const categoryMatches = category === "all" || product.category === category;
    const typeMatches = productType === "all" || product.productType === productType;
    return categoryMatches && typeMatches;
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#232618_0%,#444f26_55%,#90844a_130%)] pt-24 text-[#efe9df]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-14 max-w-none">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-[#efe9df]/65">UNVEIL resources</p>
          <h1 className="max-w-none font-serif text-[clamp(3.75rem,7vw,7.5rem)] leading-[0.88] text-[#efe9df] md:whitespace-nowrap">
            Tools for informed self-care
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-[#efe9df]/72">
            Educational tools, digital guides, grooming resources, and wellness essentials selected to support body literacy before purchase.
          </p>
        </header>

        <section className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-4" aria-label="UNVEIL catalog system preview">
          {catalogSignals.map((signal) => (
            <article
              key={signal.title}
              className="group overflow-hidden rounded-[28px] border border-[#efe9df]/15 bg-[#efe9df]/8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#232618]/40">
                <img
                  src={signal.imageUrl}
                  alt={`${signal.title} by UNVEIL`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="mb-4 block h-px w-10 bg-[#90844a]/70 transition-all duration-500 group-hover:w-16" />
                <h2 className="font-sans text-sm uppercase tracking-widest text-[#efe9df]">{signal.title}</h2>
              </div>
            </article>
          ))}
        </section>

        {status === "loading" && (
          <div className="border border-[#efe9df]/15 bg-[#efe9df]/8 p-10 font-sans text-sm text-[#efe9df]/75">Preparing the resource catalog.</div>
        )}

        {status === "error" && (
          <div className="border border-[#efe9df]/15 bg-[#efe9df]/8 p-10">
            <h2 className="font-serif text-3xl text-[#efe9df]">The catalog is temporarily unavailable.</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#efe9df]/72">
              UNVEIL resources are curated carefully. Please check back shortly.
            </p>
          </div>
        )}

        {status === "ready" && (
          <>
            <FeaturedProducts products={featuredProducts} />

            <section aria-label="Product filters" className="mb-12 grid grid-cols-1 gap-6 border-b border-forest/40 pb-10 md:grid-cols-2">
              <CategoryFilter label="Category" options={categories} value={category} onChange={setCategory} />
              <CategoryFilter label="Format" options={PRODUCT_TYPES} value={productType} onChange={(value) => setProductType(value as ProductType | "all")} />
            </section>

            {filtered.length > 0 ? (
              <ProductGrid products={filtered} />
            ) : (
              <div className="py-24 text-center">
                <p className="font-serif text-4xl text-sage/45">Nothing published here yet.</p>
                <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-sage/60">
                  This category is being built with the same restraint as the rest of UNVEIL.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <TrustBadges />
    </div>
  );
}
