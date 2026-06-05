import crypto from "crypto";
import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
import { hasCloudinaryConfig, listCloudinaryRawFiles, uploadRawFileToCloudinary } from "@/lib/server/cloudinary";
import type { PrivateDigitalAsset } from "@/types/digitalAsset";

export const runtime = "nodejs";

const MAX_ASSET_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/epub+zip",
  "application/zip",
  "application/octet-stream",
]);
const assetRoot = path.resolve(process.env.PRIVATE_DIGITAL_ASSETS_DIR || path.join(process.cwd(), "private", "digital-assets"));
const manifestPath = path.join(assetRoot, ".manifest.json");

function requireSession() {
  const session = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(session);
}

function safeExtension(filename: string, contentType: string) {
  const ext = path.extname(filename).replace(/[^a-z0-9.]/gi, "").toLowerCase();
  if (ext) return ext;
  if (contentType === "application/pdf") return ".pdf";
  if (contentType === "application/epub+zip") return ".epub";
  return ".bin";
}

async function readManifest(): Promise<PrivateDigitalAsset[]> {
  try {
    const raw = await readFile(manifestPath, "utf8");
    return JSON.parse(raw) as PrivateDigitalAsset[];
  } catch {
    return [];
  }
}

async function writeManifest(assets: PrivateDigitalAsset[]) {
  await mkdir(assetRoot, { recursive: true });
  await writeFile(manifestPath, JSON.stringify(assets, null, 2));
}

export async function GET() {
  if (!requireSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (hasCloudinaryConfig()) {
    try {
      const cloudinaryAssets = await listCloudinaryRawFiles("digital-assets");
      return NextResponse.json(
        cloudinaryAssets.map((asset) => {
          const filename = asset.public_id.split("/").pop() || asset.public_id;
          return {
            id: asset.public_id,
            filename,
            originalName: filename,
            assetUrl: `cloudinary:raw:authenticated:${asset.public_id}`,
            contentType: asset.format === "pdf" ? "application/pdf" : "application/octet-stream",
            size: asset.bytes,
            createdAt: asset.created_at,
          } satisfies PrivateDigitalAsset;
        })
      );
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[admin-digital-assets] Cloudinary list failed", error);
      }
    }
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

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Digital asset file is required" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only PDF, EPUB, ZIP, and binary files are supported" }, { status: 400 });
  }

  if (file.size > MAX_ASSET_SIZE) {
    return NextResponse.json({ error: "Asset must be 50MB or smaller" }, { status: 400 });
  }

  if (hasCloudinaryConfig()) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadRawFileToCloudinary({
        buffer,
        folderType: "digital-assets",
        authenticated: true,
      });
      const filename = uploaded.public_id.split("/").pop() || uploaded.public_id;
      const asset: PrivateDigitalAsset = {
        id: uploaded.public_id,
        filename,
        originalName: file.name,
        assetUrl: `cloudinary:raw:authenticated:${uploaded.public_id}`,
        contentType: file.type || "application/octet-stream",
        size: uploaded.bytes,
        createdAt: uploaded.created_at,
      };

      return NextResponse.json(asset, { status: 201 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Private asset upload failed";
      return NextResponse.json({ error: "Private asset upload failed", details: message }, { status: 502 });
    }
  }

  await mkdir(assetRoot, { recursive: true });

  const id = crypto.randomUUID();
  const filename = `${Date.now()}-${id}${safeExtension(file.name, file.type)}`;
  const absolutePath = path.join(assetRoot, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  const asset: PrivateDigitalAsset = {
    id,
    filename,
    originalName: file.name,
    assetUrl: filename,
    contentType: file.type || "application/octet-stream",
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  const assets = await readManifest();
  await writeManifest([asset, ...assets]);

  return NextResponse.json(asset, { status: 201 });
}
