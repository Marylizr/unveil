import { PRODUCT_CATEGORY_VALUES } from "../../models/Product";
import {
  booleanValue,
  enumValue,
  localizedText,
  numberValue,
  optionalString,
  sanitizeString,
  slugify,
  stringArray,
  type ValidationResult,
} from "./shared";

const PRODUCT_TYPES = ["physical", "digital", "service"] as const;
const STOCK_STATUSES = ["in_stock", "low_stock", "out_of_stock", "preorder"] as const;
const FULFILLMENT_TYPES = ["in_house", "dropship", "digital"] as const;
const PAYMENT_PROVIDERS = ["none", "stripe"] as const;
const CHECKOUT_MODES = ["payment", "subscription"] as const;
const PUBLISHING_STATUSES = ["draft", "scheduled", "published", "archived"] as const;

export interface ProductInput {
  title: { en: string; pt: string; es: string };
  slug: string;
  shortDescription: { en: string; pt: string; es: string };
  fullDescription: { en: string; pt: string; es: string };
  category: string;
  subcategory?: string;
  productType: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: Array<{ url: string; alt: string; position?: number }>;
  stockStatus: string;
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
  publicationStatus?: string;
  scheduledAt?: Date;
  publishedAt?: Date;
  digitalAssetUrl?: string;
  isProtectedAsset?: boolean;
  downloadUrl?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  paymentProvider?: string;
  checkoutMode?: string;
  supplierName?: string;
  supplierSku?: string;
  supplierCost?: number;
  fulfillmentType?: string;
  shippingRegion: string[];
  estimatedDeliveryDays?: { min?: number; max?: number };
}

export function validateProductInput(body: unknown, partial = false): ValidationResult<Partial<ProductInput>> {
  const source = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const errors: string[] = [];
  const title = source.title !== undefined || !partial ? localizedText(source.title, "title", errors) : undefined;
  const fallbackSlug = title?.en ? slugify(title.en) : "";
  const slug = sanitizeString(source.slug) || fallbackSlug;
  const price = numberValue(source.price, "price", errors, !partial);
  const compareAtPrice = numberValue(source.compareAtPrice, "compareAtPrice", errors);
  const supplierCost = numberValue(source.supplierCost, "supplierCost", errors);
  const sku = sanitizeString(source.sku);

  if (!partial && !slug) errors.push("slug is required");
  if (!partial && !sku) errors.push("sku is required");

  const images = Array.isArray(source.images)
    ? source.images.map((image, index) => {
        const item = typeof image === "object" && image !== null ? (image as Record<string, unknown>) : {};
        return {
          url: sanitizeString(item.url),
          alt: sanitizeString(item.alt),
          position: Number(item.position) || index,
        };
      }).filter((image) => image.url && image.alt)
    : [];

  const min = numberValue((source.estimatedDeliveryDays as Record<string, unknown> | undefined)?.min, "estimatedDeliveryDays.min", errors);
  const max = numberValue((source.estimatedDeliveryDays as Record<string, unknown> | undefined)?.max, "estimatedDeliveryDays.max", errors);

  const value: Partial<ProductInput> = {};

  if (title) value.title = title;
  if (slug) value.slug = slug;
  if (source.shortDescription !== undefined || !partial) value.shortDescription = localizedText(source.shortDescription, "shortDescription", errors);
  if (source.fullDescription !== undefined || !partial) value.fullDescription = localizedText(source.fullDescription, "fullDescription", errors);
  if (source.category !== undefined || !partial) value.category = enumValue(source.category, PRODUCT_CATEGORY_VALUES, "category", errors, PRODUCT_CATEGORY_VALUES[0]);
  if (source.subcategory !== undefined) value.subcategory = optionalString(source.subcategory);
  if (source.productType !== undefined || !partial) value.productType = enumValue(source.productType, PRODUCT_TYPES, "productType", errors, "physical");
  if (price !== undefined) value.price = price;
  if (compareAtPrice !== undefined) value.compareAtPrice = compareAtPrice;
  if (source.currency !== undefined || !partial) value.currency = sanitizeString(source.currency) || "EUR";
  if (source.images !== undefined || !partial) value.images = images;
  if (source.stockStatus !== undefined || !partial) value.stockStatus = enumValue(source.stockStatus, STOCK_STATUSES, "stockStatus", errors, "in_stock");
  if (sku) value.sku = sku;
  if (source.tags !== undefined || !partial) value.tags = stringArray(source.tags);
  if (source.benefits !== undefined || !partial) value.benefits = stringArray(source.benefits);
  if (source.chapters !== undefined) value.chapters = stringArray(source.chapters);
  if (source.includedSections !== undefined) value.includedSections = stringArray(source.includedSections);
  if (source.howToUse !== undefined || !partial) value.howToUse = stringArray(source.howToUse);
  if (source.materials !== undefined || !partial) value.materials = stringArray(source.materials);
  if (source.careInstructions !== undefined || !partial) value.careInstructions = stringArray(source.careInstructions);
  if (source.safetyNotes !== undefined || !partial) value.safetyNotes = stringArray(source.safetyNotes);
  if (source.isFeatured !== undefined) value.isFeatured = booleanValue(source.isFeatured);
  if (source.isPublished !== undefined) value.isPublished = booleanValue(source.isPublished);
  if (source.publicationStatus !== undefined) value.publicationStatus = enumValue(source.publicationStatus, PUBLISHING_STATUSES, "publicationStatus", errors, "draft");
  if (source.scheduledAt) value.scheduledAt = new Date(String(source.scheduledAt));
  if (source.publishedAt) value.publishedAt = new Date(String(source.publishedAt));
  if (source.digitalAssetUrl !== undefined) value.digitalAssetUrl = optionalString(source.digitalAssetUrl);
  if (source.isProtectedAsset !== undefined) value.isProtectedAsset = booleanValue(source.isProtectedAsset);
  if (
    value.isProtectedAsset &&
    typeof value.digitalAssetUrl === "string" &&
    /^\/?downloads\//i.test(value.digitalAssetUrl)
  ) {
    errors.push("protected digital assets must not point to public downloads");
  }
  if (source.downloadUrl !== undefined) value.downloadUrl = optionalString(source.downloadUrl);
  if (source.stripeProductId !== undefined) value.stripeProductId = optionalString(source.stripeProductId);
  if (source.stripePriceId !== undefined) value.stripePriceId = optionalString(source.stripePriceId);
  if (source.paymentProvider !== undefined) value.paymentProvider = enumValue(source.paymentProvider, PAYMENT_PROVIDERS, "paymentProvider", errors, "none");
  if (source.checkoutMode !== undefined) value.checkoutMode = enumValue(source.checkoutMode, CHECKOUT_MODES, "checkoutMode", errors, "payment");
  if (source.supplierName !== undefined) value.supplierName = optionalString(source.supplierName);
  if (source.supplierSku !== undefined) value.supplierSku = optionalString(source.supplierSku);
  if (supplierCost !== undefined) value.supplierCost = supplierCost;
  if (source.fulfillmentType) value.fulfillmentType = enumValue(source.fulfillmentType, FULFILLMENT_TYPES, "fulfillmentType", errors);
  if (source.shippingRegion !== undefined || !partial) value.shippingRegion = stringArray(source.shippingRegion);
  if (min !== undefined || max !== undefined) value.estimatedDeliveryDays = { min, max };

  Object.keys(value).forEach((key) => {
    if (value[key as keyof ProductInput] === undefined) delete value[key as keyof ProductInput];
  });

  return errors.length ? { ok: false, errors } : { ok: true, value };
}
