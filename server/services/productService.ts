import Product, { PRODUCT_CATEGORY_VALUES } from "../../models/Product";
import { serializeAdminProduct, serializeProduct } from "../serializers/productSerializer";
import { categoryFromSlug } from "./categoryService";
import { normalizePublishingFields, publicPublishedQuery } from "./publishingWorkflow";

export async function listProducts() {
  const products = await Product.find(publicPublishedQuery()).sort({ isFeatured: -1, createdAt: -1 });
  return products.map(serializeProduct);
}

export async function listAdminProducts() {
  const products = await Product.find()
    .select("+supplierName +supplierSku +supplierCost +digitalAssetUrl +isProtectedAsset +downloadUrl +stripeProductId +stripePriceId +paymentProvider +checkoutMode")
    .sort({ createdAt: -1 });
  return products.map(serializeAdminProduct);
}

export async function getAdminProductById(id: string) {
  const product = await Product.findById(id).select(
    "+supplierName +supplierSku +supplierCost +digitalAssetUrl +isProtectedAsset +downloadUrl +stripeProductId +stripePriceId +paymentProvider +checkoutMode"
  );
  return product ? serializeAdminProduct(product) : null;
}

export async function getProductBySlug(slug: string) {
  const product = await Product.findOne({ slug, ...publicPublishedQuery() });
  return product ? serializeProduct(product) : null;
}

export async function listProductsByCategory(categorySlug: string) {
  const category = categoryFromSlug(categorySlug, PRODUCT_CATEGORY_VALUES);
  if (!category) return [];

  const products = await Product.find({ category, ...publicPublishedQuery() }).sort({ isFeatured: -1, createdAt: -1 });
  return products.map(serializeProduct);
}

export async function createProduct(input: Record<string, unknown>) {
  const product = await Product.create(normalizePublishingFields(input));
  return serializeAdminProduct(product);
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  const product = await Product.findByIdAndUpdate(id, normalizePublishingFields(input), { new: true, runValidators: true }).select(
    "+supplierName +supplierSku +supplierCost +digitalAssetUrl +isProtectedAsset +downloadUrl +stripeProductId +stripePriceId +paymentProvider +checkoutMode"
  );
  return product ? serializeAdminProduct(product) : null;
}

export async function deleteProduct(id: string) {
  return Product.findByIdAndDelete(id);
}

export async function setProductPublished(id: string, isPublished: boolean) {
  return updateProduct(id, { publicationStatus: isPublished ? "published" : "draft" });
}

export async function setProductFeatured(id: string, isFeatured: boolean) {
  return updateProduct(id, { isFeatured });
}
