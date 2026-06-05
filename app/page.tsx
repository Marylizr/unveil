import HomePageExperience from "@/components/HomePageExperience";
import { fallbackBlogArticles, fallbackProducts } from "@/lib/fallbackContent";
import { connectToDatabase } from "@/lib/server/db";
import { listBlogArticles } from "@/server/services/blogService";
import { listLeadMagnets } from "@/server/services/leadMagnetService";
import { listProducts } from "@/server/services/productService";
import type { BlogArticle, LeadMagnet, Product } from "@/types/content";

export const dynamic = "force-dynamic";

function withFeaturedFallback(posts: BlogArticle[]) {
  if (posts.length >= 3) {
    return posts;
  }

  if (posts.length === 0) {
    return fallbackBlogArticles;
  }

  const existingSlugs = new Set(posts.map((post) => post.slug));
  const fallbackFill = fallbackBlogArticles.filter((post) => !existingSlugs.has(post.slug));
  return [...posts, ...fallbackFill].slice(0, 3);
}

async function loadHomeContent(): Promise<{ products: Product[]; posts: BlogArticle[]; leadMagnets: LeadMagnet[] }> {
  try {
    await connectToDatabase();
    const [products, posts, leadMagnets] = await Promise.all([listProducts(), listBlogArticles(), listLeadMagnets()]);
    const publishedPosts = posts as unknown as BlogArticle[];

    return {
      products: products.length > 0 ? (products as unknown as Product[]) : fallbackProducts,
      posts: withFeaturedFallback(publishedPosts),
      leadMagnets: leadMagnets as unknown as LeadMagnet[],
    };
  } catch {
    return {
      products: fallbackProducts,
      posts: fallbackBlogArticles,
      leadMagnets: [],
    };
  }
}

export default async function HomePage() {
  const { products, posts, leadMagnets } = await loadHomeContent();

  return <HomePageExperience initialProducts={products} initialPosts={posts} initialLeadMagnets={leadMagnets} />;
}
