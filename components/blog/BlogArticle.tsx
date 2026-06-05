"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { trackArticleView } from "@/lib/analytics";
import { articleFallbackImage } from "@/lib/brandAssets";
import type { BlogArticle as BlogArticleType } from "@/types/content";
import RelatedProducts from "@/components/ecommerce/RelatedProducts";
import LeadMagnetSection from "@/components/marketing/LeadMagnetSection";
import RelatedArticles from "./RelatedArticles";

export default function BlogArticle({ article }: { article: BlogArticleType }) {
  const { language } = useLanguage();
  const title = article.title[language] || article.title.en;
  const excerpt = article.excerpt[language] || article.excerpt.en;
  const content = article.content[language] || article.content.en;
  const imageUrl = article.coverImage?.url || articleFallbackImage(article);
  const imageAlt = article.coverImage?.alt || `${title} editorial image`;

  useEffect(() => {
    trackArticleView({
      article_id: article._id,
      article_slug: article.slug,
      article_category: article.category,
      content_type: article.contentType,
      difficulty: article.difficulty,
      estimated_reading_minutes: article.estimatedReadingMinutes,
    });
  }, [
    article._id,
    article.category,
    article.contentType,
    article.difficulty,
    article.estimatedReadingMinutes,
    article.slug,
  ]);

  return (
    <article className="bg-cream pt-24 text-deep">
      <header className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">
          {article.category} · {article.contentType} · {article.difficulty} · {article.estimatedReadingMinutes} min
        </p>
        <h1 className="font-serif text-5xl leading-tight md:text-7xl">{title}</h1>
        <p className="mx-auto mt-7 max-w-2xl font-sans text-base leading-relaxed text-olive">{excerpt}</p>
        <p className="mt-8 font-sans text-xs uppercase tracking-widest text-olive/60">
          {article.author?.name}
          {article.author?.role ? ` · ${article.author.role}` : ""}
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        <img src={imageUrl} alt={imageAlt} className="max-h-[620px] w-full object-cover" />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="space-y-6 font-sans text-base leading-8 text-deep/80">
          {content
            .split("\n")
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      </div>

      <LeadMagnetSection source="article-inline" />

      <div className="mx-auto max-w-7xl px-6 pb-24">
        <RelatedArticles articles={article.relatedArticles || []} tone="light" />
        <RelatedProducts products={article.relatedProducts || []} />
      </div>
    </article>
  );
}
