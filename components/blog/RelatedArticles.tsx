import type { BlogArticle } from "@/types/content";
import BlogGrid from "./BlogGrid";

export default function RelatedArticles({ articles, tone = "dark" }: { articles: BlogArticle[]; tone?: "dark" | "light" }) {
  if (!articles?.length) return null;
  const light = tone === "light";

  return (
    <section className={`mt-16 border-t pt-12 ${light ? "border-olive/20" : "border-forest/40"}`}>
      <p className={`mb-3 font-sans text-xs uppercase tracking-[0.3em] ${light ? "text-olive/60" : "text-mist/60"}`}>
        Related reading
      </p>
      <h2 className={`mb-8 font-serif text-4xl leading-tight ${light ? "text-deep" : "text-cream"}`}>Build context before action</h2>
      <BlogGrid articles={articles} tone={tone} />
    </section>
  );
}
