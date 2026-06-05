"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { trackProductDetailView } from "@/lib/analytics";
import { productFallbackImage } from "@/lib/brandAssets";
import type { BlogArticle, Product } from "@/types/content";
import RelatedArticles from "@/components/blog/RelatedArticles";

function formatPrice(product: Product) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: product.currency || "EUR",
  }).format(product.price);
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;

  return (
    <section className="border-t border-olive/20 pt-8">
      <h2 className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">{title}</h2>
      <ul className="space-y-3 font-sans text-sm leading-relaxed text-deep/75">
        {items.map((item) => (
          <li key={item} className="border-l border-mist/60 pl-4">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ProductDetail({ product, relatedArticles = [] }: { product: Product; relatedArticles?: BlogArticle[] }) {
  const { language } = useLanguage();
  const title = product.title[language] || product.title.en;
  const shortDescription = product.shortDescription[language] || product.shortDescription.en;
  const fullDescription = product.fullDescription[language] || product.fullDescription.en;
  const images = product.images?.length ? product.images : [];
  const primaryImage = images[0]?.url || productFallbackImage(product);
  const primaryAlt = images[0]?.alt || `${title} by UNVEIL`;

  useEffect(() => {
    trackProductDetailView({
      product_id: product._id,
      product_slug: product.slug,
      product_category: product.category,
      product_type: product.productType,
      currency: product.currency,
      value: product.price,
    });
  }, [product._id, product.category, product.currency, product.price, product.productType, product.slug]);

  return (
    <article className="bg-cream pt-24 text-deep">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] md:py-24">
        <section aria-label={`${title} images`} className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden bg-forest/20">
            <img src={primaryImage} alt={primaryAlt} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {images.slice(1, 4).map((image) => (
                <img key={image.url} src={image.url} alt={image.alt || title} className="aspect-square w-full object-cover" loading="lazy" />
              ))}
            </div>
          )}
        </section>

        <section>
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">
            {product.category} · {product.productType}
          </p>
          <h1 className="font-serif text-5xl leading-tight md:text-7xl">{title}</h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-olive">{shortDescription}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-olive/20 py-6">
            <span className="font-sans text-lg text-deep">{formatPrice(product)}</span>
            {product.compareAtPrice && (
              <span className="font-sans text-sm text-olive/50 line-through">
                {new Intl.NumberFormat("en", { style: "currency", currency: product.currency || "EUR" }).format(product.compareAtPrice)}
              </span>
            )}
            <span className="font-sans text-xs uppercase tracking-widest text-olive/70">
              {product.stockStatus.replace(/_/g, " ")}
            </span>
          </div>

          <p className="mt-8 font-sans text-base leading-relaxed text-deep/80">{fullDescription}</p>

          <div className="mt-12 space-y-10">
            <DetailList title="Benefits" items={product.benefits} />
            <DetailList title="How to use" items={product.howToUse} />
            <DetailList title="Materials" items={product.materials} />
            <DetailList title="Care instructions" items={product.careInstructions} />
            <DetailList title="Safety notes" items={product.safetyNotes} />
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24">
        <RelatedArticles articles={relatedArticles} tone="light" />
      </div>
    </article>
  );
}
