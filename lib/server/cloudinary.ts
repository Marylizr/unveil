import { v2 as cloudinary, type UploadApiResponse, type UploadApiOptions } from "cloudinary";

export type CloudinaryFolderType = "products" | "articles" | "lead-magnets" | "ebooks" | "brand";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resource_type: string;
  created_at: string;
}

export interface CloudinaryListedAsset extends CloudinaryUploadResult {
  public_id: string;
}

interface CloudinarySearchResource {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resource_type: string;
  created_at: string;
}

interface CloudinarySearchResponse {
  resources?: CloudinarySearchResource[];
}

const folderMap: Record<CloudinaryFolderType, string> = {
  products: "unveil/products",
  articles: "unveil/articles",
  "lead-magnets": "unveil/lead-magnets",
  ebooks: "unveil/ebooks",
  brand: "unveil/brand",
};

let configured = false;

export function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function requiredEnv(name: "CLOUDINARY_CLOUD_NAME" | "CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for Cloudinary uploads.`);
  }
  return value;
}

export function configureCloudinary() {
  if (configured) return;

  cloudinary.config({
    cloud_name: requiredEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: requiredEnv("CLOUDINARY_API_KEY"),
    api_secret: requiredEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  configured = true;
}

export function cloudinaryFolder(folderType: CloudinaryFolderType) {
  return folderMap[folderType];
}

export function isCloudinaryFolderType(value: FormDataEntryValue | null): value is CloudinaryFolderType {
  return typeof value === "string" && value in folderMap;
}

export async function uploadImageToCloudinary({
  buffer,
  folderType,
  publicId,
}: {
  buffer: Buffer;
  folderType: CloudinaryFolderType;
  publicId?: string;
}): Promise<CloudinaryUploadResult> {
  configureCloudinary();

  const options: UploadApiOptions = {
    folder: cloudinaryFolder(folderType),
    resource_type: "image",
    overwrite: Boolean(publicId),
    unique_filename: !publicId,
    use_filename: false,
    invalidate: Boolean(publicId),
  };

  if (publicId) {
    options.public_id = publicId;
  }

  const response = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      if (!result) {
        reject(new Error("Cloudinary upload did not return a result."));
        return;
      }
      resolve(result);
    });

    stream.end(buffer);
  });

  return {
    secure_url: response.secure_url,
    public_id: response.public_id,
    width: response.width,
    height: response.height,
    format: response.format,
    bytes: response.bytes,
    resource_type: response.resource_type,
    created_at: response.created_at,
  };
}

export async function listCloudinaryImages(maxResults = 100): Promise<CloudinaryListedAsset[]> {
  configureCloudinary();

  const search = cloudinary.search
    .expression("folder:unveil/* AND resource_type:image")
    .sort_by("created_at", "desc")
    .max_results(maxResults);
  const response = (await search.execute()) as CloudinarySearchResponse;

  return (response.resources || []).map((resource) => ({
    secure_url: resource.secure_url,
    public_id: resource.public_id,
    width: resource.width,
    height: resource.height,
    format: resource.format,
    bytes: resource.bytes,
    resource_type: resource.resource_type,
    created_at: resource.created_at,
  }));
}

export function cloudinaryDeliveryUrl(publicId: string, width: number) {
  configureCloudinary();

  return cloudinary.url(publicId, {
    secure: true,
    resource_type: "image",
    transformation: [
      {
        fetch_format: "auto",
        quality: "auto",
        width,
        crop: "limit",
      },
    ],
  });
}
