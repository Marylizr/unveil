"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminListTools";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import BlogForm from "@/components/admin/BlogForm";
import { adminApi } from "@/lib/admin/adminApi";
import type { BlogArticle } from "@/types/content";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const { token } = useAdminToken();
  const [article, setArticle] = useState<BlogArticle | null>(null);

  useEffect(() => {
    adminApi.blog.get(token, params.id).then(setArticle).catch(() => setArticle(null));
  }, [token, params.id]);

  return (
    <div>
      <AdminHeader eyebrow="Editorial" title={article ? article.title.en : "Loading article"} />
      {article && <BlogForm article={article} />}
    </div>
  );
}

