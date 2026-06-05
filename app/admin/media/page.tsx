"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, SearchBox } from "@/components/admin/AdminListTools";
import MediaPicker from "@/components/admin/MediaPicker";
import { adminApi } from "@/lib/admin/adminApi";
import type { MediaAsset } from "@/types/media";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    setAssets(await adminApi.media.list());
  }

  useEffect(() => {
    load().catch(() => setMessage("Could not load media library."));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return assets.filter((asset) =>
      [asset.originalName, asset.alt, asset.filename].join(" ").toLowerCase().includes(needle)
    );
  }, [assets, query]);

  return (
    <div className="admin-stack">
      <AdminHeader eyebrow="Assets" title="Media Library" />

      <section className="admin-form-card">
        <div className="admin-form-title">
          <h2>Upload and reuse images</h2>
          <p>Use this library for article covers, lead magnet covers, and product galleries.</p>
        </div>
        <MediaPicker
          label="Media manager"
          helper="Upload a new image or select an existing asset to copy its URL."
          value={selected?.url}
          onSelect={(asset) => {
            setSelected(asset);
            setAssets((current) => {
              if (current.some((item) => item.id === asset.id)) return current;
              return [asset, ...current];
            });
          }}
        />
      </section>

      <section className="admin-panel overflow-hidden">
        <div className="admin-tools-card rounded-none border-0 border-b border-deep/10 shadow-none">
          <SearchBox value={query} onChange={setQuery} />
        </div>
        {message && <p className="p-5 font-sans text-sm text-[#5F6648]">{message}</p>}
        {filtered.length > 0 ? (
          <div className="admin-media-library-grid">
            {filtered.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className={`admin-media-library-card ${selected?.id === asset.id ? "admin-media-library-card-active" : ""}`}
                onClick={() => setSelected(asset)}
              >
                <img src={asset.url} alt={asset.alt} loading="lazy" />
                <span>{asset.alt || asset.originalName}</span>
                <small>{asset.url}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <AdminEmptyState title="No media yet" body="Upload your first CMS image above, then reuse it across the admin editor." />
          </div>
        )}
      </section>

      {selected && (
        <section className="admin-form-card admin-form-card-muted">
          <div className="admin-form-title">
            <h2>Selected image</h2>
            <p>This URL can be used anywhere an image field is needed.</p>
          </div>
          <div className="admin-field-grid">
            <div className="admin-field">
              <span className="admin-label">Preview</span>
              <div className="admin-media-preview">
                <img src={selected.url} alt={selected.alt} />
              </div>
            </div>
            <label className="admin-field">
              <span className="admin-label">Image URL</span>
              <input className="admin-input" readOnly value={selected.url} onFocus={(event) => event.target.select()} />
            </label>
          </div>
        </section>
      )}
    </div>
  );
}
