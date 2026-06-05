"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, SearchBox } from "@/components/admin/AdminListTools";
import DigitalAssetPicker from "@/components/admin/DigitalAssetPicker";
import { adminApi } from "@/lib/admin/adminApi";
import type { PrivateDigitalAsset } from "@/types/digitalAsset";

function formatSize(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDigitalAssetsPage() {
  const [assets, setAssets] = useState<PrivateDigitalAsset[]>([]);
  const [selected, setSelected] = useState<PrivateDigitalAsset | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setAssets(await adminApi.digitalAssets.list());
  }

  useEffect(() => {
    load().catch(() => setMessage("Could not load private digital assets."));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return assets.filter((asset) =>
      [asset.originalName, asset.filename, asset.assetUrl].join(" ").toLowerCase().includes(needle)
    );
  }, [assets, query]);

  return (
    <div className="admin-stack">
      <AdminHeader eyebrow="Protected Delivery" title="Private Digital Assets" />

      <section className="admin-form-card">
        <div className="admin-form-title">
          <h2>Upload protected files</h2>
          <p>Files here are stored outside `/public` and prepared for future paid ebook, guide, and course delivery.</p>
        </div>
        <DigitalAssetPicker
          value={selected?.assetUrl}
          helper="Upload or select a private asset. Use the asset URL in a product's digital asset field."
          onSelect={(asset) => {
            setSelected(asset);
            setAssets((current) => current.some((item) => item.id === asset.id) ? current : [asset, ...current]);
          }}
        />
      </section>

      <section className="admin-panel overflow-hidden">
        <div className="admin-tools-card rounded-none border-0 border-b border-deep/10 shadow-none">
          <SearchBox value={query} onChange={setQuery} />
        </div>
        {message && <p className="p-5 font-sans text-sm text-[#5F6648]">{message}</p>}
        {filtered.length > 0 ? (
          <div className="admin-digital-asset-table">
            {filtered.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className={`admin-digital-asset-row ${selected?.id === asset.id ? "admin-digital-asset-row-active" : ""}`}
                onClick={() => setSelected(asset)}
              >
                <span>
                  <strong>{asset.originalName}</strong>
                  <small>{asset.assetUrl} · {asset.contentType} · {formatSize(asset.size)}</small>
                </span>
                <em>{new Date(asset.createdAt).toLocaleDateString()}</em>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <AdminEmptyState title="No private assets yet" body="Upload protected PDFs or ebooks above, then connect them to digital products." />
          </div>
        )}
      </section>

      {selected && (
        <section className="admin-form-card admin-form-card-muted">
          <div className="admin-form-title">
            <h2>Selected asset</h2>
            <p>This private asset URL is safe to store on a product. It is not a public download URL.</p>
          </div>
          <label className="admin-field">
            <span className="admin-label">Private digital asset URL</span>
            <input className="admin-input" readOnly value={selected.assetUrl} onFocus={(event) => event.target.select()} />
          </label>
        </section>
      )}
    </div>
  );
}
