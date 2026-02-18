"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import g from "../AdminGlobal.module.css";

/** Endast dessa nycklar kan redigeras här. Bröllop redigeras under Bröllop-sidan. "Made by" styrs enbart i koden. */
const CONTENT_LABELS: Record<string, string> = {
  bio_text: "Biotext",
  footer_copyright: "Footer – copyright",
  media_section_title: "Mediasektion – titel",
};

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

  if (loading) return <p className={g.adminLoading}>Laddar...</p>;

  const keys = Object.keys(content).filter((key) => CONTENT_LABELS[key]);

  return (
    <div className={styles.wrapper}>
      <h1 className={g.adminPageTitle}>Texter</h1>
      <p className={g.adminPageSubtitle}>Redigera texter som visas på sidan. "Skapad av" styrs i koden.</p>
      {message && (
        <p className={`${message === "Sparat." ? g.adminMessageSuccess : g.adminMessageError} ${styles.message}`}>
          {message}
        </p>
      )}
      <div className={styles.list}>
        {keys.map((key) => (
          <div key={key} className={styles.card}>
            <strong className={styles.cardTitle}>{CONTENT_LABELS[key]}</strong>
            {editingKey === key ? (
              <>
                <textarea
                  rows={6}
                  value={content[key] ?? ""}
                  onChange={(e) => setContent((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={styles.textarea}
                />
                <div className={styles.actions}>
                  <button type="button" onClick={() => handleSave(key, content[key] ?? "")} disabled={saving} className={g.adminBtnPrimary}>
                    Spara
                  </button>
                  <button type="button" onClick={() => setEditingKey(null)} className={g.adminBtnSecondary}>
                    Avbryt
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.preview}>
                  {(content[key] ?? "").slice(0, 200)}{(content[key] ?? "").length > 200 ? "..." : ""}
                </p>
                <button type="button" onClick={() => setEditingKey(key)} className={styles.editButton}>
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
