"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, AdminTableCard, FilterSelect, PAGE_SIZE, Pagination, SearchBox, StatusPill } from "@/components/admin/AdminListTools";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import { adminApi } from "@/lib/admin/adminApi";
import type { Product } from "@/types/content";

function publishingStatus(item: Product) {
  return item.publicationStatus || (item.isPublished ? "published" : "draft");
}

export default function AdminProductsPage() {
  const { token } = useAdminToken();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  async function load() {
    setProducts(await adminApi.products.list(token));
  }

  useEffect(() => {
    load().catch(() => setMessage("Could not load products."));
  }, [token]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return products.filter((product) =>
      [product.title?.en, product.category, product.productType, product.sku, publishingStatus(product)].filter(Boolean).join(" ").toLowerCase().includes(needle) &&
      (status === "all" || publishingStatus(product) === status) &&
      (category === "all" || product.category === category) &&
      (productType === "all" || product.productType === productType)
    );
  }, [products, query, status, category, productType]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function remove(product: Product) {
    if (!window.confirm(`Delete "${product.title.en}"?`)) return;
    await adminApi.products.remove(token, product._id);
    await load();
  }

  return (
    <div>
      <AdminHeader eyebrow="Catalog" title="Products" action={<Link className="admin-primary" href="/admin/products/new">New product</Link>} />
      <div className="admin-tools-card mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SearchBox value={query} onChange={(value) => { setQuery(value); setPage(1); }} />
        <FilterSelect label="Status" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ label: "All", value: "all" }, { label: "Draft", value: "draft" }, { label: "Scheduled", value: "scheduled" }, { label: "Published", value: "published" }, { label: "Archived", value: "archived" }]} />
        <FilterSelect label="Category" value={category} onChange={(value) => { setCategory(value); setPage(1); }} options={[{ label: "All", value: "all" }, ...Array.from(new Set(products.map((item) => item.category))).map((value) => ({ label: value, value }))]} />
        <FilterSelect label="Type" value={productType} onChange={(value) => { setProductType(value); setPage(1); }} options={[{ label: "All", value: "all" }, ...Array.from(new Set(products.map((item) => item.productType))).map((value) => ({ label: value, value }))]} />
      </div>
      {message && <p className="mb-5 font-sans text-sm text-sage">{message}</p>}
      <AdminTableCard
        count={filtered.length}
        empty={
          <AdminEmptyState
            title="No products found"
            body="Adjust the search or filters, or create a new educational product or resource."
            action={<Link className="admin-primary" href="/admin/products/new">New product</Link>}
          />
        }
        minWidth={920}
      >
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Type</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product._id}>
                <td>
                  <span className="admin-row-title">{product.title.en}</span>
                  <span className="admin-row-meta">{product.sku || product.slug}</span>
                </td>
                <td>{product.category}</td>
                <td>{product.productType}</td>
                <td className="space-x-3"><StatusPill active={publishingStatus(product) === "published"} label={publishingStatus(product)} /><StatusPill active={product.isFeatured} label="Featured" /></td>
                <td>
                  <div className="admin-table-actions">
                  <Link href={`/admin/products/${product._id}`}>Edit</Link>
                  <button onClick={() => adminApi.products.publish(token, product._id, !product.isPublished).then(load)}>{product.isPublished ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => adminApi.products.feature(token, product._id, !product.isFeatured).then(load)}>{product.isFeatured ? "Unfeature" : "Feature"}</button>
                  <button className="admin-danger" onClick={() => remove(product)}>Delete</button>
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
