import mongoose, { Schema, Document } from "mongoose";

const CoverImageSchema = new Schema(
  {
    url: { type: String, trim: true, default: "" },
    alt: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

export interface ILeadMagnet extends Document {
  title: string;
  slug: string;
  description: string;
  coverImage?: { url: string; alt: string };
  pdfUrl: string;
  category: string;
  isPublished: boolean;
  publicationStatus: "draft" | "scheduled" | "published" | "archived";
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadMagnetSchema = new Schema<ILeadMagnet>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    coverImage: { type: CoverImageSchema, default: undefined },
    pdfUrl: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publicationStatus: {
      type: String,
      enum: ["draft", "scheduled", "published", "archived"],
      default: "draft",
      index: true,
    },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

LeadMagnetSchema.index({ category: 1, isPublished: 1, createdAt: -1 });
LeadMagnetSchema.index({ publicationStatus: 1, scheduledAt: 1, publishedAt: -1 });

export default mongoose.models.LeadMagnet ||
  mongoose.model<ILeadMagnet>("LeadMagnet", LeadMagnetSchema);
