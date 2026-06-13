"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import BlogGrid from "@/components/blog/BlogGrid";
import CategoryFilter from "@/components/ecommerce/CategoryFilter";
import type { BlogArticle, BlogContentType, BlogDifficulty } from "@/types/content";

const CONTENT_TYPES: Array<{ label: string; value: BlogContentType | "all" }> = [
  { label: "All formats", value: "all" },
  { label: "Article", value: "article" },
  { label: "Guide", value: "guide" },
  { label: "Ebook", value: "ebook" },
  { label: "Research", value: "research" },
  { label: "Case Study", value: "case-study" },
];

const DIFFICULTIES: Array<{ label: string; value: BlogDifficulty | "all" }> = [
  { label: "All levels", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Male Hygiene": "Clean, practical guidance for daily care and intimate hygiene routines.",
  "Sexual Health": "Clear, non-explicit education on body literacy, comfort, and responsible wellbeing.",
  "Emotional Intelligence": "Tools for regulation, confidence, communication, and self-awareness.",
  "Dating & Communication": "Refined guidance for presence, consent, honesty, and relational maturity.",
  "Hormones & Performance": "Evidence-aware context for recovery, energy, stress, and sustainable performance.",
  "Intimacy Education": "Calm education for trust, awareness, and healthier connection.",
  "Male Optimization": "Grounded self-care systems for modern men, without hype or pressure.",
};

export default function LearnExperience({ initialArticles }: { initialArticles: BlogArticle[] }) {
  const articles = initialArticles;
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState<BlogContentType | "all">("all");
  const [difficulty, setDifficulty] = useState<BlogDifficulty | "all">("all");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((article) => article.category))).filter(Boolean);
    return [{ label: "All categories", value: "all" }, ...unique.map((value) => ({ label: value, value }))];
  }, [articles]);

  const featuredArticles = articles.slice(0, 3);
  const featuredArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1, 3);
  const filtersActive = category !== "all" || contentType !== "all" || difficulty !== "all";
  const gridSource = filtersActive ? articles : articles.slice(featuredArticles.length);
  const filtered = gridSource.filter((article) => {
    const categoryMatches = category === "all" || article.category === category;
    const typeMatches = contentType === "all" || (article.contentType || "article") === contentType;
    const difficultyMatches = difficulty === "all" || (article.difficulty || "beginner") === difficulty;
    return categoryMatches && typeMatches && difficultyMatches;
  });

  return (
    <div className="min-h-screen bg-[#F4F1E8]">
      <section className="relative overflow-hidden bg-deep px-6 pb-20 pt-32 md:pb-24">
        <div className="absolute inset-0 editorial-grain opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest/20 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
          <header className="max-w-4xl">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-mist">The journal</p>
            <h1 className="font-serif text-6xl leading-tight text-cream md:text-8xl">Men&apos;s health, without the noise</h1>
            <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-sage/80 md:text-lg">
              A premium educational library for intimate hygiene, body literacy, emotional intelligence, communication, and grounded masculine self-care.
            </p>
          </header>
        </div>
      </section>

      <div className="bg-[#F4F1E8]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          {featuredArticle && (
            <section className="mb-20">
              <div className="mb-12 grid grid-cols-1 gap-8 md:mb-16 lg:grid-cols-[minmax(0,0.64fr)_minmax(320px,0.36fr)] lg:items-center">
                <div className="max-w-4xl">
                  <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">Featured journal</p>
                  <h2 className="font-serif text-5xl leading-[0.98] text-deep sm:text-6xl lg:text-7xl">Authority through education</h2>
                </div>
                <div className="max-w-[420px] lg:justify-self-end lg:pt-10">
                  <p className="font-sans text-sm leading-relaxed text-[#5F6648]">
                    A calm reading path for body literacy, intimate hygiene, emotional intelligence, and grounded self-care.
                  </p>
                  <Link
                    href="#journal-articles"
                    className="mt-6 inline-flex rounded-full border border-olive/25 px-6 py-3 font-sans text-xs uppercase tracking-widest text-olive transition-colors hover:border-gold hover:text-deep"
                  >
                    View all articles →
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 items-start gap-[clamp(1rem,2vw,1.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.78fr)]">
                <div>
                  <BlogCard article={featuredArticle} large tone="light" />
                </div>
                {secondaryArticles.length > 0 && (
                  <div className="grid gap-[clamp(1rem,2vw,1.5rem)] lg:pt-8">
                    {secondaryArticles.map((article) => (
                      <BlogCard key={article._id} article={article} tone="light" />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {!featuredArticle && (
            <section className="mb-20 rounded-[36px] bg-[#E8E8E2] p-[clamp(1.5rem,4vw,3.5rem)] soft-paper">
              <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">Featured journal</p>
              <h2 className="font-serif text-5xl leading-tight text-deep md:text-6xl">Start with context, not pressure</h2>
              <p className="mt-5 max-w-lg font-sans text-sm leading-relaxed text-[#5F6648]">
                UNVEIL teaches the foundations first: what the body does, why care matters, and how to approach wellbeing with discretion.
              </p>
            </section>
          )}

          {category !== "all" && CATEGORY_DESCRIPTIONS[category] && (
            <div className="mb-10 max-w-3xl rounded-[28px] border border-[rgba(77,80,57,0.16)] bg-[#E8E8E2] p-8">
              <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">Selected category</p>
              <h2 className="font-serif text-4xl leading-tight text-deep">{category}</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#5F6648]">{CATEGORY_DESCRIPTIONS[category]}</p>
            </div>
          )}

          {filtered.length > 0 ? (
            <div id="journal-articles">
              <BlogGrid articles={filtered} tone="light" />
            </div>
          ) : filtersActive ? (
            <div className="rounded-[32px] bg-[#E8E8E2] px-6 py-24 text-center">
              <p className="font-serif text-4xl text-deep">No articles published here yet.</p>
              <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-[#5F6648]">
                UNVEIL publishes slowly and deliberately. This topic will be built with care.
              </p>
            </div>
          ) : (
            <div id="journal-articles" />
          )}

          <section className="mt-16 rounded-[32px] border border-[rgba(77,80,57,0.14)] bg-white p-5 md:p-6" aria-label="Journal filters">
            <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-[0.72fr_1.28fr] md:items-end">
              <div>
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">Browse the library</p>
                <h2 className="font-sans text-3xl font-semibold leading-tight text-deep">Choose a topic, format, or level.</h2>
              </div>
              <p className="max-w-xl font-sans text-sm leading-relaxed text-[#5F6648] md:justify-self-end">
                Articles are organized to make sensitive education easier to approach, without noise or pressure.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CategoryFilter tone="light" label="Category" options={categories} value={category} onChange={setCategory} />
              <CategoryFilter tone="light" label="Format" options={CONTENT_TYPES} value={contentType} onChange={(value) => setContentType(value as BlogContentType | "all")} />
              <CategoryFilter tone="light" label="Level" options={DIFFICULTIES} value={difficulty} onChange={(value) => setDifficulty(value as BlogDifficulty | "all")} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
