"use client";

import { useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { CloudinaryFolderType } from "@/types/media";

export default function CloudinaryImageUploader({
  folderType,
  value,
  onChange,
  label = "Upload image",
  helperText,
  alt,
}: {
  folderType: CloudinaryFolderType;
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  alt?: string;
}) {
  const [fileName, setFileName] = useState("");
  const [altText, setAltText] = useState(alt || "");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file?: File) {
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setMessage("Uploading...");

    try {
      const asset = await adminApi.media.upload(file, altText || alt, folderType);
      onChange(asset.optimizedUrl || asset.secureUrl || asset.url);
      setAltText("");
      setMessage("Uploaded to Cloudinary.");
    } catch {
      setMessage("Upload failed. Use JPG, PNG, WEBP, or AVIF up to 8MB.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="admin-media-picker">
      <div className="admin-media-picker-head">
        <div>
          <span className="admin-label">{label}</span>
          {helperText && <p>{helperText}</p>}
        </div>
        {message && <p className="admin-media-message">{message}</p>}
      </div>

      <div className="admin-media-upload">
        <label className="admin-field">
          <span className="admin-label">Image file</span>
          <input
            className="admin-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={isUploading}
            onChange={(event) => upload(event.target.files?.[0])}
          />
          {fileName && <small>{fileName}</small>}
        </label>
        <label className="admin-field">
            <span className="admin-label">Alt text</span>
          <input
            className="admin-input"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Describe the image"
            disabled={isUploading}
          />
        </label>
      </div>

      {value ? (
        <div className="admin-media-preview">
          <img src={value} alt={altText || alt || label} />
        </div>
      ) : (
        <div className="admin-media-empty admin-media-empty-wide">
          <span>No Cloudinary image uploaded.</span>
        </div>
      )}
    </div>
  );
}
