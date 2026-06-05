"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { Product } from "@/types/content";
import { useAdminToken } from "./AdminAuthGate";
import CloudinaryImageUploader from "./CloudinaryImageUploader";
import DigitalAssetPicker from "./DigitalAssetPicker";
import MediaPicker, { MediaPreview } from "./MediaPicker";

const categories = [
  "Intimate Hygiene",
  "Lubricants & Comfort",
  "Male Pleasure Education",
  "Pelvic Floor & Control",
  "Prostate Wellness",
  "Grooming & Self-Care",
  "Digital Guides",
  "Male Optimization",
];

const blankProduct: Partial<Product> = {
  title: { en: "", pt: "", es: "" },
  slug: "",
  shortDescription: { en: "", pt: "", es: "" },
  fullDescription: { en: "", pt: "", es: "" },
  category: "Digital Guides",
  productType: "digital",
  price: 0,
  currency: "EUR",
  images: [],
  stockStatus: "in_stock",
  sku: "",
  tags: [],
  benefits: [],
  howToUse: [],
  materials: [],
  careInstructions: [],
  safetyNotes: [],
  isFeatured: false,
  isPublished: false,
  publicationStatus: "draft",
  isProtectedAsset: false,
  paymentProvider: "none",
  checkoutMode: "payment",
};

