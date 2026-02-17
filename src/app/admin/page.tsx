"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          padding: 24,
          borderRight: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Admin</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{session?.user?.email}</p>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 16 }}>
          <Link href="/admin" style={{ color: "#fff", textDecoration: "none", padding: "8px 0" }}>
            Översikt
          </Link>
          <Link href="/admin/hero" style={{ color: "#fff", textDecoration: "none", padding: "8px 0" }}>
            Hero & bakgrund
          </Link>
          <Link href="/admin/content" style={{ color: "#fff", textDecoration: "none", padding: "8px 0" }}>
            Texter
          </Link>
          <Link href="/admin/media" style={{ color: "#fff", textDecoration: "none", padding: "8px 0" }}>
            Media (videor)
          </Link>
          <Link href="/admin/gallery" style={{ color: "#fff", textDecoration: "none", padding: "8px 0" }}>
            Galleri
          </Link>
        </nav>
        <Link href="/" style={{ color: "#888", fontSize: 14, marginTop: "auto" }}>
          Till sidan →
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{
            padding: "8px 12px",
            background: "transparent",
            border: "1px solid #444",
            borderRadius: 4,
            color: "#aaa",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Logga ut
        </button>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Översikt</h1>
        <p style={{ color: "#888", margin: 0 }}>
          Välj en sektion i menyn för att redigera innehållet på sidan.
        </p>
      </main>
    </div>
  );
}
