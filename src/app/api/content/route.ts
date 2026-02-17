import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      return NextResponse.json({ key: content.key, value: content.value });
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
    console.error("GET /api/content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
