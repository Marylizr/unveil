import mongoose, { Schema, Document } from "mongoose";

const PRODUCT_CATEGORIES = [
  "Intimate Hygiene",
  "Lubricants & Comfort",
  "Male Pleasure Education",
  "Pelvic Floor & Control",
  "Prostate Wellness",
  "Grooming & Self-Care",
  "Digital Guides",
  "Male Optimization",
] as const;

const LocalizedTextSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    pt: { type: String, trim: true, default: "" },
    es: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    position: { type: Number, default: 0 },
  },
  { _id: false }
);

const DeliveryDaysSchema = new Schema(
  {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
  },
  { _id: false }
);

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductType = "physical" | "digital" | "service";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";
export type FulfillmentType = "in_house" | "dropship" | "digital";
export type PaymentProvider = "none" | "stripe";
export type CheckoutMode = "payment" | "subscription";
export type PublishingStatus = "draft" | "scheduled" | "published" | "archived";

export interface IProduct extends Document {
  title: { en: string; pt: string; es: string };
  slug: string;
  shortDescription: { en: string; pt: string; es: string };
  fullDescription: { en: string; pt: string; es: string };
  category: ProductCategory;
  subcategory?: string;
  productType: ProductType;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: Array<{ url: string; alt: string; position?: number }>;
  stockStatus: StockStatus;
  sku: string;
  tags: string[];
  benefits: string[];
  chapters: string[];
  includedSections: string[];
  howToUse: string[];
  materials: string[];
  careInstructions: string[];
  safetyNotes: string[];
  isFeatured: boolean;
  isPublished: boolean;
  publicationStatus: PublishingStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  digitalAssetUrl?: string;
  isProtectedAsset: boolean;
  downloadUrl?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  paymentProvider: PaymentProvider;
  checkoutMode: CheckoutMode;
  supplierName?: string;
  supplierSku?: string;
  supplierCost?: number;
  fulfillmentType?: FulfillmentType;
  shippingRegion: string[];
  estimatedDeliveryDays?: { min?: number; max?: number };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: LocalizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    shortDescription: { type: LocalizedTextSchema, required: true },
    fullDescription: { type: LocalizedTextSchema, required: true },
    category: { type: String, required: true, enum: PRODUCT_CATEGORIES, index: true },
    subcategory: { type: String, trim: true },
    productType: { type: String, enum: ["physical", "digital", "service"], default: "physical", index: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: "EUR", uppercase: true, trim: true },
    images: { type: [ProductImageSchema], default: [] },
    stockStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock", "preorder"],
      default: "in_stock",
    },
    sku: { type: String, required: true, unique: true, trim: true },
    tags: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    chapters: { type: [String], default: [] },
    includedSections: { type: [String], default: [] },
    howToUse: { type: [String], default: [] },
    materials: { type: [String], default: [] },
    careInstructions: { type: [String], default: [] },
    safetyNotes: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publicationStatus: {
      type: String,
      enum: ["draft", "scheduled", "published", "archived"],
      default: "draft",
      index: true,
    },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    digitalAssetUrl: { type: String, trim: true, select: false },
    isProtectedAsset: { type: Boolean, default: false, select: false },
    downloadUrl: { type: String, trim: true, select: false },
    stripeProductId: { type: String, trim: true, select: false },
    stripePriceId: { type: String, trim: true, select: false },
    paymentProvider: { type: String, enum: ["none", "stripe"], default: "none", select: false },
    checkoutMode: { type: String, enum: ["payment", "subscription"], default: "payment", select: false },
    supplierName: { type: String, trim: true, select: false },
    supplierSku: { type: String, trim: true, select: false },
    supplierCost: { type: Number, min: 0, select: false },
    fulfillmentType: { type: String, enum: ["in_house", "dropship", "digital"] },
    shippingRegion: { type: [String], default: [] },
    estimatedDeliveryDays: DeliveryDaysSchema,
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, isPublished: 1, createdAt: -1 });
ProductSchema.index({ isFeatured: 1, isPublished: 1, createdAt: -1 });
ProductSchema.index({ publicationStatus: 1, scheduledAt: 1, publishedAt: -1 });

export const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES;

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
