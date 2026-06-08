"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, AdminTableCard, FilterSelect, PAGE_SIZE, Pagination, SearchBox, StatusPill } from "@/components/admin/AdminListTools";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import { adminApi } from "@/lib/admin/adminApi";
import type { LeadMagnet } from "@/types/content";

function publishingStatus(item: LeadMagnet) {
  return item.publicationStatus || (item.isPublished ? "published" : "draft");
}

export default function AdminLeadMagnetsPage() {
  const { token } = useAdminToken();
  const [items, setItems] = useState<LeadMagnet[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  async function load() {
    setItems(await adminApi.leadMagnets.list(token));
  }

  useEffect(() => {
    load().catch(() => {});
  }, [token]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return items.filter((item) =>
      [item.title, item.category, item.slug, publishingStatus(item)].join(" ").toLowerCase().includes(needle) &&
      (status === "all" || publishingStatus(item) === status)
    );
  }, [items, query, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function remove(item: LeadMagnet) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    await adminApi.leadMagnets.remove(token, item._id);
    await load();
  }

  async function togglePublish(item: LeadMagnet) {
    setMessage(item.isPublished ? "Unpublishing..." : "Publishing...");
    try {
      await adminApi.leadMagnets.publish(token, item._id, !item.isPublished);
      setMessage(item.isPublished ? "Unpublished." : "Published.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update publishing status.");
    }
  }

  return (
    <div>
      <AdminHeader eyebrow="Conversion" title="Lead Magnets" action={<Link className="admin-primary" href="/admin/lead-magnets/new">New lead magnet</Link>} />
      {message && <p className="mb-4 font-sans text-sm text-[#5F6648]">{message}</p>}
      <div className="admin-tools-card mb-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px]">
        <SearchBox value={query} onChange={(value) => { setQuery(value); setPage(1); }} />
        <FilterSelect label="Status" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ label: "All", value: "all" }, { label: "Draft", value: "draft" }, { label: "Scheduled", value: "scheduled" }, { label: "Published", value: "published" }, { label: "Archived", value: "archived" }]} />
      </div>
      <AdminTableCard
        count={filtered.length}
        empty={
          <AdminEmptyState
            title="No lead magnets found"
            body="Adjust the search or filters, or create a new educational download."
            action={<Link className="admin-primary" href="/admin/lead-magnets/new">New lead magnet</Link>}
          />
        }
      >
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item._id}>
                <td>
                  <span className="admin-row-title">{item.title}</span>
                  <span className="admin-row-meta">{item.slug}</span>
                </td>
                <td>{item.category}</td>
                <td><StatusPill active={publishingStatus(item) === "published"} label={publishingStatus(item)} /></td>
                <td>
                  <div className="admin-table-actions">
                  <Link href={`/admin/lead-magnets/${item._id}`}>Edit</Link>
                  <button onClick={() => togglePublish(item)}>{item.isPublished ? "Unpublish" : "Publish"}</button>
                  <button className="admin-danger" onClick={() => remove(item)}>Delete</button>
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
