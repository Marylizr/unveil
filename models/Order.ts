import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "canceled";
export type OrderPaymentProvider = "stripe" | "manual" | "test";

export interface IOrderLineItem {
  productId: Types.ObjectId;
  title: string;
  quantity: number;
  unitAmount: number;
  currency: string;
}

export interface IOrder extends Document {
  customerEmail: string;
  customerName?: string;
  userEmail?: string;
  productIds: Types.ObjectId[];
  lineItems: IOrderLineItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentProvider: OrderPaymentProvider;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  checkoutUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  paidAt?: Date;
  refundedAt?: Date;
  updatedAt: Date;
}

const OrderLineItemSchema = new Schema<IOrderLineItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: "EUR" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerName: { type: String, trim: true },
    userEmail: { type: String, lowercase: true, trim: true, index: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
    lineItems: { type: [OrderLineItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: "EUR" },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded", "canceled"], default: "pending", index: true },
    paymentProvider: { type: String, enum: ["stripe", "manual", "test"], default: "stripe", index: true },
    stripeCheckoutSessionId: { type: String, trim: true, index: true, select: false },
    stripePaymentIntentId: { type: String, trim: true, index: true, select: false },
    checkoutUrl: { type: String, trim: true, select: false },
    metadata: { type: Schema.Types.Mixed },
    paidAt: { type: Date },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentProvider: 1, status: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
