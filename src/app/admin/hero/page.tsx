"use client";

import { useEffect, useState } from "react";

export default function AdminHeroPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((r) => r.json())
      .then((data) => {
        setVideoUrl(data.videoUrl ?? "");
        setBackgroundImageUrl(data.backgroundImageUrl ?? "");
        setTitle(data.title ?? "");
        setSubtitle(data.subtitle ?? "");
        setCtaText(data.ctaText ?? "");
      })
      .catch(() => setMessage("Kunde inte ladda."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoUrl,
        backgroundImageUrl,
        title,
        subtitle,
        ctaText,
      }),
    });
    setSaving(false);
    setMessage(res.ok ? "Sparat." : "Kunde inte spara.");
  }

  if (loading) return <p>Laddar...</p>;

  const inputStyle = {
    width: "100%",
    padding: 10,
    background: "#222",
    border: "1px solid #444",
    borderRadius: 4,
    color: "#fff",
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ marginBottom: 24 }}>Hero och bakgrund</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          <span style={{ display: "block", marginBottom: 4 }}>Hero-video (sokvag)</span>
          <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={inputStyle} />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: 4 }}>Bakgrundsbild (sokvag)</span>
          <input type="text" value={backgroundImageUrl} onChange={(e) => setBackgroundImageUrl(e.target.value)} style={inputStyle} />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: 4 }}>Rubrik</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: 4 }}>Underrubrik</span>
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={inputStyle} />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: 4 }}>Knapptext (CTA)</span>
          <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} style={inputStyle} />
        </label>
        {message && <p style={{ margin: 0, color: message === "Sparat." ? "#6a6" : "#e55" }}>{message}</p>}
        <button type="submit" disabled={saving} style={{ padding: 12, background: "#2596be", border: "none", borderRadius: 4, color: "#fff", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", alignSelf: "flex-start" }}>
          {saving ? "Sparar..." : "Spara"}
        </button>
      </form>
    </div>
  );
}
