"use client";

import { useEffect } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import BlogCard from "@/components/blog/BlogCard";
import EducationalHero from "@/components/marketing/EducationalHero";
import HomeNewsletterSplit from "@/components/marketing/HomeNewsletterSplit";
import HomeProductCarousel from "@/components/marketing/HomeProductCarousel";
import LeadMagnetSection from "@/components/marketing/LeadMagnetSection";
import WhatUnveilTeaches from "@/components/marketing/WhatUnveilTeaches";
import { useLanguage } from "@/context/LanguageContext";
import type { BlogArticle, LeadMagnet, Product } from "@/types/content";

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function HomePageExperience({
  initialProducts,
  initialPosts,
  initialLeadMagnets,
}: {
  initialProducts: Product[];
  initialPosts: BlogArticle[];
  initialLeadMagnets: LeadMagnet[];
}) {
  const { language, t } = useLanguage();
  const products = initialProducts;
  const posts = initialPosts;
  useReveal();

  const marqueeItems = [...t.marquee.phrases, ...t.marquee.phrases];

  return (
    <>
      <Hero />

      <div className="overflow-hidden border-y border-[#90844a]/25 bg-[#444f26] py-4">
        <div className="marquee-track">
          {marqueeItems.map((phrase, i) => (
            <span key={i} className="whitespace-nowrap px-10 font-serif text-sm italic text-[#efe9df]/76">
              {phrase}
              <span className="mx-8 text-[#90844a]">◆</span>
            </span>
          ))}
        </div>
      </div>

      <EducationalHero />
      <WhatUnveilTeaches />

      <section className="editorial-section bg-[linear-gradient(135deg,#232618_0%,#444f26_55%,#90844a_130%)] px-6 text-[#efe9df]">
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-14 grid grid-cols-1 gap-8 md:grid-cols-[0.78fr_1.22fr] md:items-end">
            <div>
              <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">Featured journal</p>
              <h2 className="font-serif text-5xl leading-tight text-[#efe9df] md:text-6xl">Authority through education</h2>
            </div>
            <div className="md:justify-self-end">
              <p className="max-w-lg font-sans text-sm leading-relaxed text-[#efe9df]/72">
                A journal experience with clear hierarchy: one thoughtful feature, two quieter supporting reads, and calm paths into the education library.
              </p>
              <Link
                href="/learn"
                className="mt-6 inline-flex rounded-full border border-[#efe9df]/35 px-6 py-3 font-sans text-xs uppercase tracking-widest text-[#efe9df] transition-colors hover:bg-[#efe9df]/10"
              >
                {t.journal.viewAll} →
              </Link>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="editorial-gap grid grid-cols-1 lg:grid-cols-[1.35fr_0.75fr]">
              <div className="reveal">
                <BlogCard article={posts[0]} large tone="light" />
              </div>
              <div className="reveal grid gap-[clamp(1rem,2vw,1.5rem)]" style={{ transitionDelay: "0.15s" }}>
                {posts.slice(1, 3).map((post) => (
                  <BlogCard key={post._id} article={post} tone="light" />
                ))}
              </div>
            </div>
          ) : (
            <div className="editorial-gap grid grid-cols-1 lg:grid-cols-[1.18fr_0.82fr]">
              {placeholderPosts.map((p, i) => (
                <article
                  key={p.slug}
                  className={`reveal group overflow-hidden rounded-[34px] border border-[#efe9df]/15 bg-[#efe9df]/8 text-[#efe9df] shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#90844a]/55 ${
                    i === 0 ? "lg:row-span-2" : ""
                  }`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className={`overflow-hidden bg-stone/30 ${i === 0 ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
                    <img
                      src={p.imageUrl}
                      alt={p.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className={i === 0 ? "p-[clamp(1.5rem,3vw,2.5rem)]" : "p-6"}>
                    <p className="mb-3 font-sans text-[10px] uppercase tracking-widest text-[#90844a]">{p.category}</p>
                    <h3 className={`font-sans font-semibold leading-tight text-[#efe9df] ${i === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                      {p.title[language]}
                    </h3>
                    <p className="mt-4 line-clamp-3 font-sans text-sm leading-relaxed text-[#efe9df]/72">{p.excerpt[language]}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <LeadMagnetSection source="homepage-lead-magnet" initialLeadMagnets={initialLeadMagnets} />
      <HomeNewsletterSplit />
      <HomeProductCarousel products={products} />
    </>
  );
}

const placeholderPosts = [
  {
    _id: "1",
    slug: "anatomy-you-were-never-taught",
    title: { en: "The anatomy you were never taught", pt: "A anatomia que nunca te ensinaram", es: "La anatomía que nunca te enseñaron" },
    excerpt: { en: "There is a gap between what men know about their bodies and what they experience.", pt: "Existe uma lacuna.", es: "Existe una brecha." },
    category: "Body literacy",
    readTime: 7,
    imageUrl: "/editorial/editorial-4.png",
    imageAlt: "Editorial UNVEIL visual for body literacy education",
  },
  {
    _id: "2",
    slug: "testosterone-not-the-whole-story",
    title: { en: "Testosterone is not the whole story", pt: "A testosterona não é toda a história", es: "La testosterona no es toda la historia" },
    excerpt: { en: "Most conversations begin and end with testosterone. The real picture is far more interesting.", pt: "A maioria das conversas.", es: "La mayoría de las conversaciones." },
    category: "Health",
    readTime: 9,
    imageUrl: "/editorial/editorial-1.png",
    imageAlt: "Editorial UNVEIL visual for hormone and health education",
  },
  {
    _id: "3",
    slug: "curiosity-about-body-form-of-intelligence",
    title: { en: "Why curiosity about your body is a form of intelligence", pt: "Por que a curiosidade sobre o teu corpo é inteligência", es: "Por qué la curiosidad sobre tu cuerpo es inteligencia" },
    excerpt: { en: "The men who understand themselves best are the most present.", pt: "Os homens que se conhecem melhor são os mais presentes.", es: "Los hombres que mejor se conocen son los más presentes." },
    category: "Mindset",
    readTime: 6,
    imageUrl: "/editorial/img-12.png",
    imageAlt: "Editorial UNVEIL visual for mindful body awareness",
  },
];
