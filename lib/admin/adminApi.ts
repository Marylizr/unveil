"use client";

import type { AdminEntitlement, AdminOrder, AdminStats, Lead } from "@/types/admin";
import type { BlogArticle, LeadMagnet, Product } from "@/types/content";
import type { PrivateDigitalAsset } from "@/types/digitalAsset";
import type { CloudinaryFolderType, CloudinaryUploadAsset, MediaAsset } from "@/types/media";

type CloudinarySignedUpload = {
  success: true;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  resourceType: "raw";
  type: "upload";
  accessMode: "public";
  overwrite: true;
  invalidate: true;
};

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

  if (!response.ok) {
    const fallback = `Admin request failed: ${response.status}`;
    try {
      const error = (await response.json()) as { error?: string; details?: string; errors?: string[] };
      throw new Error(error.details || error.error || error.errors?.join("; ") || fallback);
    } catch (error) {
      if (error instanceof Error && error.message !== fallback) throw error;
      throw new Error(fallback);
    }
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const adminApi = {
  admin: {
    stats: () => adminRequest<AdminStats>("/admin/stats"),
  },
  media: {
    list: () => adminRequest<MediaAsset[]>("/media"),
    signUpload: (payload: { slug: string; folder: "unveil/lead-magnets/pdfs"; resourceType: "raw"; publicId: string }) =>
      adminRequest<CloudinarySignedUpload>("/media/sign-upload", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    upload: async (file: File, alt?: string, folderType: CloudinaryFolderType = "brand", publicId?: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt || "");
      formData.append("folderType", folderType);
      if (publicId) formData.append("publicId", publicId);

      const response = await fetch("/admin/api/media/upload", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const fallback = `Media upload failed: ${response.status}`;
        try {
          const error = (await response.json()) as { error?: string; details?: string };
          throw new Error(error.details || error.error || fallback);
        } catch (error) {
          if (error instanceof Error && error.message !== fallback) throw error;
          throw new Error(fallback);
        }
      }
      const result = (await response.json()) as { asset: CloudinaryUploadAsset };
      const asset = result.asset;
      return {
        id: asset.publicId,
        url: asset.optimizedUrl || asset.secureUrl,
        secureUrl: asset.secureUrl,
        optimizedUrl: asset.optimizedUrl,
        thumbnailUrl: asset.thumbnailUrl,
        publicId: asset.publicId,
        filename: asset.publicId.split("/").pop() || asset.publicId,
        originalName: file.name,
        alt: asset.alt,
        contentType: file.type,
        size: asset.bytes,
        createdAt: asset.createdAt,
        width: asset.width,
        height: asset.height,
        format: asset.format,
        bytes: asset.bytes,
        resourceType: asset.resourceType,
        folderType: asset.folderType,
      } satisfies MediaAsset;
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

      if (!response.ok) {
        const fallback = `Digital asset upload failed: ${response.status}`;
        try {
          const error = (await response.json()) as { error?: string; details?: string };
          throw new Error(error.details || error.error || fallback);
        } catch (error) {
          if (error instanceof Error && error.message !== fallback) throw error;
          throw new Error(fallback);
        }
      }
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
