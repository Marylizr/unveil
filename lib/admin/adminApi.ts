"use client";

import type { AdminEntitlement, AdminOrder, AdminStats, Lead } from "@/types/admin";
import type { BlogArticle, LeadMagnet, Product } from "@/types/content";
import type { PrivateDigitalAsset } from "@/types/digitalAsset";
import type { MediaAsset } from "@/types/media";

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/admin/api${path}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) throw new Error(`Admin request failed: ${response.status}`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const adminApi = {
  admin: {
    stats: () => adminRequest<AdminStats>("/admin/stats"),
  },
  media: {
    list: () => adminRequest<MediaAsset[]>("/media"),
    upload: async (file: File, alt?: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt || "");

      const response = await fetch("/admin/api/media", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) throw new Error(`Media upload failed: ${response.status}`);
      return response.json() as Promise<MediaAsset>;
    },
  },
  digitalAssets: {
    list: () => adminRequest<PrivateDigitalAsset[]>("/digital-assets"),
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/admin/api/digital-assets", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) throw new Error(`Digital asset upload failed: ${response.status}`);
      return response.json() as Promise<PrivateDigitalAsset>;
    },
  },
  products: {
    list: (_token?: string) => adminRequest<Product[]>("/products/admin/all"),
    get: (_token: string | undefined, id: string) => adminRequest<Product>(`/products/admin/${id}`),
    create: (_token: string | undefined, payload: Record<string, unknown>) =>
      adminRequest<Product>("/products", { method: "POST", body: JSON.stringify(payload) }),
    update: (_token: string | undefined, id: string, payload: Record<string, unknown>) =>
      adminRequest<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (_token: string | undefined, id: string) => adminRequest<void>(`/products/${id}`, { method: "DELETE" }),
    publish: (_token: string | undefined, id: string, isPublished: boolean) =>
      adminRequest<Product>(`/products/${id}/publish`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished }),
      }),
    feature: (_token: string | undefined, id: string, isFeatured: boolean) =>
      adminRequest<Product>(`/products/${id}/feature`, {
        method: "PATCH",
        body: JSON.stringify({ isFeatured }),
      }),
  },
  blog: {
    list: (_token?: string) => adminRequest<BlogArticle[]>("/blog/admin/all"),
    get: (_token: string | undefined, id: string) => adminRequest<BlogArticle>(`/blog/admin/${id}`),
    create: (_token: string | undefined, payload: Record<string, unknown>) =>
      adminRequest<BlogArticle>("/blog", { method: "POST", body: JSON.stringify(payload) }),
    update: (_token: string | undefined, id: string, payload: Record<string, unknown>) =>
      adminRequest<BlogArticle>(`/blog/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (_token: string | undefined, id: string) => adminRequest<void>(`/blog/${id}`, { method: "DELETE" }),
    publish: (_token: string | undefined, id: string, isPublished: boolean) =>
      adminRequest<BlogArticle>(`/blog/${id}/publish`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished }),
      }),
  },
  leadMagnets: {
    list: (_token?: string) => adminRequest<LeadMagnet[]>("/lead-magnets/admin/all"),
    get: (_token: string | undefined, id: string) => adminRequest<LeadMagnet>(`/lead-magnets/admin/${id}`),
    create: (_token: string | undefined, payload: Record<string, unknown>) =>
      adminRequest<LeadMagnet>("/lead-magnets", { method: "POST", body: JSON.stringify(payload) }),
    update: (_token: string | undefined, id: string, payload: Record<string, unknown>) =>
      adminRequest<LeadMagnet>(`/lead-magnets/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (_token: string | undefined, id: string) => adminRequest<void>(`/lead-magnets/${id}`, { method: "DELETE" }),
    publish: (_token: string | undefined, id: string, isPublished: boolean) =>
      adminRequest<LeadMagnet>(`/lead-magnets/${id}/publish`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished }),
      }),
  },
  leads: {
    list: (_token?: string) => adminRequest<Lead[]>("/leads"),
  },
  orders: {
    list: (status = "all") => adminRequest<AdminOrder[]>(`/orders?status=${encodeURIComponent(status)}`),
    get: (id: string) => adminRequest<AdminOrder>(`/orders/${id}`),
  },
  entitlements: {
    list: (params?: { status?: string; customerEmail?: string; productId?: string }) => {
      const search = new URLSearchParams();
      if (params?.status) search.set("status", params.status);
      if (params?.customerEmail) search.set("customerEmail", params.customerEmail);
      if (params?.productId) search.set("productId", params.productId);
      return adminRequest<AdminEntitlement[]>(`/entitlements${search.size ? `?${search}` : ""}`);
    },
    revoke: (id: string) => adminRequest<AdminEntitlement>(`/entitlements/${id}/revoke`, { method: "PATCH" }),
  },
};
