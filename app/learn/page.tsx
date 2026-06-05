import type { Metadata } from "next";
import LearnExperience from "@/components/blog/LearnExperience";
import { connectToDatabase } from "@/lib/server/db";
import { fallbackBlogArticles } from "@/lib/fallbackContent";
import { listBlogArticles } from "@/server/services/blogService";
import type { BlogArticle } from "@/types/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Read UNVEIL's premium men's health journal on intimate hygiene, body literacy, emotional intelligence, communication, and modern self-care.",
  openGraph: {
    title: "UNVEIL Journal",
    description:
      "A calm educational journal for men's hygiene, body literacy, emotional intelligence, and responsible wellbeing.",
  },
};

async function loadArticles(): Promise<BlogArticle[]> {
  try {
    await connectToDatabase();
    const articles = await listBlogArticles();
    const publishedArticles = articles as BlogArticle[];

    if (publishedArticles.length >= 3) {
      return publishedArticles;
    }

    if (publishedArticles.length > 0) {
      const existingSlugs = new Set(publishedArticles.map((article) => article.slug));
      const fallbackFill = fallbackBlogArticles.filter((article) => !existingSlugs.has(article.slug));
      return [...publishedArticles, ...fallbackFill].slice(0, 3);
    }

    return fallbackBlogArticles;
  } catch {
    return fallbackBlogArticles;
  }
}

export default async function LearnPage() {
  const articles = await loadArticles();
  return <LearnExperience initialArticles={articles} />;
}
