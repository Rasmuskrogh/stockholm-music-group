"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import g from "../AdminGlobal.module.css";

type GalleryItem = {
  publicId: string;
  url: string;
  width: number;
  height: number;
  displayName: string;
  sortOrder: number;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDisplayName, setUploadDisplayName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  function load() {
    fetch("/api/admin/gallery")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed"))))
      .then(setItems)
      .catch(() => setMessage("Kunde inte ladda galleriet."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile) {
      setMessage("Välj en bild att ladda upp.");
      return;
    }
    setMessage("");
    setUploading(true);
    const formData = new FormData();
    formData.set("file", uploadFile);
    if (uploadDisplayName.trim()) formData.set("displayName", uploadDisplayName.trim());
    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
      if (res.ok) {
        setUploadFile(null);
        setUploadDisplayName("");
        load();
        setMessage("Bilden laddades upp.");
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Kunde inte ladda upp.");
      }
    } catch {
      setMessage("Kunde inte ladda upp.");
    } finally {
      setUploading(false);
    }
  }

  function startEdit(item: GalleryItem) {
    setEditingId(item.publicId);
    setEditName(item.displayName);
  }

  async function saveEdit(publicId: string) {
    setEditingId(null);
    setMessage("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, displayName: editName }),
      });
      if (res.ok) load();
      else setMessage("Kunde inte spara visningsnamn.");
    } catch {
      setMessage("Kunde inte spara.");
    }
  }

  async function handleDelete(publicId: string) {
    if (!confirm("Ta bort denna bild från galleriet? (Bilden tas bort från Cloudinary.)")) return;
    setMessage("");
    const res = await fetch(`/api/admin/gallery?publicId=${encodeURIComponent(publicId)}`, { method: "DELETE" });
    if (res.ok) {
      load();
      setMessage("Bilden borttagen.");
    } else setMessage("Kunde inte ta bort.");
  }

  if (loading) return <p className={g.adminLoading}>Laddar...</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={g.adminPageTitle}>Galleri</h1>
      <p className={g.adminPageSubtitle}>Ladda upp bilder och sätt visningsnamn som visas i modalen.</p>
      {message && (
        <p className={`${message.includes("Kunde") ? g.adminMessageError : g.adminMessageSuccess} ${styles.message}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleUpload} className={styles.uploadForm}>
        <h2 className={styles.formTitle}>Ladda upp bild</h2>
        <div className={styles.formRow}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            className={styles.fileInput}
          />
        </div>
        <div className={styles.formRow}>
          <label className={g.adminLabel}>Visningsnamn (valfritt)</label>
          <input
            type="text"
            placeholder="T.ex. Konsert 2024"
            value={uploadDisplayName}
            onChange={(e) => setUploadDisplayName(e.target.value)}
            className={g.adminInput}
          />
        </div>
        <button type="submit" className={`${g.adminBtnPrimary} ${styles.submitBtn}`} disabled={uploading}>
          {uploading ? "Laddar upp…" : "Ladda upp"}
        </button>
      </form>

      <section className={styles.section}>
        <h2 className={styles.listTitle}>Bilder i galleriet</h2>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.publicId} className={styles.item}>
              <div className={styles.thumb}>
                <img src={item.url} alt={item.displayName || item.publicId} width={80} height={80} />
              </div>
              <div className={styles.meta}>
                {editingId === item.publicId ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={g.adminInput}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(item.publicId);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button type="button" onClick={() => saveEdit(item.publicId)} className={g.adminBtnPrimary}>
                      Spara
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className={g.adminBtnSecondary}>
                      Avbryt
                    </button>
                  </>
                ) : (
                  <>
                    <span className={styles.displayName}>{item.displayName || "(inget visningsnamn)"}</span>
                    <button type="button" onClick={() => startEdit(item)} className={g.adminBtnSecondary}>
                      Redigera namn
                    </button>
                  </>
                )}
              </div>
              <button type="button" onClick={() => handleDelete(item.publicId)} className={g.adminBtnDanger}>
                Ta bort
              </button>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p className={styles.empty}>Inga bilder i galleriet än.</p>}
      </section>
    </div>
  );
}
