import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    const videos = await prisma.mediaVideo.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/admin/media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { composer, title, youtubeId } = body;
    if (!composer || !title || !youtubeId) {
      return NextResponse.json({ error: "composer, title and youtubeId required" }, { status: 400 });
    }
    const count = await prisma.mediaVideo.count();
    const video = await prisma.mediaVideo.create({
      data: {
        composer,
        title,
        youtubeId,
        sortOrder: count,
      },
    });
    return NextResponse.json(video);
  } catch (error) {
    console.error("POST /api/admin/media:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await prisma.mediaVideo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/media:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
