"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { AdminStats, Lead } from "@/types/admin";
import type { BlogArticle } from "@/types/content";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-panel p-5">
      <p className="font-sans text-xs uppercase tracking-widest text-olive/65">{label}</p>
      <p className="mt-4 font-sans text-4xl font-semibold text-deep">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.admin.stats(),
      adminApi.blog.list(),
      adminApi.leads.list(),
    ])
      .then(([nextStats, nextArticles, nextLeads]) => {
        setStats(nextStats);
        setArticles(nextArticles);
        setLeads(nextLeads);
      })
      .catch(() => setError("Could not load dashboard stats. Check that the API server is running."));
  }, []);

  const statCards = [
    { label: "Total blog articles", value: stats?.totalBlogArticles ?? 0 },
    { label: "Published articles", value: stats?.publishedArticles ?? 0 },
    { label: "Draft articles", value: stats?.draftArticles ?? 0 },
    { label: "Total products", value: stats?.totalProducts ?? 0 },
    { label: "Published products", value: stats?.publishedProducts ?? 0 },
    { label: "Total leads", value: stats?.totalLeads ?? 0 },
    { label: "Confirmed leads", value: stats?.confirmedLeads ?? 0 },
    { label: "Lead magnets", value: stats?.leadMagnets ?? 0 },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.24em] text-gold">Internal dashboard</p>
          <h2 className="font-sans text-3xl font-semibold leading-tight text-deep md:text-4xl">UNVEIL backoffice</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="admin-primary" href="/admin/blog/new">New Article</Link>
          <Link className="admin-secondary" href="/admin/products/new">New Product</Link>
          <Link className="admin-secondary" href="/admin/lead-magnets/new">New Lead Magnet</Link>
        </div>
      </div>

      {error && <p className="mb-6 rounded-xl border border-red-900/20 bg-red-50 p-4 font-sans text-sm text-red-900">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { href: "/admin/blog", title: "Blog", body: "Write, edit, publish, and relate educational articles." },
          { href: "/admin/products", title: "Products", body: "Manage resources, digital guides, and wellness tools." },
          { href: "/admin/lead-magnets", title: "Lead Magnets", body: "Maintain PDF resources and lead capture assets." },
          { href: "/admin/leads", title: "Leads", body: "Search, inspect, and export lead records." },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="admin-panel block p-6 transition-colors hover:border-gold/45">
            <h3 className="font-sans text-2xl text-deep">{card.title}</h3>
            <p className="mt-3 font-sans text-sm leading-relaxed text-olive/75">{card.body}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="admin-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="font-sans text-lg font-semibold text-deep">Recent articles</h3>
            <Link href="/admin/blog" className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">View all</Link>
          </div>
          <div className="space-y-3">
            {articles.slice(0, 5).map((article) => (
              <Link key={article._id} href={`/admin/blog/${article._id}`} className="block rounded-xl border border-deep/10 bg-[#F4F1E8] p-3 transition-colors hover:border-gold/45">
                <span className="block font-sans text-sm font-semibold text-deep">{article.title.en}</span>
                <span className="mt-1 block font-sans text-xs text-[#5F6648]">{article.isPublished ? "Published" : "Draft"} · {article.category}</span>
              </Link>
            ))}
            {articles.length === 0 && <p className="font-sans text-sm text-[#5F6648]">No articles yet.</p>}
          </div>
        </section>

        <section className="admin-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="font-sans text-lg font-semibold text-deep">Recent leads</h3>
            <Link href="/admin/leads" className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">View all</Link>
          </div>
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead._id} className="rounded-xl border border-deep/10 bg-[#F4F1E8] p-3">
                <span className="block font-sans text-sm font-semibold text-deep">{lead.email}</span>
                <span className="mt-1 block font-sans text-xs text-[#5F6648]">{lead.status} · {lead.source || "unknown source"}</span>
              </div>
            ))}
            {leads.length === 0 && <p className="font-sans text-sm text-[#5F6648]">No leads yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
