import type { Metadata } from "next";
import ProductCatalogExperience from "@/components/ecommerce/ProductCatalogExperience";

export const metadata: Metadata = {
  title: "Educational Tools & Wellness Essentials",
  description:
    "Explore UNVEIL educational tools, digital guides, intimate hygiene resources, grooming essentials, and wellness products for modern men.",
  openGraph: {
    title: "UNVEIL Educational Tools & Wellness Essentials",
    description:
      "A discreet catalog of education-first resources for men's hygiene, body literacy, grooming, and modern self-care.",
  },
};

export default function ProductsPage() {
  return <ProductCatalogExperience />;
}

