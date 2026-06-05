import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
import {
  cloudinaryDeliveryUrl,
  isCloudinaryFolderType,
  uploadImageToCloudinary,
} from "@/lib/server/cloudinary";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function requireSession() {
  const session = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(session);
}

function cleanPublicId(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/[^a-zA-Z0-9/_-]/g, "-").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
}

function defaultAlt(file: File, alt: string) {
  return alt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
}

export async function POST(request: NextRequest) {
  if (!requireSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderType = formData.get("folderType");
    const publicId = cleanPublicId(formData.get("publicId"));
    const alt = String(formData.get("alt") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!isCloudinaryFolderType(folderType)) {
      return NextResponse.json({ error: "Valid folderType is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, WEBP, and AVIF images are supported" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image must be 8MB or smaller" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
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
          optimizedUrl: cloudinaryDeliveryUrl(uploaded.public_id, 1200),
          thumbnailUrl: cloudinaryDeliveryUrl(uploaded.public_id, 400),
          createdAt: uploaded.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cloudinary upload failed";
    const status = message.includes("CLOUDINARY_") ? 500 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
