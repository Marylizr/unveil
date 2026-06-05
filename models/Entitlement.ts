import mongoose, { Schema, Document, Types } from "mongoose";

export type EntitlementAccessType = "download" | "course" | "membership";
export type EntitlementStatus = "active" | "revoked" | "expired";

export interface IEntitlement extends Document {
  email?: string;
  customerEmail: string;
  userEmail?: string;
  userId?: Types.ObjectId;
  productId: Types.ObjectId;
  orderId?: Types.ObjectId;
  accessType: EntitlementAccessType;
  status: EntitlementStatus;
  downloadTokenHash?: string;
  tokenCreatedAt?: Date;
  expiresAt?: Date;
  downloadCount: number;
  lastDownloadedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EntitlementSchema = new Schema<IEntitlement>(
  {
    email: { type: String, lowercase: true, trim: true, index: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    userEmail: { type: String, lowercase: true, trim: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    accessType: { type: String, enum: ["download", "course", "membership"], default: "download", index: true },
    status: { type: String, enum: ["active", "revoked", "expired"], default: "active", index: true },
    downloadTokenHash: { type: String, index: true, select: false },
    tokenCreatedAt: { type: Date },
    expiresAt: { type: Date, index: true },
    downloadCount: { type: Number, default: 0, min: 0 },
    lastDownloadedAt: { type: Date },
  },
  { timestamps: true }
);

EntitlementSchema.index({ email: 1, productId: 1 });
EntitlementSchema.index({ customerEmail: 1, productId: 1 });
EntitlementSchema.index({ userEmail: 1, productId: 1 });
EntitlementSchema.index({ userId: 1, productId: 1 });
EntitlementSchema.index({ productId: 1, status: 1, downloadTokenHash: 1 });

export default mongoose.models.Entitlement ||
  mongoose.model<IEntitlement>("Entitlement", EntitlementSchema);
