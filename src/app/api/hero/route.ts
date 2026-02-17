import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    console.error("GET /api/hero:", error);
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 });
  }
}
