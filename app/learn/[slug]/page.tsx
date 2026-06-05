import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/blog/BlogArticle";
import { getBlogArticleBySlug } from "@/lib/api";
import { articleFallbackImage } from "@/lib/brandAssets";
import { withShareMetadata } from "@/lib/seo";
import type { BlogArticle as BlogArticleType } from "@/types/content";

interface ArticlePageProps {
  params: { slug: string };
}

async function loadArticle(slug: string) {
  try {
    return await getBlogArticleBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await loadArticle(params.slug);
  if (!article) {
    return withShareMetadata({
      title: "Journal article",
      description: "UNVEIL educational journal article.",
      imageAlt: "UNVEIL educational journal",
      path: `/learn/${params.slug}`,
      type: "article",
    });
  }

  const title = article.seoTitle || article.title.en;
  const description = article.seoDescription || article.excerpt.en;
  const image = article.coverImage?.url || articleFallbackImage(article);

  return withShareMetadata({
    title,
    description,
    image,
    imageAlt: article.coverImage?.alt || article.title.en,
    path: `/learn/${article.slug}`,
    type: "article",
    extraOpenGraph: {
      type: "article",
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
    },
  });
}

function articleJsonLd(article: BlogArticleType) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title.en,
    description: article.seoDescription || article.excerpt.en,
    image: article.coverImage?.url ? [article.coverImage.url] : undefined,
    author: {
      "@type": "Organization",
      name: article.author?.name || "UNVEIL",
    },
    publisher: {
      "@type": "Organization",
      name: "UNVEIL",
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    articleSection: article.category,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await loadArticle(params.slug);
  if (!article) notFound();

  return (
    <>
      <BlogArticle article={article} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
    </>
  );
}
