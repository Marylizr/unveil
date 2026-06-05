import { NextResponse, type NextRequest } from "next/server";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { connectToDatabase } from "@/lib/server/db";
import { getStripe } from "@/lib/server/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedSalesSlugs = new Set([
  "the-modern-man-code",
  "understanding-female-pleasure",
  "the-art-of-connection",
]);

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
}

function validEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Checkout is not configured yet" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const productSlug = typeof body.productSlug === "string" ? body.productSlug : "";
  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.toLowerCase().trim() : "";
  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";

  if (!allowedSalesSlugs.has(productSlug)) {
    return NextResponse.json({ error: "Product is not available for checkout" }, { status: 400 });
  }

  if (!validEmail(customerEmail)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  await connectToDatabase();

  const product = await Product.findOne({
    slug: productSlug,
    productType: "digital",
    isPublished: true,
  }).select("+stripeProductId +stripePriceId +paymentProvider +checkoutMode +digitalAssetUrl +isProtectedAsset");

  if (!product || !product.isProtectedAsset) {
    return NextResponse.json({ error: "Product is not available for checkout" }, { status: 404 });
  }

  const currency = product.currency || "EUR";
  const unitAmount = Math.round(Number(product.price) * 100);
  if (!Number.isFinite(unitAmount) || unitAmount < 0) {
    return NextResponse.json({ error: "Product price is invalid" }, { status: 500 });
  }

  const order = await Order.create({
    customerEmail,
    customerName,
    userEmail: customerEmail,
    productIds: [product._id],
    lineItems: [
      {
        productId: product._id,
        title: product.title.en,
        quantity: 1,
        unitAmount: product.price,
        currency,
      },
    ],
    totalAmount: product.price,
    currency,
    status: "pending",
    paymentProvider: "stripe",
    metadata: {
      productSlug,
      checkoutVersion: "2026-05-31",
    },
  });

  const siteUrl = getSiteUrl();
  const lineItem = product.stripePriceId
    ? { price: product.stripePriceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: unitAmount,
          product_data: {
            name: product.title.en,
            description: product.shortDescription.en,
            images: product.images?.[0]?.url?.startsWith("http") ? [product.images[0].url] : undefined,
            metadata: {
              productId: String(product._id),
              productSlug: product.slug,
            },
          },
        },
      };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: [lineItem],
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel?product=${encodeURIComponent(product.slug)}`,
    metadata: {
      orderId: String(order._id),
      productId: String(product._id),
      productSlug: product.slug,
    },
    payment_intent_data: {
      metadata: {
        orderId: String(order._id),
        productId: String(product._id),
        productSlug: product.slug,
      },
    },
  });

  order.stripeCheckoutSessionId = session.id;
  order.checkoutUrl = session.url || undefined;
  await order.save();

  return NextResponse.json({ checkoutUrl: session.url });
}
