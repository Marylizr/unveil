"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { PrivateDigitalAsset } from "@/types/digitalAsset";

function formatSize(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DigitalAssetPicker({
  value,
  onSelect,
  helper,
}: {
  value?: string;
  onSelect: (asset: PrivateDigitalAsset) => void;
  helper?: string;
}) {
  const [assets, setAssets] = useState<PrivateDigitalAsset[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function load() {
    setAssets(await adminApi.digitalAssets.list());
  }

  useEffect(() => {
    load().catch(() => setMessage("Could not load private assets."));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return assets.filter((asset) =>
      [asset.originalName, asset.filename, asset.assetUrl].join(" ").toLowerCase().includes(needle)
    );
  }, [assets, query]);

  async function upload(file?: File) {
    if (!file) return;
    setIsUploading(true);
    setMessage("Uploading private asset...");
    try {
      const asset = await adminApi.digitalAssets.upload(file);
      setAssets((current) => [asset, ...current]);
      setMessage("Uploaded.");
      onSelect(asset);
    } catch (error) {
      setMessage(error instanceof Error ? `Upload failed: ${error.message}` : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="admin-media-picker">
      <div className="admin-media-picker-head">
        <div>
          <span className="admin-label">Private digital asset</span>
          {helper && <p>{helper}</p>}
        </div>
        {message && <p className="admin-media-message">{message}</p>}
      </div>

      <label className="admin-field">
        <span className="admin-label">Upload private file</span>
        <input
          className="admin-input"
          type="file"
          accept=".pdf,.epub,.zip,application/pdf,application/epub+zip,application/zip"
          disabled={isUploading}
          onChange={(event) => upload(event.target.files?.[0])}
        />
      </label>

      <label className="admin-field">
        <span className="admin-label">Search private assets</span>
        <input
          className="admin-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by filename"
        />
      </label>

      <div className="admin-digital-asset-list">
        {filtered.map((asset) => {
          const selected = value === asset.assetUrl;
          return (
            <button
              key={asset.id}
              type="button"
              className={`admin-digital-asset-row ${selected ? "admin-digital-asset-row-active" : ""}`}
              onClick={() => onSelect(asset)}
            >
              <span>
                <strong>{asset.originalName}</strong>
                <small>{asset.assetUrl} · {formatSize(asset.size)}</small>
              </span>
              <em>{selected ? "Selected" : "Select"}</em>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="admin-media-empty admin-media-empty-wide">
            <span>No private assets found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
