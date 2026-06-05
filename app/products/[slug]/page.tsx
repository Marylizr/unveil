import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ecommerce/ProductDetail";
import { getBlogArticles, getProductBySlug } from "@/lib/api";
import { productFallbackImage } from "@/lib/brandAssets";
import { withShareMetadata } from "@/lib/seo";
import type { BlogArticle, Product } from "@/types/content";

interface ProductPageProps {
  params: { slug: string };
}

async function loadProduct(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await loadProduct(params.slug);
  if (!product) {
    return withShareMetadata({
      title: "Product",
      description: "UNVEIL educational product detail.",
      imageAlt: "UNVEIL educational product",
      path: `/products/${params.slug}`,
    });
  }

  const title = product.title.en;
  const description = product.shortDescription.en;
  const image = product.images?.[0]?.url || productFallbackImage(product);

  return withShareMetadata({
    title,
    description,
    image,
    imageAlt: product.images?.[0]?.alt || title,
    path: `/products/${product.slug}`,
  });
}

function productJsonLd(product: Product) {
  const image = product.images?.map((item) => item.url).filter(Boolean) || [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title.en,
    description: product.shortDescription.en,
    sku: product.sku,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "UNVEIL",
    },
    image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "EUR",
      availability:
        product.stockStatus === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await loadProduct(params.slug);
  if (!product) notFound();

  let relatedArticles: BlogArticle[] = [];
  try {
    const articles = await getBlogArticles();
    relatedArticles = articles
      .filter((article) => article.category === product.category || article.tags?.some((tag) => product.tags?.includes(tag)))
      .slice(0, 3);
  } catch {
    relatedArticles = [];
  }

  return (
    <>
      <ProductDetail product={product} relatedArticles={relatedArticles} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
    </>
  );
}
