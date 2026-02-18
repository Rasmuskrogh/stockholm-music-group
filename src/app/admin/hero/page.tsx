"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import g from "../AdminGlobal.module.css";

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

  if (loading) return <p className={g.adminLoading}>Laddar...</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={g.adminPageTitle}>Hero och bakgrund</h1>
      <p className={g.adminPageSubtitle}>Video, bakgrundsbild och texter för herosektionen.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>
            <span className={g.adminLabel}>Hero-video (sökväg)</span>
            <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={g.adminInput} />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            <span className={g.adminLabel}>Bakgrundsbild (sökväg)</span>
            <input type="text" value={backgroundImageUrl} onChange={(e) => setBackgroundImageUrl(e.target.value)} className={g.adminInput} />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            <span className={g.adminLabel}>Rubrik</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={g.adminInput} />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            <span className={g.adminLabel}>Underrubrik</span>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={g.adminInput} />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            <span className={g.adminLabel}>Knapptext (CTA)</span>
            <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className={g.adminInput} />
          </label>
        </div>
        {message && (
          <p className={`${message === "Sparat." ? g.adminMessageSuccess : g.adminMessageError} ${styles.message}`}>{message}</p>
        )}
        <button type="submit" disabled={saving} className={`${g.adminBtnPrimary} ${styles.saveButton}`}>
          {saving ? "Sparar..." : "Spara"}
        </button>
      </form>
    </div>
  );
}
