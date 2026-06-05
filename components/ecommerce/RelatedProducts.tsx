import type { Product } from "@/types/content";
import ProductGrid from "./ProductGrid";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products?.length) return null;

  return (
    <section className="mt-20 border-t border-olive/20 pt-12">
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-olive/60">Related products</p>
      <h2 className="mb-8 font-serif text-4xl leading-tight text-deep">Continue the ritual</h2>
      <ProductGrid products={products} />
    </section>
  );
}

