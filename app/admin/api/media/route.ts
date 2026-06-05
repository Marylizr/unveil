import crypto from "crypto";
import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
import { cloudinaryDeliveryUrl, hasCloudinaryConfig, listCloudinaryImages } from "@/lib/server/cloudinary";
import type { MediaAsset } from "@/types/media";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
const manifestPath = path.join(process.cwd(), "private", "cms-media.json");

function requireSession() {
  const session = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(session);
}

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

async function readManifest(): Promise<MediaAsset[]> {
  try {
    const raw = await readFile(manifestPath, "utf8");
    return JSON.parse(raw) as MediaAsset[];
  } catch {
    return [];
  }
}

async function writeManifest(assets: MediaAsset[]) {
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(assets, null, 2));
}

function folderTypeFromPublicId(publicId: string): MediaAsset["folderType"] {
  const segment = publicId.split("/")[1];
  if (segment === "products" || segment === "articles" || segment === "lead-magnets" || segment === "ebooks" || segment === "brand") {
    return segment;
  }
  return undefined;
}

export async function GET() {
  if (!requireSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (hasCloudinaryConfig()) {
    const assets = await listCloudinaryImages();
    return NextResponse.json(
      assets.map((asset) => ({
        id: asset.public_id,
        url: cloudinaryDeliveryUrl(asset.public_id, 1200),
        secureUrl: asset.secure_url,
        optimizedUrl: cloudinaryDeliveryUrl(asset.public_id, 1200),
        thumbnailUrl: cloudinaryDeliveryUrl(asset.public_id, 400),
        publicId: asset.public_id,
        filename: asset.public_id.split("/").pop() || asset.public_id,
        originalName: asset.public_id.split("/").pop() || asset.public_id,
        alt: asset.public_id.split("/").pop()?.replace(/[-_]+/g, " ") || "UNVEIL media asset",
        contentType: `image/${asset.format}`,
        size: asset.bytes,
        createdAt: asset.created_at,
        width: asset.width,
        height: asset.height,
        format: asset.format,
        bytes: asset.bytes,
        resourceType: asset.resource_type,
        folderType: folderTypeFromPublicId(asset.public_id),
      }))
    );
  }

  const assets = await readManifest();
  return NextResponse.json(assets.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(request: NextRequest) {
  if (!requireSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") || "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP, and GIF images are supported" }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });
  }

  await mkdir(uploadDir, { recursive: true });

  const id = crypto.randomUUID();
  const filename = `${Date.now()}-${id}.${extensionFor(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const asset: MediaAsset = {
    id,
    url: `/uploads/cms/${filename}`,
    filename,
    originalName: file.name,
    alt: alt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    contentType: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  const assets = await readManifest();
  await writeManifest([asset, ...assets]);

  return NextResponse.json(asset, { status: 201 });
}
