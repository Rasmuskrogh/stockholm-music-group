"use client";

import { useEffect, useState } from "react";

type Video = { id: string; composer: string; title: string; youtubeId: string; sortOrder: number };

export default function AdminMediaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [composer, setComposer] = useState("");
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");

  function load() {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then(setVideos)
      .catch(() => setMessage("Kunde inte ladda."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!composer || !title || !youtubeId) {
      setMessage("Fyll i alla fält.");
      return;
    }
    setMessage("");
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ composer, title, youtubeId }),
    });
    if (res.ok) {
      setComposer("");
      setTitle("");
      setYoutubeId("");
      load();
      setMessage("Video tillagd.");
    } else setMessage("Kunde inte lägga till.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Ta bort denna video?")) return;
    setMessage("");
    const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      load();
      setMessage("Video borttagen.");
    } else setMessage("Kunde inte ta bort.");
  }

  if (loading) return <p>Laddar...</p>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginBottom: 24 }}>Media (videor)</h1>
      {message && <p style={{ marginBottom: 16, color: message.includes("Kunde") ? "#e55" : "#6a6" }}>{message}</p>}

      <form onSubmit={handleAdd} style={{ marginBottom: 32, padding: 16, background: "#1a1a1a", borderRadius: 8, display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Lägg till video</h2>
        <input type="text" placeholder="Kompositör" value={composer} onChange={(e) => setComposer(e.target.value)} style={{ padding: 10, background: "#222", border: "1px solid #444", borderRadius: 4, color: "#fff" }} />
        <input type="text" placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 10, background: "#222", border: "1px solid #444", borderRadius: 4, color: "#fff" }} />
        <input type="text" placeholder="YouTube ID (t.ex. gWM82gyJuqM)" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} style={{ padding: 10, background: "#222", border: "1px solid #444", borderRadius: 4, color: "#fff" }} />
        <button type="submit" style={{ padding: 10, background: "#2596be", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", alignSelf: "flex-start" }}>
          Lägg till
        </button>
      </form>

      <h2 style={{ marginBottom: 12, fontSize: 16 }}>Nuvarande videor</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {videos.map((v) => (
          <li key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #333" }}>
            <span>{v.composer} – {v.title}</span>
            <button type="button" onClick={() => handleDelete(v.id)} style={{ padding: "6px 12px", background: "#522", border: "none", borderRadius: 4, color: "#faa", cursor: "pointer", fontSize: 13 }}>
              Ta bort
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
