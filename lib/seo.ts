import type { Metadata } from "next";

export const SITE_NAME = "UNVEIL";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unveil.co";
export const FALLBACK_OG_IMAGE = "/editorial/editorial-11.png";

export function cleanSeoText(value: string | undefined, fallback: string) {
  const text = value?.trim();
  return text || fallback;
}

export function getOgImage(imageUrl: string | undefined, fallback = FALLBACK_OG_IMAGE) {
  const image = imageUrl?.trim();
  return image || fallback;
}

export function buildOpenGraphImage(imageUrl: string | undefined, alt: string) {
  return {
    url: getOgImage(imageUrl),
    alt,
    width: 1200,
    height: 630,
  };
}

export function withShareMetadata({
  title,
  description,
  image,
  imageAlt,
  path,
  type = "website",
  extraOpenGraph,
}: {
  title: string;
  description: string;
  image?: string;
  imageAlt: string;
  path: string;
  type?: "website" | "article";
  extraOpenGraph?: NonNullable<Metadata["openGraph"]>;
}): Metadata {
  const finalTitle = cleanSeoText(title, SITE_NAME);
  const finalDescription = cleanSeoText(description, "Premium education for men's wellness, body literacy, and self-care.");
  const openGraphImage = buildOpenGraphImage(image, imageAlt || finalTitle);

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: path,
      siteName: SITE_NAME,
      type,
      images: [openGraphImage],
      ...extraOpenGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [openGraphImage.url],
    },
  };
}
