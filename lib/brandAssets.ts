import type { BlogArticle, Product } from "@/types/content";

function hash(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

const productPhysicalImage = "/editorial/body-literacy-shower.png";
const productDigitalImage = "/sales/modern-man-code.png";
const productServiceImage = "/editorial/modern-man-interior.png";
const leadMagnetImage = "/editorial/hygiene-ritual-hands.png";
const articleFallbacks = [
  "/editorial/editorial-1.png",
  "/editorial/editorial-4.png",
  "/editorial/editorial-11.png",
];

export function productFallbackImage(product: Product) {
  if (product.productType === "digital") return productDigitalImage;
  if (product.productType === "service") return productServiceImage;
  return productPhysicalImage;
}

export function articleFallbackImage(article: BlogArticle) {
  const key = article.slug || article._id || "unveil";
  return articleFallbacks[hash(key) % articleFallbacks.length];
}

export function leadMagnetFallbackImage() {
  return leadMagnetImage;
}
