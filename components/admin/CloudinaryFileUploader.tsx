"use client";

import { useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { CloudinaryFolderType } from "@/types/media";

const LEAD_MAGNET_PDF_FOLDER = "unveil/lead-magnets/pdfs" as const;

type CloudinaryRawUploadResponse = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
  type?: string;
  access_mode?: string;
  access_control?: unknown;
  error?: { message?: string };
};

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
  onUploadStateChange,
}: {
  folderType: Extract<CloudinaryFolderType, "lead-magnet-pdfs">;
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  accept?: string;
  publicId?: string;
  onUploadStateChange?: (isUploading: boolean) => void;
}) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  function cleanCloudinaryError(text: string) {
    try {
      const parsed = JSON.parse(text) as CloudinaryRawUploadResponse;
      return parsed.error?.message || "Cloudinary upload failed.";
    } catch {
      return text.trim() || "Cloudinary upload failed.";
    }
  }

  function safeUrlHostPath(value?: string) {
    if (!value) return "";
    try {
      const url = new URL(value);
      return `${url.host}${url.pathname}`;
    } catch {
      return "";
    }
  }

  async function validatePublicDelivery(url: string) {
    try {
      const head = await fetch(url, { method: "HEAD", cache: "no-store" });
      return head.status;
    } catch {
      return "unavailable";
    }
  }

  function logUploadDebug(result: CloudinaryRawUploadResponse, publicDeliveryStatus: number | "unavailable") {
    console.info("[lead-magnet-pdf-upload]", {
      resourceType: result.resource_type,
      type: result.type,
      accessMode: result.access_mode,
      accessControl: result.access_control,
      secureUrlHostPath: safeUrlHostPath(result.secure_url),
      publicDeliveryStatus,
    });
  }

  async function uploadDirectlyToCloudinary(file: File) {
    if (!publicId) throw new Error("Add a normalized lead magnet slug before uploading the PDF.");
    const slug = publicId.replace(/\.pdf$/i, "");
    const signed = await adminApi.media.signUpload({
      slug,
      folder: LEAD_MAGNET_PDF_FOLDER,
      resourceType: "raw",
      publicId,
    });

    setMessage("Uploading to Cloudinary...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signed.apiKey);
    formData.append("timestamp", String(signed.timestamp));
    formData.append("signature", signed.signature);
    formData.append("folder", signed.folder);
    formData.append("public_id", signed.publicId);
    formData.append("type", signed.type);
    formData.append("access_mode", signed.accessMode);
    formData.append("overwrite", String(signed.overwrite));
    formData.append("invalidate", String(signed.invalidate));

    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${signed.resourceType}/upload`, {
      method: "POST",
      body: formData,
    });
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(cleanCloudinaryError(responseText));
    }

    let result: CloudinaryRawUploadResponse;
    try {
      result = JSON.parse(responseText) as CloudinaryRawUploadResponse;
    } catch {
      throw new Error("Cloudinary returned an unexpected response. Please try again.");
    }

    if (!result.secure_url) {
      throw new Error(result.error?.message || "Cloudinary did not return a secure PDF URL.");
    }

    const publicDeliveryStatus = await validatePublicDelivery(result.secure_url);
    logUploadDebug(result, publicDeliveryStatus);
    return { secureUrl: result.secure_url, publicDeliveryStatus };
  }

  async function upload(file?: File) {
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
    if (file.type !== "application/pdf" || !hasPdfExtension) {
      onUploadStateChange?.(false);
      setMessage(
        `Upload failed: only PDF files are supported. Selected ${file.type || "unknown file type"}${hasPdfExtension ? "" : " without a .pdf extension"}.`
      );
      return;
    }

    setIsUploading(true);
    onUploadStateChange?.(true);
    setMessage("Requesting upload signature...");

    try {
      const { secureUrl, publicDeliveryStatus } = await uploadDirectlyToCloudinary(file);
      onChange(secureUrl);
      setMessage(
        publicDeliveryStatus === 200
          ? "PDF uploaded successfully. Public delivery verified."
          : `PDF uploaded. Public delivery returned ${publicDeliveryStatus}; app download links will use signed delivery after token validation.`
      );
    } catch (error) {
      setMessage(error instanceof Error ? `Upload failed: ${error.message}` : "Upload failed.");
    } finally {
      setIsUploading(false);
      onUploadStateChange?.(false);
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
        {isUploading && <small>{message}</small>}
      </label>

      {value ? (
        <div className="admin-media-empty admin-media-empty-wide">
          <span>{value.startsWith("https://") ? value : "PDF uploaded successfully."}</span>
          <a className="admin-secondary" href={value} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </div>
      ) : (
        <div className="admin-media-empty admin-media-empty-wide">
          <span>
            {isUploading
              ? "Uploading PDF..."
              : fileName
                ? message.startsWith("Upload failed")
                  ? "PDF upload failed."
                  : "PDF selected. Waiting for upload."
                : "No file uploaded."}
          </span>
        </div>
      )}
    </div>
  );
}
