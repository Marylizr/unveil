import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  email: string;
  firstName?: string;
  country?: string;
  interests: string[];
  source: string;
  requestedLeadMagnetSlug?: string;
  language: string;
  consent: boolean;
  consentedAt: Date;
  consentIp?: string;
  consentUserAgent?: string;
  consentText: string;
  consentVersion: string;
  privacyPolicyUrl: string;
  status: "pending" | "confirmed";
  emailConfirmedAt?: Date;
  confirmationTokenHash?: string;
  confirmationTokenExpiresAt?: Date;
  unsubscribedAt?: Date;
  unsubscribeReason?: string;
  welcomeSequenceStatus: "not_started" | "active" | "completed";
  welcomeEmailSentAt?: Date;
  emailSequenceStep: number;
  emailSequenceNextSendAt?: Date;
  emailSequenceCompletedAt?: Date;
  emailSequenceEvents: Array<{
    step: number;
    sentAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    completedAt?: Date;
  }>;
  downloadTokenHash?: string;
  downloadTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, trim: true },
    country: { type: String, trim: true },
    interests: { type: [String], default: [] },
    source: { type: String, default: "newsletter", trim: true },
    requestedLeadMagnetSlug: { type: String, trim: true },
    language: { type: String, enum: ["en", "pt", "es"], default: "en" },
    consent: { type: Boolean, required: true },
    consentedAt: { type: Date, required: true },
    consentIp: { type: String, trim: true },
    consentUserAgent: { type: String, trim: true },
    consentText: { type: String, required: true, trim: true },
    consentVersion: { type: String, required: true, default: "2026-05-31", trim: true },
    privacyPolicyUrl: { type: String, required: true, default: "/privacy", trim: true },
    status: { type: String, enum: ["pending", "confirmed"], default: "pending", index: true },
    emailConfirmedAt: { type: Date },
    confirmationTokenHash: { type: String, index: true },
    confirmationTokenExpiresAt: { type: Date },
    unsubscribedAt: { type: Date },
    unsubscribeReason: { type: String, trim: true },
    welcomeSequenceStatus: {
      type: String,
      enum: ["not_started", "active", "completed"],
      default: "not_started",
    },
    welcomeEmailSentAt: { type: Date },
    emailSequenceStep: { type: Number, min: 0, max: 5, default: 0, index: true },
    emailSequenceNextSendAt: { type: Date, index: true },
    emailSequenceCompletedAt: { type: Date },
    emailSequenceEvents: {
      type: [
        {
          step: { type: Number, min: 1, max: 5, required: true },
          sentAt: { type: Date },
          openedAt: { type: Date },
          clickedAt: { type: Date },
          completedAt: { type: Date },
        },
      ],
      default: [],
    },
    downloadTokenHash: { type: String, index: true },
    downloadTokenExpiresAt: { type: Date },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1, welcomeSequenceStatus: 1, emailSequenceNextSendAt: 1 });

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
