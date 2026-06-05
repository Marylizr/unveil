import type { Language } from "@/translations";

export type LocalizedText = Record<Language, string>;

export type ProductType = "physical" | "digital" | "service";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";
export type PublishingStatus = "draft" | "scheduled" | "published" | "archived";
export type BlogContentType = "article" | "guide" | "ebook" | "research" | "case-study";
export type BlogDifficulty = "beginner" | "intermediate" | "advanced";

export interface ProductImage {
  url: string;
  alt: string;
  position?: number;
}

export interface Product {
  _id: string;
  title: LocalizedText;
  slug: string;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;
  category: string;
  subcategory?: string;
  productType: ProductType;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  stockStatus: StockStatus;
  sku: string;
  tags: string[];
  benefits: string[];
  chapters?: string[];
  includedSections?: string[];
  howToUse: string[];
  materials: string[];
  careInstructions: string[];
  safetyNotes: string[];
  isFeatured: boolean;
  isPublished: boolean;
  publicationStatus?: PublishingStatus;
  scheduledAt?: string;
  publishedAt?: string;
  digitalAssetUrl?: string;
  isProtectedAsset?: boolean;
  downloadUrl?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  paymentProvider?: "none" | "stripe";
  checkoutMode?: "payment" | "subscription";
  fulfillmentType?: "in_house" | "dropship" | "digital";
  shippingRegion?: string[];
  estimatedDeliveryDays?: { min?: number; max?: number };
  createdAt?: string;
  updatedAt?: string;
  name?: LocalizedText;
  description?: LocalizedText;
  imageUrl?: string;
  tag?: string;
  inStock?: boolean;
}

export interface BlogArticle {
  _id: string;
  title: LocalizedText;
  slug: string;
  excerpt: LocalizedText;
  content: LocalizedText;
  category: string;
  tags: string[];
  coverImage?: { url: string; alt: string };
  author: { name: string; role?: string };
  readingTime?: number;
  estimatedReadingMinutes: number;
  contentType: BlogContentType;
  difficulty: BlogDifficulty;
  relatedArticles: BlogArticle[];
  relatedProducts: Product[];
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  publicationStatus?: PublishingStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  readTime?: number;
}

export interface LeadMagnet {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: { url: string; alt: string };
  pdfUrl?: string;
  category: string;
  isPublished: boolean;
  publicationStatus?: PublishingStatus;
  scheduledAt?: string;
  publishedAt?: string;
}

export interface LeadPayload {
  email: string;
  firstName?: string;
  country?: string;
  interests?: string[];
  source?: string;
  requestedLeadMagnetSlug?: string;
  language?: Language;
  consent: boolean;
  consentText?: string;
  consentVersion?: string;
  privacyPolicyUrl?: string;
}

export type Post = BlogArticle;
