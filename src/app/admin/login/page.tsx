"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Fel e-post eller lösenord.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 360, padding: 24, background: "#222", borderRadius: 8, display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, color: "#fff" }}>Logga in</h1>
        <label style={{ color: "#aaa", fontSize: 14 }}>
          E-post
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: "block", width: "100%", marginTop: 4, padding: 10, background: "#333", border: "1px solid #444", borderRadius: 4, color: "#fff" }} />
        </label>
        <label style={{ color: "#aaa", fontSize: 14 }}>
          Lösenord
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: "block", width: "100%", marginTop: 4, padding: 10, background: "#333", border: "1px solid #444", borderRadius: 4, color: "#fff" }} />
        </label>
        {error && <p style={{ color: "#e55", margin: 0, fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: 12, background: "#2596be", border: "none", borderRadius: 4, color: "#fff", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
    </div>
  );
}
