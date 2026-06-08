"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { LeadMagnet } from "@/types/content";
import { useAdminToken } from "./AdminAuthGate";
import CloudinaryFileUploader from "./CloudinaryFileUploader";
import CloudinaryImageUploader from "./CloudinaryImageUploader";
import { MediaPreview } from "./MediaPicker";

function leadMagnetPdfPublicId(slug: string, title = "") {
  const normalizedSlug = slugifyLeadMagnet(slug, title);
  return normalizedSlug ? `${normalizedSlug}.pdf` : "";
}

function slugifyLeadMagnet(value: string, title = "") {
  const base = (value || title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const titleSlug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (titleSlug === "the-7-hygiene-mistakes-most-men-make") return "7-hygiene-mistakes";
  if (base === "the-7-hygiene-mistakes-most-men-make") return "7-hygiene-mistakes";
  if (base === "hygiene-mistakes" && titleSlug.includes("7-hygiene-mistakes")) return "7-hygiene-mistakes";
  return base;
}

const blankLeadMagnet: Partial<LeadMagnet> = {
  title: "",
  slug: "",
  description: "",
  coverImage: { url: "", alt: "" },
  pdfUrl: "",
  category: "Sexual Health",
  isPublished: false,
  publicationStatus: "draft",
};

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="admin-form-card">
      <div className="admin-form-title">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function LeadMagnetForm({ leadMagnet }: { leadMagnet?: LeadMagnet }) {
  const router = useRouter();
  const { token } = useAdminToken();
  const [form, setForm] = useState<Partial<LeadMagnet>>(leadMagnet || blankLeadMagnet);
  const [message, setMessage] = useState("");

  function setField<K extends keyof LeadMagnet>(key: K, value: LeadMagnet[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Saving...");
    try {
      const payload = { ...form, slug: slugifyLeadMagnet(form.slug || "", form.title || "") };
      setForm(payload);
      if (leadMagnet?._id) {
        await adminApi.leadMagnets.update(token, leadMagnet._id, payload);
        setMessage("Saved.");
      } else {
        const created = await adminApi.leadMagnets.create(token, payload);
        router.push(`/admin/lead-magnets/${created._id}`);
      }
    } catch {
      setMessage("Could not save. Check required fields and token.");
    }
  }

  return (
    <form onSubmit={save} className="admin-stack">
      <FormSection title="Basic information" description="Create the public resource page identity and lead magnet category.">
      <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Title</span>
          <input
            className="admin-input"
            value={form.title || ""}
            onChange={(e) => {
              const title = e.target.value;
              setForm((current) => ({
                ...current,
                title,
                slug: current.slug ? slugifyLeadMagnet(current.slug, title) : slugifyLeadMagnet("", title),
              }));
            }}
            required
          />
        </label>
        <label className="admin-field">
          <span className="admin-label">Slug</span>
          <input className="admin-input" value={form.slug || ""} onChange={(e) => setField("slug", slugifyLeadMagnet(e.target.value, form.title || ""))} required />
        </label>
        <label className="admin-field">
          <span className="admin-label">Category</span>
          <input className="admin-input" value={form.category || ""} onChange={(e) => setField("category", e.target.value)} required />
        </label>
        <div className="admin-field admin-field-full">
          <CloudinaryImageUploader
            folderType="lead-magnets"
            value={form.coverImage?.url || ""}
            label="Cloudinary lead magnet cover upload"
            helperText="Upload a production lead magnet cover to Cloudinary."
            alt={form.coverImage?.alt || form.title || ""}
            onChange={(url) => setField("coverImage", { url, alt: form.coverImage?.alt || form.title || "" })}
          />
        </div>
        <div className="admin-field">
          <span className="admin-label">Current cover</span>
          <MediaPreview asset={form.coverImage} label="Lead magnet cover image" />
        </div>
        <label className="admin-field">
          <span className="admin-label">Cover image URL</span>
          <input className="admin-input" value={form.coverImage?.url || ""} onChange={(e) => setField("coverImage", { url: e.target.value, alt: form.title || "" })} />
        </label>
        <label className="admin-field">
          <span className="admin-label">Cover image alt text</span>
          <input
            className="admin-input"
            value={form.coverImage?.alt || ""}
            onChange={(e) => setField("coverImage", { url: form.coverImage?.url || "", alt: e.target.value })}
          />
        </label>
        <div className="admin-field admin-field-full">
          <CloudinaryFileUploader
            folderType="lead-magnet-pdfs"
            value={form.pdfUrl || ""}
            label="Lead magnet PDF upload"
            helperText="Upload the public/free PDF delivered after form submission. The Cloudinary public ID uses the normalized lead magnet slug and the returned secure URL is stored below."
            publicId={leadMagnetPdfPublicId(form.slug || "", form.title || "")}
            onChange={(url) => setField("pdfUrl", url)}
          />
        </div>
        <label className="admin-field admin-field-full">
          <span className="admin-label">Manual PDF URL</span>
          <input className="admin-input" value={form.pdfUrl || ""} onChange={(e) => setField("pdfUrl", e.target.value)} required />
        </label>
      </div>
      </FormSection>

      <FormSection title="Content" description="Explain the value of the PDF clearly and calmly.">
      <label className="admin-field">
        <span className="admin-label">Description</span>
        <textarea className="admin-textarea admin-textarea-excerpt" value={form.description || ""} onChange={(e) => setField("description", e.target.value)} required />
      </label>
      </FormSection>

      <FormSection title="Publishing" description="Publish only when the PDF URL and cover image are ready.">
      <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Publishing status</span>
          <select
            className="admin-input"
            value={form.publicationStatus || (form.isPublished ? "published" : "draft")}
            onChange={(e) => setField("publicationStatus", e.target.value as LeadMagnet["publicationStatus"])}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Scheduled date</span>
          <input
            className="admin-input"
            type="datetime-local"
            value={form.scheduledAt ? String(form.scheduledAt).slice(0, 16) : ""}
            onChange={(e) => setField("scheduledAt", e.target.value)}
          />
        </label>
      </div>
      </FormSection>

      <div className="admin-save-bar admin-action-row">
        {message && <p className="mr-auto font-sans text-sm text-[#5F6648]">{message}</p>}
        <button className="admin-primary" type="submit">Save lead magnet</button>
      </div>
    </form>
  );
}
