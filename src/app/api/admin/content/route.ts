import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  try {
    if (key) {
      const content = await prisma.content.findUnique({
        where: { key },
      });
      if (!content) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(content);
    }
    const all = await prisma.content.findMany({
      orderBy: { key: "asc" },
    });
    const map: Record<string, string> = {};
    for (const c of all) {
      map[c.key] = c.value;
    }
    return NextResponse.json(map);
  } catch (error) {
    console.error("GET /api/admin/content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
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
    const { key, value } = body;
    if (!key || typeof value !== "string") {
      return NextResponse.json({ error: "key and value required" }, { status: 400 });
    }
    const content = await prisma.content.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error("PUT /api/admin/content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
