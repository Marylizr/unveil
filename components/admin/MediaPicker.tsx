"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { MediaAsset } from "@/types/media";

export function MediaPreview({ asset, label }: { asset?: { url: string; alt?: string }; label?: string }) {
  if (!asset?.url) {
    return (
      <div className="admin-media-empty">
        <span>{label || "No image selected"}</span>
      </div>
    );
  }

  return (
    <div className="admin-media-preview">
      <img src={asset.url} alt={asset.alt || label || "Selected media"} />
    </div>
  );
}

export default function MediaPicker({
  label = "Image",
  value,
  onSelect,
  allowMultiple = false,
  helper,
}: {
  label?: string;
  value?: string;
  onSelect: (asset: MediaAsset) => void;
  allowMultiple?: boolean;
  helper?: string;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [alt, setAlt] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  async function upload(file?: File) {
    if (!file) return;
    setIsUploading(true);
    setMessage("Uploading...");
    try {
      const asset = await adminApi.media.upload(file, alt);
      setAssets((current) => [asset, ...current]);
      setAlt("");
      setMessage("Uploaded.");
      onSelect(asset);
    } catch {
      setMessage("Upload failed. Use JPG, PNG, WEBP, or GIF up to 5MB.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="admin-media-picker">
      <div className="admin-media-picker-head">
        <div>
          <span className="admin-label">{label}</span>
          {helper && <p>{helper}</p>}
        </div>
        {message && <p className="admin-media-message">{message}</p>}
      </div>

      <div className="admin-media-upload">
        <label className="admin-field">
          <span className="admin-label">Upload new image</span>
          <input
            className="admin-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={isUploading}
            onChange={(event) => upload(event.target.files?.[0])}
          />
        </label>
        <label className="admin-field">
          <span className="admin-label">Alt text</span>
          <input
            className="admin-input"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe the image"
          />
        </label>
      </div>

      <label className="admin-field">
        <span className="admin-label">Search media</span>
        <input
          className="admin-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reusable images"
        />
      </label>

      <div className="admin-media-grid">
        {filtered.map((asset) => {
          const selected = value === asset.url;
          return (
            <button
              key={asset.id}
              type="button"
              className={`admin-media-tile ${selected ? "admin-media-tile-active" : ""}`}
              onClick={() => onSelect(asset)}
            >
              <img src={asset.url} alt={asset.alt} loading="lazy" />
              <span>{allowMultiple ? "Add image" : selected ? "Selected" : "Select image"}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="admin-media-empty admin-media-empty-wide">
            <span>No media found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
