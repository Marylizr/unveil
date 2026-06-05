"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { productFallbackImage } from "@/lib/brandAssets";
import type { Product } from "@/types/content";

function formatPrice(product: Product) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: product.currency || "EUR",
    maximumFractionDigits: 0,
  }).format(product.price);
}

export default function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const image = product.images?.[0];
  const title = product.title?.[language] || product.title?.en || product.name?.[language] || "";
  const description = product.shortDescription?.[language] || product.shortDescription?.en || product.description?.[language] || "";
  const imageUrl = image?.url || productFallbackImage(product);
  const imageAlt = image?.alt || `${title} by UNVEIL`;

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <motion.article
        data-unveil-card
        initial={shouldReduceMotion ? false : { opacity: 1, y: 18, scale: 0.992 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        whileHover={shouldReduceMotion ? undefined : { y: -4 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="product-card group overflow-hidden rounded-[28px] border border-[rgba(77,80,57,0.18)] bg-[#F4F1E8] text-deep transition-colors duration-300 hover:border-gold/45"
      >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone/35">
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(244,241,232,0.24),transparent_36%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {product.isFeatured && (
          <span className="absolute left-4 top-4 bg-mist px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-deep transition-transform duration-500 group-hover:translate-y-1">
            Featured
          </span>
        )}
        <span className="absolute bottom-4 left-4 h-px w-12 origin-left scale-x-50 bg-gold/60 transition-transform duration-700 group-hover:scale-x-100" />
      </div>
      <div className="p-6">
        <p className="mb-2 font-sans text-[10px] uppercase tracking-widest text-olive/70">
          {product.category} · {product.productType}
        </p>
        <span className="mb-5 block h-px w-10 bg-gold/35 transition-all duration-500 group-hover:w-20 group-hover:bg-gold/70" />
        <h3 className="mb-2 font-sans text-2xl leading-tight text-deep transition-colors group-hover:text-olive">
          {title}
        </h3>
        <p className="mb-5 line-clamp-2 font-sans text-sm leading-relaxed text-olive/78">{description}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="font-sans text-sm text-deep">{formatPrice(product)}</span>
          <span className="font-sans text-[10px] uppercase tracking-widest text-olive/65">
            {product.stockStatus.replace(/_/g, " ")}
          </span>
        </div>
      </div>
      </motion.article>
    </Link>
  );
}
