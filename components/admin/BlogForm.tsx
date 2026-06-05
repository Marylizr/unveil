"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin/adminApi";
import type { BlogArticle } from "@/types/content";
import { useAdminToken } from "./AdminAuthGate";
import CloudinaryImageUploader from "./CloudinaryImageUploader";
import MediaPicker, { MediaPreview } from "./MediaPicker";

const categories = [
  "Male Hygiene",
  "Sexual Health",
  "Emotional Intelligence",
  "Dating & Communication",
  "Hormones & Performance",
  "Intimacy Education",
  "Male Optimization",
];

const blankArticle: Partial<BlogArticle> = {
  title: { en: "", pt: "", es: "" },
  slug: "",
  excerpt: { en: "", pt: "", es: "" },
  content: { en: "", pt: "", es: "" },
  category: "Sexual Health",
  tags: [],
  author: { name: "UNVEIL Editorial", role: "Education" },
  readingTime: 5,
  estimatedReadingMinutes: 5,
  contentType: "article",
  difficulty: "beginner",
  relatedArticles: [],
  relatedProducts: [],
  seoTitle: "",
  seoDescription: "",
  isPublished: false,
  publicationStatus: "draft",
};

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

export default function BlogForm({ article }: { article?: BlogArticle }) {
  const router = useRouter();
  const { token } = useAdminToken();
  const [form, setForm] = useState<Partial<BlogArticle>>(article || blankArticle);
  const [relatedArticles, setRelatedArticles] = useState((article?.relatedArticles || []).map((item) => item._id).join("\n"));
  const [relatedProducts, setRelatedProducts] = useState((article?.relatedProducts || []).map((item) => item._id).join("\n"));
  const [articleOptions, setArticleOptions] = useState<BlogArticle[]>([]);
  const [productOptions, setProductOptions] = useState<Array<{ _id: string; title: { en: string } }>>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi.blog.list(token).then(setArticleOptions).catch(() => {});
    adminApi.products.list(token).then((products) => setProductOptions(products.map((product) => ({ _id: product._id, title: product.title })))).catch(() => {});
  }, [token]);

  function setField<K extends keyof BlogArticle>(key: K, value: BlogArticle[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setLocalized(field: "title" | "excerpt" | "content", value: string) {
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
      relatedArticles: splitLines(relatedArticles),
      relatedProducts: splitLines(relatedProducts),
      tags: Array.isArray(form.tags) ? form.tags : [],
    };
    try {
      if (article?._id) {
        await adminApi.blog.update(token, article._id, payload);
        setMessage("Saved.");
      } else {
        const created = await adminApi.blog.create(token, payload);
        router.push(`/admin/blog/${created._id}`);
      }
    } catch {
      setMessage("Could not save. Check required fields and token.");
    }
  }

  return (
    <form onSubmit={save} className="admin-stack">
      <FormSection title="Basic information" description="Core article identity used in the CMS, URL, and article listings.">
        <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Title</span>
          <input className="admin-input" value={form.title?.en || ""} onChange={(e) => setLocalized("title", e.target.value)} required />
        </label>
        <label className="admin-field">
          <span className="admin-label">Slug</span>
          <input className="admin-input" value={form.slug || ""} onChange={(e) => setField("slug", e.target.value)} required />
        </label>
        <label className="admin-field admin-field-full">
          <span className="admin-label">Excerpt</span>
          <textarea className="admin-textarea admin-textarea-excerpt" value={form.excerpt?.en || ""} onChange={(e) => setLocalized("excerpt", e.target.value)} required />
        </label>
        <div className="admin-field admin-field-full">
          <CloudinaryImageUploader
            folderType="articles"
            value={form.coverImage?.url || ""}
            label="Cloudinary article cover upload"
            helperText="Upload a production article cover to Cloudinary."
            alt={form.coverImage?.alt || form.title?.en || ""}
            onChange={(url) => setField("coverImage", { url, alt: form.coverImage?.alt || form.title?.en || "" })}
          />
        </div>
        <div className="admin-field admin-field-full">
          <MediaPicker
            label="Cover image picker"
            folderType="articles"
            value={form.coverImage?.url || ""}
            helper="Upload or reuse an editorial image for this article cover."
            onSelect={(asset) => setField("coverImage", { url: asset.url, alt: asset.alt || form.title?.en || "" })}
          />
        </div>
        <div className="admin-field">
          <span className="admin-label">Current cover</span>
          <MediaPreview asset={form.coverImage} label="Article cover image" />
        </div>
        <label className="admin-field">
          <span className="admin-label">Cover image URL</span>
          <input
            className="admin-input"
            value={form.coverImage?.url || ""}
            onChange={(e) => setField("coverImage", { url: e.target.value, alt: form.coverImage?.alt || form.title?.en || "" })}
          />
        </label>
        <label className="admin-field">
          <span className="admin-label">Cover image alt text</span>
          <input
            className="admin-input"
            value={form.coverImage?.alt || ""}
            onChange={(e) => setField("coverImage", { url: form.coverImage?.url || "", alt: e.target.value })}
          />
        </label>
        </div>
      </FormSection>

      <FormSection title="Editorial settings" description="Classify the content so readers can filter and understand the level before opening it.">
        <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Category</span>
          <select className="admin-input" value={form.category || ""} onChange={(e) => setField("category", e.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Content type</span>
          <select className="admin-input" value={form.contentType || "article"} onChange={(e) => setField("contentType", e.target.value as BlogArticle["contentType"])}>
            <option value="article">Article</option>
            <option value="guide">Guide</option>
            <option value="ebook">Ebook</option>
            <option value="research">Research</option>
            <option value="case-study">Case Study</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Difficulty</span>
          <select className="admin-input" value={form.difficulty || "beginner"} onChange={(e) => setField("difficulty", e.target.value as BlogArticle["difficulty"])}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Estimated reading minutes</span>
          <input className="admin-input" type="number" min="1" value={form.estimatedReadingMinutes || 5} onChange={(e) => setField("estimatedReadingMinutes", Number(e.target.value))} />
        </label>
        <label className="admin-field admin-field-full">
          <span className="admin-label">Tags, one per line</span>
          <textarea className="admin-textarea" value={(form.tags || []).join("\n")} onChange={(e) => setField("tags", splitLines(e.target.value))} />
        </label>
        </div>
      </FormSection>

      <FormSection title="Content" description="Write markdown or plain text. Keep the educational tone calm, precise, and Stripe-safe.">
      <label className="admin-field">
        <span className="admin-label">Markdown content</span>
        <textarea className="admin-textarea admin-textarea-content font-mono" value={form.content?.en || ""} onChange={(e) => setLocalized("content", e.target.value)} required />
      </label>
      </FormSection>

      <FormSection title="SEO" description="Search and social metadata for this article.">
        <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">SEO title</span>
          <input className="admin-input" value={form.seoTitle || ""} onChange={(e) => setField("seoTitle", e.target.value)} />
        </label>
        <label className="admin-field admin-field-full">
          <span className="admin-label">SEO description</span>
          <textarea className="admin-textarea admin-textarea-seo" value={form.seoDescription || ""} onChange={(e) => setField("seoDescription", e.target.value)} />
        </label>
        </div>
      </FormSection>

      <FormSection title="Relations / Publishing" description="Connect this article to other resources, then choose whether it should be public.">
        <div className="admin-field-grid">
        <label className="admin-field">
          <span className="admin-label">Related articles</span>
          <select
            className="admin-input min-h-[160px]"
            multiple
            value={splitLines(relatedArticles)}
            onChange={(event) => setRelatedArticles(Array.from(event.target.selectedOptions).map((option) => option.value).join("\n"))}
          >
            {articleOptions
              .filter((option) => option._id !== article?._id)
              .map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title.en}
                </option>
              ))}
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Related products</span>
          <select
            className="admin-input min-h-[160px]"
            multiple
            value={splitLines(relatedProducts)}
            onChange={(event) => setRelatedProducts(Array.from(event.target.selectedOptions).map((option) => option.value).join("\n"))}
          >
            {productOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.title.en}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span className="admin-label">Publishing status</span>
          <select
            className="admin-input"
            value={form.publicationStatus || (form.isPublished ? "published" : "draft")}
            onChange={(e) => setField("publicationStatus", e.target.value as BlogArticle["publicationStatus"])}
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
        <button className="admin-primary" type="submit">Save article</button>
      </div>
    </form>
  );
}
