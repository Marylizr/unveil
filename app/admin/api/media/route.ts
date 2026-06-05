import crypto from "crypto";
import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
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

export async function GET() {
  if (!requireSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
