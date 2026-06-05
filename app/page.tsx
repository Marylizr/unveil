import HomePageExperience from "@/components/HomePageExperience";
import { fallbackBlogArticles, fallbackProducts } from "@/lib/fallbackContent";
import { connectToDatabase } from "@/lib/server/db";
import { listBlogArticles } from "@/server/services/blogService";
import { listProducts } from "@/server/services/productService";
import type { BlogArticle, Product } from "@/types/content";

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

async function loadHomeContent(): Promise<{ products: Product[]; posts: BlogArticle[] }> {
  try {
    await connectToDatabase();
    const [products, posts] = await Promise.all([listProducts(), listBlogArticles()]);
    const publishedPosts = posts as BlogArticle[];

    return {
      products: products.length > 0 ? (products as Product[]) : fallbackProducts,
      posts: withFeaturedFallback(publishedPosts),
    };
  } catch {
    return {
      products: fallbackProducts,
      posts: fallbackBlogArticles,
    };
  }
}

export default async function HomePage() {
  const { products, posts } = await loadHomeContent();

  return <HomePageExperience initialProducts={products} initialPosts={posts} />;
}
