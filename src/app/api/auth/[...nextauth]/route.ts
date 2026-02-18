type RouteContext = { params: Promise<{ nextauth?: string[] }> };

export async function GET(req: Request, context: RouteContext) {
  const NextAuth = (await import("next-auth")).default;
  const { authOptions } = await import("@/lib/auth");
  const handler = NextAuth(authOptions);
  return handler(req, context);
}
export async function POST(req: Request, context: RouteContext) {
  const NextAuth = (await import("next-auth")).default;
  const { authOptions } = await import("@/lib/auth");
  const handler = NextAuth(authOptions);
  return handler(req, context);
}
