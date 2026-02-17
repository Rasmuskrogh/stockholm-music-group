"use client";

import { useEffect, useState } from "react";

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setMessage("Kunde inte ladda."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(key: string, value: string) {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(false);
    if (res.ok) {
      setContent((prev) => ({ ...prev, [key]: value }));
      setEditingKey(null);
      setMessage("Sparat.");
    } else setMessage("Kunde inte spara.");
  }

  if (loading) return <p>Laddar...</p>;

  const keys = Object.keys(content);

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginBottom: 24 }}>Texter</h1>
      {message && <p style={{ marginBottom: 16, color: message === "Sparat." ? "#6a6" : "#e55" }}>{message}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {keys.map((key) => (
          <div key={key} style={{ padding: 16, background: "#1a1a1a", borderRadius: 8 }}>
            <strong style={{ display: "block", marginBottom: 8 }}>{key}</strong>
            {editingKey === key ? (
              <>
                <textarea
                  rows={6}
                  value={content[key] ?? ""}
                  onChange={(e) => setContent((prev) => ({ ...prev, [key]: e.target.value }))}
                  style={{ width: "100%", padding: 10, background: "#222", border: "1px solid #444", borderRadius: 4, color: "#fff", fontFamily: "inherit" }}
                />
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => handleSave(key, content[key] ?? "")} disabled={saving} style={{ padding: "8px 16px", background: "#2596be", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer" }}>
                    Spara
                  </button>
                  <button type="button" onClick={() => setEditingKey(null)} style={{ padding: "8px 16px", background: "#444", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer" }}>
                    Avbryt
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#aaa", fontSize: 14 }}>{(content[key] ?? "").slice(0, 200)}{(content[key] ?? "").length > 200 ? "..." : ""}</p>
                <button type="button" onClick={() => setEditingKey(key)} style={{ marginTop: 8, padding: "6px 12px", background: "#333", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", fontSize: 14 }}>
                  Redigera
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
