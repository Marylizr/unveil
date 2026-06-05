"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/types/content";

export default function ProductCard({ product }: { product: Product }) {
  const { language, t } = useLanguage();
  const title = product.name?.[language] || product.title?.[language] || "";
  const description = product.description?.[language] || product.shortDescription?.[language] || "";
  const imageUrl = product.imageUrl || product.images?.[0]?.url || "";
  const inStock = product.inStock ?? product.stockStatus !== "out_of_stock";

  return (
    <div className="product-card group bg-forest/20 border border-forest/30 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-forest/40 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif text-4xl text-mist/30">u</span>
          </div>
        )}

        {/* Tag */}
        {product.tag && (
          <span className="absolute top-4 left-4 font-sans text-[10px] uppercase tracking-widest bg-mist text-deep px-2.5 py-1">
            {product.tag}
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-deep/60 flex items-center justify-center">
            <span className="font-sans text-xs text-sage uppercase tracking-widest">{t.products.outOfStock}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="font-sans text-[10px] uppercase tracking-widest text-sage/60 mb-1">{product.category}</p>
        <h3 className="font-serif text-xl text-cream mb-2 leading-tight">{title}</h3>
        <p className="font-sans text-sm text-sage/70 leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-mist">€{product.price}</span>
          <button
            disabled={!inStock}
            className="font-sans text-[10px] uppercase tracking-widest border border-mist/40 text-mist px-4 py-2 hover:bg-mist hover:text-deep focus-visible:bg-mist focus-visible:text-deep transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.products.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
