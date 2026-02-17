import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    const hero = await prisma.hero.findUnique({
      where: { id: "default" },
    });
    if (!hero) {
      return NextResponse.json({ error: "Hero not found" }, { status: 404 });
    }
    return NextResponse.json(hero);
  } catch (error) {
    console.error("GET /api/admin/hero:", error);
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const videoUrl = body.videoUrl;
    const backgroundImageUrl = body.backgroundImageUrl;
    const title = body.title;
    const subtitle = body.subtitle;
    const ctaText = body.ctaText;
    const hero = await prisma.hero.upsert({
      where: { id: "default" },
      update: {
        ...(videoUrl != null && { videoUrl }),
        ...(backgroundImageUrl != null && { backgroundImageUrl }),
        ...(title != null && { title }),
        ...(subtitle != null && { subtitle }),
        ...(ctaText != null && { ctaText }),
      },
      create: {
        videoUrl: videoUrl ?? "/videos/hero.mp4",
        backgroundImageUrl: backgroundImageUrl ?? "/images/background.jpg",
        title: title ?? "Stockholm",
        subtitle: subtitle ?? "Music Group",
        ctaText: ctaText ?? "BOKA OSS",
      },
    });
    return NextResponse.json(hero);
  } catch (error) {
    console.error("PUT /api/admin/hero:", error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}
