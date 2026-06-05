"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { Post } from "@/types/content";

interface PostCardProps {
  post: Post;
  large?: boolean;
}

export default function PostCard({ post, large = false }: PostCardProps) {
  const { language, t } = useLanguage();
  const imageUrl = post.imageUrl || post.coverImage?.url || "";
  const readTime = post.readTime || post.estimatedReadingMinutes || 5;

  return (
    <Link href={`/learn/${post.slug}`} className="group block">
      <div className={`relative overflow-hidden ${large ? "aspect-[4/5]" : "aspect-[3/2]"} bg-forest/30`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title[language]}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest/60 to-deep" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />

        {/* Category */}
        <span className="absolute top-4 left-4 font-sans text-[10px] uppercase tracking-widest text-mist/80 border border-mist/30 px-2.5 py-1">
          {post.category}
        </span>
      </div>

      <div className="pt-4">
        <h3 className={`font-serif text-cream leading-tight group-hover:text-mist transition-colors mb-2 ${large ? "text-3xl md:text-4xl" : "text-xl"}`}>
          {post.title[language]}
        </h3>
        <p className="font-sans text-sm text-sage/70 leading-relaxed line-clamp-2 mb-3">
          {post.excerpt[language]}
        </p>
        <span className="font-sans text-xs text-sage/50 uppercase tracking-widest">
          {readTime} {t.journal.minRead} →
        </span>
      </div>
    </Link>
  );
}
