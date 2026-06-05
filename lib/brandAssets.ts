import type { StaticImageData } from "next/image";
import productPhysicalImage from "@/identidad/img/img-1.png";
import productDigitalImage from "@/identidad/img/chapter1.png";
import productServiceImage from "@/identidad/img/img-2.png";
import articleImageOne from "@/identidad/img/post-1-01.png";
import articleImageTwo from "@/identidad/img/post-1-03.png";
import articleImageThree from "@/identidad/img/post-1-05.png";
import leadMagnetImage from "@/identidad/img/chapter2.png";
import type { BlogArticle, Product } from "@/types/content";

function staticSrc(image: StaticImageData) {
  return image.src;
}

function hash(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

const articleFallbacks = [articleImageOne, articleImageTwo, articleImageThree];

export function productFallbackImage(product: Product) {
  if (product.productType === "digital") return staticSrc(productDigitalImage);
  if (product.productType === "service") return staticSrc(productServiceImage);
  return staticSrc(productPhysicalImage);
}

export function articleFallbackImage(article: BlogArticle) {
  const key = article.slug || article._id || "unveil";
  return staticSrc(articleFallbacks[hash(key) % articleFallbacks.length]);
}

export function leadMagnetFallbackImage() {
  return staticSrc(leadMagnetImage);
}
