"use client";

import { useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { CloudinaryFolderType } from "@/types/media";

function formatSize(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CloudinaryFileUploader({
  folderType,
  value,
  onChange,
  label = "Upload file",
  helperText,
  accept = "application/pdf,.pdf",
  publicId,
}: {
  folderType: Extract<CloudinaryFolderType, "lead-magnet-pdfs">;
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  accept?: string;
  publicId?: string;
}) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file?: File) {
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    if (file.type !== "application/pdf") {
      setMessage(`Upload failed: only PDF files are supported. Selected ${file.type || "unknown file type"}.`);
      return;
    }

    if (!publicId) {
      setMessage("Upload failed: add a normalized lead magnet slug before uploading the PDF.");
      return;
    }

    setIsUploading(true);
    setMessage("Uploading PDF...");

    try {
      const asset = await adminApi.media.upload(file, file.name, folderType, publicId);
      onChange(asset.secureUrl || asset.url);
      setMessage("PDF uploaded.");
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
          <span className="admin-label">{label}</span>
          {helperText && <p>{helperText}</p>}
        </div>
        {message && <p className="admin-media-message">{message}</p>}
      </div>

      <label className="admin-field">
        <span className="admin-label">PDF file</span>
        <input
          className="admin-input"
          type="file"
          accept={accept}
          disabled={isUploading}
          onChange={(event) => upload(event.target.files?.[0])}
        />
        {fileName && <small>Selected: {fileName}{fileSize ? ` · ${formatSize(fileSize)}` : ""}</small>}
        {isUploading && <small>Uploading PDF to Cloudinary...</small>}
      </label>

      {value ? (
        <div className="admin-media-empty admin-media-empty-wide">
          <span>{value.startsWith("https://") ? value : "PDF uploaded."}</span>
          <a className="admin-secondary" href={value} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </div>
      ) : (
        <div className="admin-media-empty admin-media-empty-wide">
          <span>No file uploaded.</span>
        </div>
      )}
    </div>
  );
}
