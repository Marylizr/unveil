import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
import { cloudinaryFolder, hasCloudinaryConfig } from "@/lib/server/cloudinary";
import { normalizeLeadMagnetSlug } from "@/server/validators/leadMagnetValidator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEAD_MAGNET_PDF_FOLDER = cloudinaryFolder("lead-magnet-pdfs");
const RESOURCE_TYPE = "raw";
const DELIVERY_TYPE = "authenticated";

type SignUploadBody = {
  slug?: unknown;
  folder?: unknown;
  resourceType?: unknown;
  publicId?: unknown;
};

function errorResponse(error: string, status: number, details?: string) {
  return NextResponse.json({ success: false, error, ...(details ? { details } : {}) }, { status });
}

function requireSession() {
  const session = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(session);
}

function requiredEnv(name: "CLOUDINARY_CLOUD_NAME" | "CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for Cloudinary signed uploads.`);
  return value;
}

function sanitizePublicId(value: string) {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^unveil\/lead-magnets\/pdfs\//, "")
    .replace(/[^a-z0-9_.-]+/gi, "-")
    .replace(/-+/g, "-");
}

function leadMagnetPdfPublicId(slug: string, publicId?: string) {
  const normalizedSlug = normalizeLeadMagnetSlug(slug);
  const candidate = sanitizePublicId(publicId || `${normalizedSlug}.pdf`);
  const withoutExtension = candidate.replace(/\.pdf$/i, "");
  if (!withoutExtension || withoutExtension !== normalizedSlug) return "";
  return `${withoutExtension}.pdf`;
}

function signUploadParams(params: Record<string, string | number | boolean>) {
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET");
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function POST(request: NextRequest) {
  if (!requireSession()) return errorResponse("Unauthorized", 401);

  try {
    const body = (await request.json().catch(() => ({}))) as SignUploadBody;
    const folder = typeof body.folder === "string" ? body.folder.trim() : "";
    const resourceType = typeof body.resourceType === "string" ? body.resourceType.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const requestedPublicId = typeof body.publicId === "string" ? body.publicId.trim() : "";

    if (!hasCloudinaryConfig()) {
      return errorResponse(
        "Cloudinary environment variables are missing",
        500,
        "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }

    if (folder !== LEAD_MAGNET_PDF_FOLDER) {
      return errorResponse("Invalid upload folder", 400, "Lead magnet PDFs may only upload to unveil/lead-magnets/pdfs.");
    }

    if (resourceType !== RESOURCE_TYPE) {
      return errorResponse("Invalid resource type", 400, "Lead magnet PDFs must use Cloudinary raw uploads.");
    }

    const publicId = leadMagnetPdfPublicId(slug, requestedPublicId);
    if (!publicId) {
      return errorResponse("Invalid public ID", 400, "The PDF public ID must match the normalized lead magnet slug and end in .pdf.");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const uploadParams = {
      folder,
      invalidate: true,
      overwrite: true,
      public_id: publicId,
      timestamp,
      type: DELIVERY_TYPE,
    };

    return NextResponse.json({
      success: true,
      cloudName: requiredEnv("CLOUDINARY_CLOUD_NAME"),
      apiKey: requiredEnv("CLOUDINARY_API_KEY"),
      timestamp,
      signature: signUploadParams(uploadParams),
      folder,
      publicId,
      resourceType,
      type: DELIVERY_TYPE,
      overwrite: true,
      invalidate: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not sign Cloudinary upload.";
    return errorResponse("Could not sign Cloudinary upload", message.includes("CLOUDINARY_") ? 500 : 400, message);
  }
}
