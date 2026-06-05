import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";
import type { Types } from "mongoose";
import Entitlement from "@/models/Entitlement";
import Product from "@/models/Product";

export type DigitalAssetResult =
  | { status: "ready"; absolutePath: string; filename: string; contentType: string }
  | { status: "unauthorized" | "missing" | "unsupported" | "not_protected" };

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createRawDownloadToken() {
  return crypto.randomBytes(32).toString("hex");
}

function privateAssetRoot() {
  return path.resolve(process.env.PRIVATE_DIGITAL_ASSETS_DIR || path.join(process.cwd(), "private", "digital-assets"));
}

function contentTypeFor(filename: string) {
  if (filename.toLowerCase().endsWith(".pdf")) return "application/pdf";
  if (filename.toLowerCase().endsWith(".epub")) return "application/epub+zip";
  return "application/octet-stream";
}

function resolveLocalAsset(assetUrl: string) {
  if (!assetUrl || /^(https?:|s3:|r2:)/i.test(assetUrl)) return null;

  const root = privateAssetRoot();
  const relativeAsset = assetUrl.replace(/^private\/digital-assets\//, "");
  const absolutePath = path.resolve(root, relativeAsset);

  if (!absolutePath.startsWith(`${root}${path.sep}`)) return null;
  return absolutePath;
}

export async function getProtectedDigitalAsset(productId: string, token: string): Promise<DigitalAssetResult> {
  if (!productId || !token) return { status: "unauthorized" };

  const entitlement = await Entitlement.findOne({
    productId,
    downloadTokenHash: hashToken(token),
    status: "active",
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
  }).select("+downloadTokenHash");

  if (!entitlement) return { status: "unauthorized" };

  const product = await Product.findById(productId).select("+digitalAssetUrl +isProtectedAsset");
  if (!product) return { status: "missing" };
  if (!product.isProtectedAsset) return { status: "not_protected" };
  if (!product.digitalAssetUrl) return { status: "missing" };

  const absolutePath = resolveLocalAsset(product.digitalAssetUrl);
  if (!absolutePath) return { status: "unsupported" };

  try {
    await fs.access(absolutePath);
  } catch {
    return { status: "missing" };
  }

  const filename = path.basename(absolutePath);
  entitlement.downloadCount = (entitlement.downloadCount || 0) + 1;
  entitlement.lastDownloadedAt = new Date();
  await entitlement.save();

  return { status: "ready", absolutePath, filename, contentType: contentTypeFor(filename) };
}

export async function createEntitlementDownloadToken({
  productId,
  orderId,
  userEmail,
  accessType = "download",
  expiresAt,
}: {
  productId: string | Types.ObjectId;
  orderId?: string | Types.ObjectId;
  userEmail: string;
  accessType?: "download" | "course" | "membership";
  expiresAt?: Date;
}) {
  const downloadToken = createRawDownloadToken();
  const entitlement = await Entitlement.create({
    productId,
    orderId,
    customerEmail: userEmail,
    userEmail,
    email: userEmail,
    accessType,
    status: "active",
    downloadTokenHash: hashToken(downloadToken),
    tokenCreatedAt: new Date(),
    expiresAt,
  });

  return { entitlement, downloadToken };
}
