import type { IProduct } from "../../models/Product";
import { toPlainSerializedValue } from "./plain";

export function serializeProduct(product: IProduct) {
  const data = product.toObject ? product.toObject() : product;
  const {
    digitalAssetUrl,
    isProtectedAsset,
    downloadUrl,
    stripeProductId,
    stripePriceId,
    paymentProvider,
    checkoutMode,
    supplierName,
    supplierSku,
    supplierCost,
    ...publicProduct
  } = data as Record<string, unknown>;

  return toPlainSerializedValue({
    ...publicProduct,
    name: publicProduct.title,
    description: publicProduct.shortDescription,
    imageUrl:
      Array.isArray(publicProduct.images) && publicProduct.images[0]
        ? (publicProduct.images[0] as { url?: string }).url || ""
        : "",
    tag: Array.isArray(publicProduct.tags) ? publicProduct.tags[0] || "" : "",
    inStock: publicProduct.stockStatus !== "out_of_stock",
  });
}

export function serializeAdminProduct(product: IProduct) {
  return toPlainSerializedValue(product.toObject ? product.toObject() : product);
}
