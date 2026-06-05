"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, AdminTableCard, FilterSelect, PAGE_SIZE, Pagination, SearchBox, StatusPill } from "@/components/admin/AdminListTools";
import { adminApi } from "@/lib/admin/adminApi";
import type { AdminEntitlement } from "@/types/admin";

function productLabel(entitlement: AdminEntitlement) {
  if (typeof entitlement.productId === "string") return entitlement.productId;
  return entitlement.productId.title?.en || entitlement.productId.slug || entitlement.productId._id;
}

export default function AdminEntitlementsPage() {
  const [entitlements, setEntitlements] = useState<AdminEntitlement[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  async function load() {
    setEntitlements(await adminApi.entitlements.list({ status }));
  }

  useEffect(() => {
    load().catch(() => setMessage("Could not load entitlements."));
  }, [status]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return entitlements.filter((entitlement) =>
      [entitlement.customerEmail, entitlement.status, entitlement.accessType, productLabel(entitlement)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [entitlements, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function revoke(id: string) {
    if (!window.confirm("Revoke this entitlement?")) return;
    await adminApi.entitlements.revoke(id);
    await load();
  }

  return (
    <div>
      <AdminHeader eyebrow="Sales readiness" title="Entitlements" />
      <div className="admin-tools-card mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SearchBox value={query} onChange={(value) => { setQuery(value); setPage(1); }} />
        <FilterSelect
          label="Status"
          value={status}
          onChange={(value) => { setStatus(value); setPage(1); }}
          options={["all", "active", "revoked", "expired"].map((value) => ({ label: value, value }))}
        />
      </div>
      {message && <p className="mb-5 font-sans text-sm text-sage">{message}</p>}
      <AdminTableCard
        count={filtered.length}
        minWidth={980}
        empty={<AdminEmptyState title="No entitlements yet" body="Paid access records will appear here after a verified payment creates them." />}
      >
        <table className="admin-table">
          <thead>
            <tr><th>Customer</th><th>Product</th><th>Access</th><th>Status</th><th>Downloads</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map((entitlement) => (
              <tr key={entitlement._id}>
                <td>
                  <span className="admin-row-title">{entitlement.customerEmail}</span>
                  <span className="admin-row-meta">{entitlement.createdAt ? new Date(entitlement.createdAt).toLocaleDateString() : "—"}</span>
                </td>
                <td>{productLabel(entitlement)}</td>
                <td>{entitlement.accessType}</td>
                <td><StatusPill active={entitlement.status === "active"} label={entitlement.status} /></td>
                <td>{entitlement.downloadCount || 0}</td>
                <td>
                  <div className="admin-table-actions">
                    <button disabled={entitlement.status !== "active"} onClick={() => revoke(entitlement._id)}>
                      Revoke
                    </button>
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
