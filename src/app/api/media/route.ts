import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.mediaVideo.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
