import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

interface GalleryImageOut {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface GalleryImageRow {
  publicId: string;
  displayName: string;
  sortOrder: number;
}

export async function GET() {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json([]);
    }
    const folderName = process.env.CLOUDINARY_FOLDER || "gallery";
    const baseFolder = folderName.endsWith("/") ? folderName.slice(0, -1) : folderName;
    const searchResult = await cloudinary.search
      .expression(`folder:${baseFolder}/*`)
      .max_results(100)
      .execute()
      .catch(() => ({ resources: [] as CloudinaryResource[] }));
    const resources: CloudinaryResource[] = searchResult.resources || [];
    const publicIds = resources.map((r) => r.public_id);
    const dbRows: GalleryImageRow[] = publicIds.length
      ? await (
          prisma as unknown as { galleryImage: { findMany: (args: object) => Promise<GalleryImageRow[]> } }
        ).galleryImage.findMany({
          where: { publicId: { in: publicIds } },
          select: { publicId: true, displayName: true, sortOrder: true },
        })
      : [];
    const byPublicId = new Map(dbRows.map((row) => [row.publicId, row]));
    const images: GalleryImageOut[] = resources.map((r) => {
      const meta = byPublicId.get(r.public_id);
      const alt = meta?.displayName?.trim() || r.public_id.split("/").pop() || "Gallery image";
      return {
        id: r.public_id,
        url: r.secure_url,
        alt,
        width: r.width ?? 0,
        height: r.height ?? 0,
      };
    });
    type WithSort = GalleryImageOut & { _sortOrder: number };
    const withSort: WithSort[] = images.map((img) => ({
      ...img,
      _sortOrder: byPublicId.get(img.id)?.sortOrder ?? 999,
    }));
    withSort.sort((a, b) => a._sortOrder - b._sortOrder);
    const sorted: GalleryImageOut[] = withSort.map((item) => ({
      id: item.id,
      url: item.url,
      alt: item.alt,
      width: item.width,
      height: item.height,
    }));
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json([]);
  }
}
