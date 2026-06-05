import type { BlogArticle, LeadMagnet, LeadPayload, Product } from "@/types/content";
import {
  fallbackBlogArticles,
  fallbackLeadMagnets,
  fallbackProducts,
  getFallbackBlogArticle,
  getFallbackLeadMagnet,
  getFallbackProduct,
} from "@/lib/fallbackContent";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProducts() {
  return request<Product[]>("/api/products").catch(() => fallbackProducts);
}

export async function getProductBySlug(slug: string) {
  try {
    return await request<Product>(`/api/products/${encodeURIComponent(slug)}`);
  } catch (error) {
    const fallback = getFallbackProduct(slug);
    if (fallback) return fallback;
    throw error;
  }
}

export function getBlogArticles() {
  return request<BlogArticle[]>("/api/blog").catch(() => fallbackBlogArticles);
}

export async function getBlogArticleBySlug(slug: string) {
  try {
    return await request<BlogArticle>(`/api/blog/${encodeURIComponent(slug)}`);
  } catch (error) {
    const fallback = getFallbackBlogArticle(slug);
    if (fallback) return fallback;
    throw error;
  }
}

export function getLeadMagnets() {
  return request<LeadMagnet[]>("/api/lead-magnets").catch(() => fallbackLeadMagnets);
}

export async function getLeadMagnetBySlug(slug: string) {
  try {
    return await request<LeadMagnet>(`/api/lead-magnets/${encodeURIComponent(slug)}`);
  } catch (error) {
    const fallback = getFallbackLeadMagnet(slug);
    if (fallback) return fallback;
    throw error;
  }
}

export function getLeadMagnetDownload(slug: string, token: string) {
  return request<{ pdfUrl: string }>(
    `/api/lead-magnets/${encodeURIComponent(slug)}/download?token=${encodeURIComponent(token)}`
  );
}

export function createLead(payload: LeadPayload) {
  return fetch(`${API_BASE_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok || response.status === 409) return response.json() as Promise<{ message: string; status?: string }>;
    throw new Error(`Request failed: ${response.status}`);
  });
}

export function confirmLeadEmail(token: string) {
  return request<{ message: string; status: string }>(`/api/leads/confirm?token=${encodeURIComponent(token)}`);
}

export function unsubscribeLead(token: string) {
  return request<{ message: string; status: string }>("/api/leads/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
