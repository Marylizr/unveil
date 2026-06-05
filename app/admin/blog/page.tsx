"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, AdminTableCard, FilterSelect, PAGE_SIZE, Pagination, SearchBox, StatusPill } from "@/components/admin/AdminListTools";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import { adminApi } from "@/lib/admin/adminApi";
import type { BlogArticle } from "@/types/content";

function publishingStatus(item: BlogArticle) {
  return item.publicationStatus || (item.isPublished ? "published" : "draft");
}

export default function AdminBlogPage() {
  const { token } = useAdminToken();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [page, setPage] = useState(1);

  async function load() {
    setArticles(await adminApi.blog.list(token));
  }

  useEffect(() => {
    load().catch(() => {});
  }, [token]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return articles.filter((article) =>
      [article.title?.en, article.category, article.contentType, article.difficulty, publishingStatus(article)].filter(Boolean).join(" ").toLowerCase().includes(needle) &&
      (status === "all" || publishingStatus(article) === status) &&
      (category === "all" || article.category === category) &&
      (contentType === "all" || article.contentType === contentType)
    );
  }, [articles, query, status, category, contentType]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function remove(article: BlogArticle) {
    if (!window.confirm(`Delete "${article.title.en}"?`)) return;
    await adminApi.blog.remove(token, article._id);
    await load();
  }

  return (
    <div>
      <AdminHeader eyebrow="Editorial" title="Blog Articles" action={<Link className="admin-primary" href="/admin/blog/new">New article</Link>} />
      <div className="admin-tools-card mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SearchBox value={query} onChange={(value) => { setQuery(value); setPage(1); }} />
        <FilterSelect label="Status" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ label: "All", value: "all" }, { label: "Draft", value: "draft" }, { label: "Scheduled", value: "scheduled" }, { label: "Published", value: "published" }, { label: "Archived", value: "archived" }]} />
        <FilterSelect label="Category" value={category} onChange={(value) => { setCategory(value); setPage(1); }} options={[{ label: "All", value: "all" }, ...Array.from(new Set(articles.map((item) => item.category))).map((value) => ({ label: value, value }))]} />
        <FilterSelect label="Format" value={contentType} onChange={(value) => { setContentType(value); setPage(1); }} options={[{ label: "All", value: "all" }, ...Array.from(new Set(articles.map((item) => item.contentType))).map((value) => ({ label: value, value }))]} />
      </div>
      <AdminTableCard
        count={filtered.length}
        empty={
          <AdminEmptyState
            title="No articles found"
            body="Adjust the search or filters, or create a new journal article."
            action={<Link className="admin-primary" href="/admin/blog/new">New article</Link>}
          />
        }
      >
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Format</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map((article) => (
              <tr key={article._id}>
                <td>
                  <span className="admin-row-title">{article.title.en}</span>
                  <span className="admin-row-meta">{article.slug}</span>
                </td>
                <td>{article.category}</td>
                <td>{article.contentType}</td>
                <td><StatusPill active={publishingStatus(article) === "published"} label={publishingStatus(article)} /></td>
                <td>
                  <div className="admin-table-actions">
                  <Link href={`/admin/blog/${article._id}`}>Edit</Link>
                  <button onClick={() => adminApi.blog.publish(token, article._id, !article.isPublished).then(load)}>{article.isPublished ? "Unpublish" : "Publish"}</button>
                  <button className="admin-danger" onClick={() => remove(article)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableCard>
      <Pagination page={page} pageCount={pageCount} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
