import Order from "@/models/Order";
import Product from "@/models/Product";
import Entitlement from "@/models/Entitlement";
import { createEntitlementDownloadToken } from "@/lib/server/digitalAssets";

export type FulfillmentDeliveryItem = {
  productId: string;
  title: string;
  accessType: "download";
  downloadToken: string;
};

export async function fulfillPaidOrder(orderId: string) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "paid") throw new Error("Order must be paid before fulfillment");

  const products = await Product.find({ _id: { $in: order.productIds } }).select("+isProtectedAsset +digitalAssetUrl");
  const deliveryItems: FulfillmentDeliveryItem[] = [];

  for (const product of products) {
    if (product.productType !== "digital" || !product.isProtectedAsset) continue;

    const existing = await Entitlement.findOne({
      orderId: order._id,
      productId: product._id,
      customerEmail: order.customerEmail,
      status: "active",
    }).select("+downloadTokenHash");
    if (existing) continue;

    const { downloadToken } = await createEntitlementDownloadToken({
      productId: product._id,
      orderId: order._id,
      userEmail: order.customerEmail,
      accessType: "download",
    });

    deliveryItems.push({
      productId: String(product._id),
      title: product.title?.en || "UNVEIL digital product",
      accessType: "download",
      downloadToken,
    });
  }

  return {
    orderId: String(order._id),
    customerEmail: order.customerEmail,
    deliveryItems,
  };
}
