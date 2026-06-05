export interface MediaAsset {
  id: string;
  url: string;
  secureUrl?: string;
  optimizedUrl?: string;
  thumbnailUrl?: string;
  publicId?: string;
  filename: string;
  originalName: string;
  alt: string;
  contentType: string;
  size: number;
  createdAt: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  resourceType?: string;
  folderType?: CloudinaryFolderType;
}

export type CloudinaryFolderType = "products" | "articles" | "lead-magnets" | "ebooks" | "brand";

export interface CloudinaryUploadAsset {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: string;
  alt: string;
  folderType: CloudinaryFolderType;
  optimizedUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}
