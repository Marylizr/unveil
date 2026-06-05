import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/server/db";
import { fulfillPaidOrder } from "@/lib/server/fulfillment";
import { getStripe } from "@/lib/server/stripe";
import { getAppUrl, sendEmail } from "@/server/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function deliveryEmailHtml(items: Array<{ title: string; url: string }>) {
  const list = items
    .map((item) => `<li style="margin-bottom: 12px;"><a href="${item.url}" style="color: #4d5c2a;">${item.title}</a></li>`)
    .join("");

  return `
    <div style="font-family: Georgia, serif; color: #1a2010; line-height: 1.6;">
      <h1 style="font-weight: 400;">Your UNVEIL guide is ready</h1>
      <p>Thank you for your purchase. Your protected download link is below.</p>
      <ul>${list}</ul>
      <p style="font-size: 13px; color: #4d5c2a;">These links are private. Please keep them for your own use.</p>
    </div>
  `;
}

function deliveryEmailText(items: Array<{ title: string; url: string }>) {
  return [
    "Your UNVEIL guide is ready.",
    "",
    ...items.map((item) => `${item.title}: ${item.url}`),
    "",
    "These links are private. Please keep them for your own use.",
  ].join("\n");
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  await connectToDatabase();

  const orderId = typeof session.metadata?.orderId === "string" ? session.metadata.orderId : "";
  const order = await Order.findOne({
    $or: [
      { stripeCheckoutSessionId: session.id },
      ...(orderId ? [{ _id: orderId }] : []),
    ],
  }).select("+stripeCheckoutSessionId +stripePaymentIntentId +checkoutUrl");

  if (!order) throw new Error(`Order not found for Stripe session ${session.id}`);

  const metadata = (order.metadata || {}) as Record<string, unknown>;
  if (metadata.deliveryEmailSentAt) return;

  if (order.status !== "paid") {
    order.status = "paid";
    order.paidAt = new Date();
    order.stripePaymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    await order.save();
  }

  const delivery = await fulfillPaidOrder(String(order._id));
  if (!delivery.deliveryItems.length) return;

  const appUrl = getAppUrl();
  const items = delivery.deliveryItems.map((item) => ({
    title: item.title,
    url: `${appUrl}/api/digital-assets/${encodeURIComponent(item.productId)}?token=${encodeURIComponent(item.downloadToken)}`,
  }));

  await sendEmail({
    to: delivery.customerEmail,
    subject: "Your UNVEIL digital guide is ready",
    html: deliveryEmailHtml(items),
    text: deliveryEmailText(items),
  });

  order.metadata = {
    ...metadata,
    deliveryEmailSentAt: new Date().toISOString(),
  };
  order.markModified("metadata");
  await order.save();
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }
  } catch (error) {
    console.error("[stripe-webhook] fulfillment failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
