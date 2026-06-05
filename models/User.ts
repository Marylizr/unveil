import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "guest" | "member" | "premium" | "admin";

export interface IUser extends Document {
  email: string;
  firstName?: string;
  role: UserRole;
  passwordHash: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  emailVerificationTokenHash?: string;
  emailVerificationTokenExpiresAt?: Date;
  passwordResetTokenHash?: string;
  passwordResetTokenExpiresAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    firstName: { type: String, trim: true },
    role: { type: String, enum: ["guest", "member", "premium", "admin"], default: "member", index: true },
    passwordHash: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, default: false, index: true },
    emailVerifiedAt: { type: Date },
    emailVerificationTokenHash: { type: String, index: true, select: false },
    emailVerificationTokenExpiresAt: { type: Date, select: false },
    passwordResetTokenHash: { type: String, index: true, select: false },
    passwordResetTokenExpiresAt: { type: Date, select: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
