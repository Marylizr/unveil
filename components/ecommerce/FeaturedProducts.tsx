import Link from "next/link";
import type { Product } from "@/types/content";
import ProductGrid from "./ProductGrid";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mb-16 border-b border-forest/40 pb-16">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-mist/60">Featured products</p>
          <h2 className="font-serif text-4xl leading-tight text-cream md:text-5xl">Selected with intention</h2>
        </div>
        <Link href="/learn" className="font-sans text-xs uppercase tracking-widest text-sage hover:text-mist">
          Learn before you choose →
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

