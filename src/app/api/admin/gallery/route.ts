import { NextResponse } from "next/server";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const folder = process.env.CLOUDINARY_FOLDER || "gallery";

interface AdminGalleryItem {
  publicId: string;
  url: string;
  width: number;
  height: number;
  displayName: string;
  sortOrder: number;
}

function getCloudinaryResources() {
  const baseFolder = folder.endsWith("/") ? folder.slice(0, -1) : folder;
  return cloudinary.search
    .expression(`folder:${baseFolder}/*`)
    .max_results(100)
    .execute()
    .then((r) => r.resources || [])
    .catch(() => []);
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
    }
    const resources = await getCloudinaryResources();
    const dbImages = await prisma.galleryImage.findMany();
    const byPublicId = new Map(dbImages.map((row) => [row.publicId, row]));
    const list: AdminGalleryItem[] = resources.map(
      (r: { public_id: string; secure_url: string; width?: number; height?: number }) => ({
        publicId: r.public_id,
        url: r.secure_url,
        width: r.width ?? 0,
        height: r.height ?? 0,
        displayName: byPublicId.get(r.public_id)?.displayName ?? "",
        sortOrder: byPublicId.get(r.public_id)?.sortOrder ?? 0,
      })
    );
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.publicId.localeCompare(b.publicId));
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/admin/gallery:", error);
    return NextResponse.json({ error: "Failed to list gallery" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    const displayName = (formData.get("displayName") as string)?.trim() ?? "";
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const baseFolder = folder.endsWith("/") ? folder.slice(0, -1) : folder;
    const result = await new Promise<{ public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: baseFolder, resource_type: "image" }, (err, res) =>
        err ? reject(err) : resolve(res!)
      );
      const readable = Readable.from(buffer);
      readable.pipe(stream);
    });
    await prisma.galleryImage.upsert({
      where: { publicId: result.public_id },
      update: { displayName: displayName || "" },
      create: { publicId: result.public_id, displayName: displayName || "" },
    });
    return NextResponse.json({ publicId: result.public_id, displayName: displayName || "" });
  } catch (error) {
    console.error("POST /api/admin/gallery:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { publicId, displayName, sortOrder } = body;
    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json({ error: "publicId required" }, { status: 400 });
    }
    const existing = await prisma.galleryImage.findUnique({ where: { publicId } });
    const data: { displayName?: string; sortOrder?: number } = {};
    if (typeof displayName === "string") data.displayName = displayName;
    if (typeof sortOrder === "number") data.sortOrder = sortOrder;
    if (Object.keys(data).length === 0) {
      return NextResponse.json(existing ?? { publicId, displayName: "", sortOrder: 0 });
    }
    const updated = await prisma.galleryImage.upsert({
      where: { publicId },
      update: data,
      create: { publicId, displayName: (data.displayName as string) ?? "", sortOrder: (data.sortOrder as number) ?? 0 },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/gallery:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");
    if (!publicId) {
      return NextResponse.json({ error: "publicId required" }, { status: 400 });
    }
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch (e) {
      console.warn("Cloudinary destroy failed (may already be deleted):", e);
    }
    await prisma.galleryImage.deleteMany({ where: { publicId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/gallery:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
