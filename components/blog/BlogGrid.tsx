import type { BlogArticle } from "@/types/content";
import BlogCard from "./BlogCard";

export default function BlogGrid({ articles, tone = "dark" }: { articles: BlogArticle[]; tone?: "dark" | "light" }) {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <BlogCard key={article._id} article={article} tone={tone} />
      ))}
    </div>
  );
}
