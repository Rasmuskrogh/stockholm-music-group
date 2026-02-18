"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import g from "../AdminGlobal.module.css";

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

  if (loading) return <p className={g.adminLoading}>Laddar...</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={g.adminPageTitle}>Media (videor)</h1>
      <p className={g.adminPageSubtitle}>Hantera videor som visas i media-sektionen.</p>
      {message && (
        <p className={`${message.includes("Kunde") ? g.adminMessageError : g.adminMessageSuccess} ${styles.message}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleAdd} className={styles.addForm}>
        <h2 className={styles.addFormTitle}>Lägg till video</h2>
        <input type="text" placeholder="Kompositör" value={composer} onChange={(e) => setComposer(e.target.value)} className={styles.addFormInput} />
        <input type="text" placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.addFormInput} />
        <input type="text" placeholder="YouTube ID (t.ex. gWM82gyJuqM)" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} className={styles.addFormInput} />
        <button type="submit" className={`${g.adminBtnPrimary} ${styles.addButton}`}>Lägg till</button>
      </form>

      <section className={styles.section}>
        <h2 className={styles.videoListTitle}>Nuvarande videor</h2>
        <ul className={styles.videoList}>
          {videos.map((v) => (
            <li key={v.id} className={styles.videoItem}>
              <span>{v.composer} – {v.title}</span>
              <button type="button" onClick={() => handleDelete(v.id)} className={styles.deleteButton}>
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