function lines(value?: string[]) {
  return value?.join("\n") || "";
}

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

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

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { token } = useAdminToken();
  const [form, setForm] = useState<Partial<Product>>(product || blankProduct);
  const [message, setMessage] = useState("");

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setLocalized(field: "title" | "shortDescription" | "fullDescription", value: string) {
    setForm((current) => ({
      ...current,
      [field]: { ...(current[field] || { en: "", pt: "", es: "" }), en: value },
    }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Saving...");
    const payload = {
      ...form,
      tags: Array.isArray(form.tags) ? form.tags : [],
    };
    try {
      if (product?._id) {
        await adminApi.products.update(token, product._id, payload);
        setMessage("Saved.");
      } else {
        const created = await adminApi.products.create(token, payload);
        router.push(`/admin/products/${created._id}`);
      }
    } catch {
      setMessage("Could not save. Check required fields and token.");
    }
  }

  return (
    <form onSubmit={save} className="admin-stack">
      <FormSection title="Basic information" description="Core product identity, URL, and public catalog positioning.">
      <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Title</span>
          <input className="admin-input" value={form.title?.en || ""} onChange={(e) => setLocalized("title", e.target.value)} required />
        </label>
        <label className="admin-field">
          <span className="admin-label">Slug</span>
          <input className="admin-input" value={form.slug || ""} onChange={(e) => setField("slug", e.target.value)} required />
        </label>
        <label className="admin-field">
          <span className="admin-label">Category</span>
          <select className="admin-input" value={form.category || ""} onChange={(e) => setField("category", e.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Subcategory</span>
          <input className="admin-input" value={form.subcategory || ""} onChange={(e) => setField("subcategory", e.target.value)} />
        </label>
        <label className="admin-field">
          <span className="admin-label">Product type</span>
          <select className="admin-input" value={form.productType || "digital"} onChange={(e) => setField("productType", e.target.value as Product["productType"])}>
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
            <option value="service">Service</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">SKU</span>
          <input className="admin-input" value={form.sku || ""} onChange={(e) => setField("sku", e.target.value)} required />
        </label>
      </div>
      </FormSection>

      <FormSection title="Editorial copy" description="Keep product language educational, discreet, and benefit-led.">
      <div className="admin-field-grid">
      <label className="admin-field admin-field-full">
        <span className="admin-label">Short description</span>
        <textarea className="admin-textarea admin-textarea-excerpt" value={form.shortDescription?.en || ""} onChange={(e) => setLocalized("shortDescription", e.target.value)} required />
      </label>
      <label className="admin-field admin-field-full">
        <span className="admin-label">Full description</span>
        <textarea className="admin-textarea admin-textarea-content" value={form.fullDescription?.en || ""} onChange={(e) => setLocalized("fullDescription", e.target.value)} required />
      </label>
      </div>
      </FormSection>

      <FormSection title="Commerce settings" description="Pricing and inventory state for the catalog. Checkout is not active yet.">
      <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Price</span>
          <input className="admin-input" type="number" min="0" value={form.price || 0} onChange={(e) => setField("price", Number(e.target.value))} required />
        </label>
        <label className="admin-field">
          <span className="admin-label">Compare at price</span>
          <input className="admin-input" type="number" min="0" value={form.compareAtPrice || 0} onChange={(e) => setField("compareAtPrice", Number(e.target.value))} />
        </label>
        <label className="admin-field">
          <span className="admin-label">Currency</span>
          <input className="admin-input" value={form.currency || "EUR"} onChange={(e) => setField("currency", e.target.value.toUpperCase())} required />
        </label>
        <label className="admin-field">
          <span className="admin-label">Stock status</span>
          <select className="admin-input" value={form.stockStatus || "in_stock"} onChange={(e) => setField("stockStatus", e.target.value as Product["stockStatus"])}>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="preorder">Preorder</option>
          </select>
        </label>
      </div>
      </FormSection>

      <FormSection title="Stripe readiness" description="Preparation fields only. Stripe checkout is not active yet. Keep protected digital asset URLs private.">
      <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Payment provider</span>
          <select className="admin-input" value={form.paymentProvider || "none"} onChange={(e) => setField("paymentProvider", e.target.value as Product["paymentProvider"])}>
            <option value="none">None</option>
            <option value="stripe">Stripe</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Checkout mode</span>
          <select className="admin-input" value={form.checkoutMode || "payment"} onChange={(e) => setField("checkoutMode", e.target.value as Product["checkoutMode"])}>
            <option value="payment">One-time payment</option>
            <option value="subscription">Subscription</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Stripe product ID</span>
          <input className="admin-input" value={form.stripeProductId || ""} onChange={(e) => setField("stripeProductId", e.target.value)} />
        </label>
        <label className="admin-field">
          <span className="admin-label">Stripe price ID</span>
          <input className="admin-input" value={form.stripePriceId || ""} onChange={(e) => setField("stripePriceId", e.target.value)} />
        </label>
        <label className="admin-field admin-field-full">
          <span className="admin-label">Digital asset URL</span>
          <input className="admin-input" value={form.digitalAssetUrl || ""} onChange={(e) => setField("digitalAssetUrl", e.target.value)} />
        </label>
        <div className="admin-field admin-field-full">
          <DigitalAssetPicker
            value={form.digitalAssetUrl || ""}
            helper="Select a private file for future paid/protected delivery. This does not make the file publicly downloadable."
            onSelect={(asset) => {
              setField("digitalAssetUrl", asset.assetUrl);
              setField("isProtectedAsset", true);
            }}
          />
        </div>
        <label className="admin-check admin-field admin-field-full">
          <input type="checkbox" checked={!!form.isProtectedAsset} onChange={(e) => setField("isProtectedAsset", e.target.checked)} />
          Protected paid/private asset
        </label>
        <label className="admin-field admin-field-full">
          <span className="admin-label">Legacy download URL</span>
          <input className="admin-input" value={form.downloadUrl || ""} onChange={(e) => setField("downloadUrl", e.target.value)} />
        </label>
      </div>
      </FormSection>

      <FormSection title="Product education" description="One item per line. These fields explain benefits, use, care, and safety without exposing supplier data.">
      <div className="admin-field-grid">
        {(["benefits", "chapters", "includedSections", "howToUse", "materials", "careInstructions", "safetyNotes", "tags"] as const).map((field) => (
          <label key={field} className="admin-field">
            <span className="admin-label">{field}</span>
            <textarea className="admin-textarea" value={lines(form[field] as string[])} onChange={(e) => setField(field, splitLines(e.target.value) as Product[typeof field])} />
          </label>
        ))}
      </div>
      </FormSection>

      <FormSection title="Images" description="Use the media library to build a reusable product gallery.">
      <div className="admin-field-grid">
        <div className="admin-field admin-field-full">
          <CloudinaryImageUploader
            folderType={form.productType === "digital" ? "ebooks" : "products"}
            value={form.images?.[0]?.url || ""}
            label="Cloudinary product image upload"
            helperText="Upload a production image to Cloudinary and add it to this product gallery."
            alt={form.title?.en || "UNVEIL product image"}
            onChange={(url) => {
              setForm((current) => {
                const images = current.images || [];
                if (images.some((image) => image.url === url)) return current;
                return {
                  ...current,
                  images: [
                    ...images,
                    {
                      url,
                      alt: current.title?.en || "UNVEIL product image",
                      position: images.length,
                    },
                  ],
                };
              });
            }}
          />
        </div>
        <div className="admin-field admin-field-full">
          <MediaPicker
            label="Product gallery picker"
            folderType={form.productType === "digital" ? "ebooks" : "products"}
            allowMultiple
            helper="Upload or select images. Selected images are added to the product gallery."
            onSelect={(asset) => {
              setForm((current) => {
                const images = current.images || [];
                if (images.some((image) => image.url === asset.url)) return current;
                return {
                  ...current,
                  images: [
                    ...images,
                    {
                      url: asset.url,
                      alt: asset.alt || current.title?.en || "UNVEIL product image",
                      position: images.length,
                    },
                  ],
                };
              });
            }}
          />
        </div>
        <div className="admin-field admin-field-full">
          <span className="admin-label">Gallery preview</span>
          <div className="admin-gallery-preview">
            {(form.images || []).map((image, index) => (
              <div key={`${image.url}-${index}`} className="admin-gallery-item">
                <MediaPreview asset={image} label={`Product image ${index + 1}`} />
                <button
                  type="button"
                  className="admin-secondary"
                  onClick={() => setField("images", (form.images || []).filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
            {(!form.images || form.images.length === 0) && (
              <div className="admin-media-empty admin-media-empty-wide">
                <span>No gallery images selected.</span>
              </div>
            )}
          </div>
        </div>
        <label className="admin-field admin-field-full">
          <span className="admin-label">Images JSON</span>
          <textarea
            className="admin-textarea"
            value={JSON.stringify(form.images || [], null, 2)}
            onChange={(e) => {
              try {
                setField("images", JSON.parse(e.target.value));
              } catch {
                setMessage("Images JSON is invalid.");
              }
            }}
          />
        </label>
      </div>
      </FormSection>

      <FormSection title="Relations / Publishing" description="Control whether this product appears publicly and whether it is featured.">
      <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Publishing status</span>
          <select
            className="admin-input"
            value={form.publicationStatus || (form.isPublished ? "published" : "draft")}
            onChange={(e) => setField("publicationStatus", e.target.value as Product["publicationStatus"])}
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
        <label className="admin-check admin-field">
          <input type="checkbox" checked={!!form.isFeatured} onChange={(e) => setField("isFeatured", e.target.checked)} />
          Featured
        </label>
      </div>
      </FormSection>

      <div className="admin-save-bar admin-action-row">
        {message && <p className="mr-auto font-sans text-sm text-[#5F6648]">{message}</p>}
        <button className="admin-primary" type="submit">Save product</button>
      </div>
    </form>
  );
}
