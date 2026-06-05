"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, AdminTableCard, FilterSelect, PAGE_SIZE, Pagination, SearchBox, StatusPill } from "@/components/admin/AdminListTools";
import { adminApi } from "@/lib/admin/adminApi";
import type { AdminOrder } from "@/types/admin";

function formatAmount(order: AdminOrder) {
  return new Intl.NumberFormat("en", { style: "currency", currency: order.currency || "EUR" }).format(order.totalAmount);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi.orders.list(status).then(setOrders).catch(() => setMessage("Could not load orders."));
  }, [status]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return orders.filter((order) =>
      [order.customerEmail, order.customerName, order.status, order.paymentProvider, ...order.lineItems.map((item) => item.title)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [orders, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <AdminHeader eyebrow="Sales readiness" title="Orders" />
      <div className="admin-tools-card mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SearchBox value={query} onChange={(value) => { setQuery(value); setPage(1); }} />
        <FilterSelect
          label="Status"
          value={status}
          onChange={(value) => { setStatus(value); setPage(1); }}
          options={["all", "pending", "paid", "failed", "refunded", "canceled"].map((value) => ({ label: value, value }))}
        />
      </div>
      {message && <p className="mb-5 font-sans text-sm text-sage">{message}</p>}
      <AdminTableCard
        count={filtered.length}
        minWidth={920}
        empty={<AdminEmptyState title="No orders yet" body="Orders will appear here after checkout is connected. No manual payments are active in this phase." />}
      >
        <table className="admin-table">
          <thead>
            <tr><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Created</th></tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order._id}>
                <td>
                  <span className="admin-row-title">{order.customerEmail}</span>
                  <span className="admin-row-meta">{order.customerName || order.paymentProvider}</span>
                </td>
                <td>{order.lineItems.map((item) => item.title).join(", ") || `${order.productIds.length} product(s)`}</td>
                <td>{formatAmount(order)}</td>
                <td><StatusPill active={order.status === "paid"} label={order.status} /></td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableCard>
      <Pagination page={page} pageCount={pageCount} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
