import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
import {
  cloudinaryDeliveryUrl,
  hasCloudinaryConfig,
  isCloudinaryFolderType,
  uploadImageToCloudinary,
  uploadRawFileToCloudinary,
} from "@/lib/server/cloudinary";
import type { CloudinaryFolderType } from "@/types/media";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_PDF_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const PDF_FOLDERS = new Set<CloudinaryFolderType>(["lead-magnet-pdfs"]);

function errorResponse(error: string, status: number, details?: string) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

function requireSession() {
  const session = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(session);
}

function cleanPublicId(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/[^a-zA-Z0-9/_.-]/g, "-").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
}

function normalizeLeadMagnetPdfPublicId(value?: string) {
  if (!value) return undefined;
  const withoutFolder = value.replace(/^unveil\/lead-magnets\/pdfs\//, "");
  const withoutUploadPrefix = withoutFolder.replace(/^raw\/upload\/(?:v\d+\/)?/, "");
  const withoutExtension = withoutUploadPrefix.replace(/\.pdf$/i, "");
  return withoutExtension ? `${withoutExtension}.pdf` : undefined;
}

function defaultAlt(file: File, alt: string) {
  return alt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
}

function sniffImageType(buffer: Buffer) {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "image/jpeg";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (buffer.subarray(4, 12).toString("ascii").includes("ftypavif")) return "image/avif";
  return "";
}

function sniffPdf(buffer: Buffer) {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

export async function POST(request: NextRequest) {
  if (!requireSession()) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderType = formData.get("folderType");
    const publicId = cleanPublicId(formData.get("publicId"));
    const alt = String(formData.get("alt") || "").trim();

    if (!(file instanceof File)) {
      return errorResponse("Image file is required", 400, "Expected multipart/form-data field named file.");
    }

    if (!isCloudinaryFolderType(folderType)) {
      return errorResponse(
        "Valid folderType is required",
        400,
        "Expected folderType to be one of: products, articles, lead-magnets, ebooks, brand, lead-magnet-pdfs."
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isPdfUpload = PDF_FOLDERS.has(folderType);

    if (isPdfUpload) {
      const rawFolderType = folderType as "lead-magnet-pdfs";
      if (file.size > MAX_PDF_SIZE) {
        return errorResponse("PDF must be 20MB or smaller", 413, `Received ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      }

      if (file.type !== "application/pdf") {
        return errorResponse("Invalid file type", 400, `Only application/pdf uploads are supported. Received ${file.type || "unknown MIME type"}.`);
      }

      if (!sniffPdf(buffer)) {
        return errorResponse("Invalid PDF file", 400, "The selected file does not look like a valid PDF.");
      }

      const pdfPublicId = normalizeLeadMagnetPdfPublicId(publicId);
      if (!pdfPublicId) {
        return errorResponse("PDF public ID is required", 400, "Lead magnet PDF uploads must include a normalized slug-based public ID.");
      }

      if (!hasCloudinaryConfig()) {
        return errorResponse(
          "Cloudinary environment variables are missing",
          500,
          "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        );
      }

      const uploaded = await uploadRawFileToCloudinary({ buffer, folderType: rawFolderType, publicId: pdfPublicId });

      return NextResponse.json(
        {
          success: true,
          asset: {
            url: uploaded.secure_url,
            secureUrl: uploaded.secure_url,
            publicId: uploaded.public_id,
            width: uploaded.width,
            height: uploaded.height,
            format: uploaded.format || "pdf",
            bytes: uploaded.bytes,
            resourceType: uploaded.resource_type,
            alt: defaultAlt(file, alt),
            folderType,
            originalFilename: file.name,
            optimizedUrl: "",
            thumbnailUrl: "",
            createdAt: uploaded.created_at,
          },
        },
        { status: 201 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return errorResponse("Image must be 8MB or smaller", 413, `Received ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
    }

    const detectedType = ALLOWED_TYPES.has(file.type) ? file.type : sniffImageType(buffer);

    if (!ALLOWED_TYPES.has(detectedType)) {
      return errorResponse(
        "Invalid image type",
        400,
        `Only JPG, PNG, WEBP, and AVIF images are supported. Received ${file.type || "unknown MIME type"}.`
      );
    }

    if (!hasCloudinaryConfig()) {
      return errorResponse(
        "Cloudinary environment variables are missing",
        500,
        "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }

    const uploaded = await uploadImageToCloudinary({ buffer, folderType, publicId });

    return NextResponse.json(
      {
        success: true,
        asset: {
          url: uploaded.secure_url,
          secureUrl: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
          bytes: uploaded.bytes,
          resourceType: uploaded.resource_type,
          alt: defaultAlt(file, alt),
          folderType,
          originalFilename: file.name,
          optimizedUrl: cloudinaryDeliveryUrl(uploaded.public_id, 1200),
          thumbnailUrl: cloudinaryDeliveryUrl(uploaded.public_id, 400),
          createdAt: uploaded.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cloudinary upload failed";
    const status = message.includes("CLOUDINARY_") ? 500 : 502;
    return errorResponse("Cloudinary upload failed", status, message);
  }
}
