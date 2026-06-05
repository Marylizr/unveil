"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { articleFallbackImage } from "@/lib/brandAssets";
import type { BlogArticle } from "@/types/content";

export default function BlogCard({
  article,
  large = false,
  tone = "dark",
  imageOverride,
}: {
  article: BlogArticle;
  large?: boolean;
  tone?: "dark" | "light";
  imageOverride?: { url: string; alt: string };
}) {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const title = article.title?.[language] || article.title?.en || "UNVEIL journal";
  const excerpt = article.excerpt?.[language] || article.excerpt?.en || "";
  const image = article.coverImage;
  const imageUrl = imageOverride?.url || image?.url || articleFallbackImage(article);
  const imageAlt = imageOverride?.alt || image?.alt || `${title} editorial image`;
  const light = tone === "light";
  const imageClass = large ? "aspect-[16/11] md:aspect-[16/10]" : "aspect-[16/10]";
  const contentClass = large ? "p-6 md:p-8 lg:p-9" : "p-6";
  const titleClass = large ? "text-3xl md:text-4xl lg:text-[2.65rem]" : "text-2xl";
  const excerptClass = large ? "line-clamp-3" : "line-clamp-2";

  return (
    <Link href={`/learn/${article.slug}`} className="block">
      <motion.article
        data-unveil-card
        initial={shouldReduceMotion ? false : { opacity: 1, y: 18, scale: 0.992 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        whileHover={shouldReduceMotion ? undefined : { y: -4 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className={`group overflow-hidden rounded-[28px] border transition-colors duration-300 hover:border-gold/45 ${large ? "" : "h-full"} ${
          light ? "border-[rgba(77,80,57,0.18)] bg-[#F4F1E8] text-[#202315]" : "border-forest/40 bg-forest/20 text-cream"
        }`}
      >
        <div className={`relative overflow-hidden bg-forest/30 ${imageClass}`}>
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,232,226,0.18),transparent_38%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <span className="absolute left-4 top-4 border border-mist/30 px-2.5 py-1 font-sans text-[10px] uppercase tracking-widest text-mist/80 transition-transform duration-500 group-hover:translate-y-1">
            {article.category}
          </span>
          <span className="absolute bottom-4 left-4 h-px w-12 origin-left scale-x-50 bg-gold/60 transition-transform duration-700 group-hover:scale-x-100" />
        </div>
        <div className={contentClass}>
          <p className={`mb-3 font-sans text-[10px] uppercase tracking-widest ${light ? "text-gold" : "text-sage/80"}`}>
            {article.contentType || "article"} · {article.difficulty || "beginner"} · {article.estimatedReadingMinutes || article.readingTime || 5} min
          </p>
          <span className="mb-5 block h-px w-10 bg-gold/35 transition-all duration-500 group-hover:w-20 group-hover:bg-gold/70" />
          <h3 className={`mb-3 font-sans leading-tight transition-colors group-hover:text-olive ${light ? "text-deep" : "text-cream"} ${titleClass}`}>
            {title}
          </h3>
          <p className={`${excerptClass} font-sans text-sm leading-relaxed ${light ? "text-[#5F6648]" : "text-sage/80"}`}>{excerpt}</p>
        </div>
      </motion.article>
    </Link>
  );
}
