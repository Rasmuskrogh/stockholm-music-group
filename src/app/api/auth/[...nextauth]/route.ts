import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

function ensureJsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status, headers: { "Content-Type": "application/json" } });
}

const handler = NextAuth(authOptions);

type RouteContext = { params: Promise<{ nextauth?: string[] }> };

async function wrap(
  req: Request,
  context: RouteContext,
  h: (req: Request, context: RouteContext) => Promise<Response>
): Promise<Response> {
  if (!process.env.NEXTAUTH_SECRET) {
    return ensureJsonError("Server misconfiguration: NEXTAUTH_SECRET is not set.");
  }
  try {
    return await h(req, context);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Authentication error";
    console.error("[next-auth] route error:", e);
    return ensureJsonError(msg);
  }
}

export function GET(req: Request, context: RouteContext) {
  return wrap(req, context, (r, ctx) => handler(r, ctx));
}
export function POST(req: Request, context: RouteContext) {
  return wrap(req, context, (r, ctx) => handler(r, ctx));
}
