import mongoose, { Schema, Document, Types } from "mongoose";

const BLOG_CATEGORIES = [
  "Male Hygiene",
  "Sexual Health",
  "Emotional Intelligence",
  "Dating & Communication",
  "Hormones & Performance",
  "Intimacy Education",
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

const CoverImageSchema = new Schema(
  {
    url: { type: String, trim: true, default: "" },
    alt: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogContentType = "article" | "guide" | "ebook" | "research" | "case-study";
export type BlogDifficulty = "beginner" | "intermediate" | "advanced";
export type PublishingStatus = "draft" | "scheduled" | "published" | "archived";

export interface IBlogArticle extends Document {
  title: { en: string; pt: string; es: string };
  slug: string;
  excerpt: { en: string; pt: string; es: string };
  content: { en: string; pt: string; es: string };
  category: BlogCategory;
  tags: string[];
  coverImage?: { url: string; alt: string };
  author: { name: string; role?: string };
  readingTime: number;
  estimatedReadingMinutes: number;
  contentType: BlogContentType;
  difficulty: BlogDifficulty;
  relatedArticles: Types.ObjectId[];
  relatedProducts: Types.ObjectId[];
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  publicationStatus: PublishingStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogArticleSchema = new Schema<IBlogArticle>(
  {
    title: { type: LocalizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    excerpt: { type: LocalizedTextSchema, required: true },
    content: { type: LocalizedTextSchema, required: true },
    category: { type: String, required: true, enum: BLOG_CATEGORIES, index: true },
    tags: { type: [String], default: [] },
    coverImage: { type: CoverImageSchema, default: undefined },
    author: { type: AuthorSchema, required: true },
    readingTime: { type: Number, min: 1, default: 5 },
    estimatedReadingMinutes: { type: Number, min: 1, default: 5 },
    contentType: {
      type: String,
      enum: ["article", "guide", "ebook", "research", "case-study"],
      default: "article",
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      index: true,
    },
    relatedArticles: [{ type: Schema.Types.ObjectId, ref: "BlogArticle" }],
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
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

BlogArticleSchema.index({ category: 1, isPublished: 1, publishedAt: -1 });
BlogArticleSchema.index({ tags: 1, isPublished: 1 });
BlogArticleSchema.index({ publicationStatus: 1, scheduledAt: 1, publishedAt: -1 });

export const BLOG_CATEGORY_VALUES = BLOG_CATEGORIES;

export default mongoose.models.BlogArticle ||
  mongoose.model<IBlogArticle>("BlogArticle", BlogArticleSchema);
