"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import g from "../AdminGlobal.module.css";

// Samma struktur som Wedding.tsx för att spara/visa
type WeddingBlock = {
  subtitle?: string;
  content?: string;
  list?: string[];
  steps?: { title: string; text: string }[];
  items?: { label: string; text: string }[];
  intro?: string;
  outro?: string;
};

type BlockType = "text" | "text_list" | "list" | "steps" | "items" | "intro_outro";

function inferBlockType(b: WeddingBlock): BlockType {
  if (b.steps?.length) return "steps";
  if (b.items?.length) return "items";
  if (b.intro && b.outro !== undefined) return "intro_outro";
  if (b.list?.length && b.content) return "text_list";
  if (b.list?.length) return "list";
  return "text";
}

function blockToEdit(b: WeddingBlock) {
  return {
    subtitle: b.subtitle ?? "",
    type: inferBlockType(b),
    content: b.content ?? "",
    listText: (b.list ?? []).join("\n"),
    steps: b.steps ?? [],
    items: b.items ?? [],
    intro: b.intro ?? "",
    outro: b.outro ?? "",
  };
}

function editToBlock(e: ReturnType<typeof blockToEdit>): WeddingBlock {
  const block: WeddingBlock = { subtitle: e.subtitle || undefined };
  if (e.type === "text") {
    if (e.content) block.content = e.content;
  } else if (e.type === "text_list") {
    if (e.content) block.content = e.content;
    if (e.listText.trim()) block.list = e.listText.trim().split("\n").map((s) => s.trim()).filter(Boolean);
  } else if (e.type === "list") {
    if (e.listText.trim()) block.list = e.listText.trim().split("\n").map((s) => s.trim()).filter(Boolean);
  } else if (e.type === "steps") {
    if (e.steps.length) block.steps = e.steps.filter((s) => s.title.trim() || s.text.trim()).map((s) => ({ title: s.title.trim(), text: s.text.trim() }));
  } else if (e.type === "items") {
    if (e.items.length) block.items = e.items.filter((i) => i.label.trim() || i.text.trim()).map((i) => ({ label: i.label.trim(), text: i.text.trim() }));
  } else if (e.type === "intro_outro") {
    if (e.intro) block.intro = e.intro;
    if (e.listText.trim()) block.list = e.listText.trim().split("\n").map((s) => s.trim()).filter(Boolean);
    if (e.outro) block.outro = e.outro;
  }
  return block;
}

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  text: "Text",
  text_list: "Text + lista",
  list: "Lista",
  steps: "Steg",
  items: "Punkter (etikett + text)",
  intro_outro: "Intro + lista + outro",
};

export default function AdminWeddingPage() {
  const [blocks, setBlocks] = useState<ReturnType<typeof blockToEdit>[]>([]);
  const [cta, setCta] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        try {
          const raw = data.wedding_blocks;
          const arr = raw ? JSON.parse(raw) : [];
          setBlocks(Array.isArray(arr) ? arr.map((b: WeddingBlock) => blockToEdit(b)) : []);
        } catch {
          setBlocks([]);
        }
        setCta(data.wedding_cta ?? "👉 Kontakta oss för lediga datum");
      })
      .catch(() => setMessage("Kunde inte ladda."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const outBlocks = blocks.map(editToBlock);
      const resBlocks = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "wedding_blocks", value: JSON.stringify(outBlocks) }),
      });
      const resCta = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "wedding_cta", value: cta }),
      });
      setMessage(resBlocks.ok && resCta.ok ? "Sparat." : "Kunde inte spara.");
    } catch {
      setMessage("Kunde inte spara.");
    } finally {
      setSaving(false);
    }
  }

  function updateBlock(i: number, upd: Partial<ReturnType<typeof blockToEdit>>) {
    setBlocks((prev) => prev.map((b, j) => (j === i ? { ...b, ...upd } : b)));
  }

  function addBlock() {
    setBlocks((prev) => [...prev, blockToEdit({ subtitle: "" })]);
  }

  function removeBlock(i: number) {
    if (!confirm("Ta bort detta block?")) return;
    setBlocks((prev) => prev.filter((_, j) => j !== i));
  }

  function addStep(i: number) {
    setBlocks((prev) =>
      prev.map((b, j) =>
        j === i ? { ...b, steps: [...(b.steps ?? []), { title: "", text: "" }] } : b
      )
    );
  }
  function updateStep(blockIdx: number, stepIdx: number, field: "title" | "text", value: string) {
    setBlocks((prev) =>
      prev.map((b, j) => {
        if (j !== blockIdx || !b.steps) return b;
        const next = [...b.steps];
        next[stepIdx] = { ...next[stepIdx], [field]: value };
        return { ...b, steps: next };
      })
    );
  }
  function removeStep(blockIdx: number, stepIdx: number) {
    setBlocks((prev) =>
      prev.map((b, j) =>
        j === blockIdx && b.steps
          ? { ...b, steps: b.steps.filter((_, k) => k !== stepIdx) }
          : b
      )
    );
  }

  function addItem(blockIdx: number) {
    setBlocks((prev) =>
      prev.map((b, j) =>
        j === blockIdx ? { ...b, items: [...(b.items ?? []), { label: "", text: "" }] } : b
      )
    );
  }
  function updateItem(blockIdx: number, itemIdx: number, field: "label" | "text", value: string) {
    setBlocks((prev) =>
      prev.map((b, j) => {
        if (j !== blockIdx || !b.items) return b;
        const next = [...b.items];
        next[itemIdx] = { ...next[itemIdx], [field]: value };
        return { ...b, items: next };
      })
    );
  }
  function removeItem(blockIdx: number, itemIdx: number) {
    setBlocks((prev) =>
      prev.map((b, j) =>
        j === blockIdx && b.items
          ? { ...b, items: b.items.filter((_, k) => k !== itemIdx) }
          : b
      )
    );
  }

  if (loading) return <p className={g.adminLoading}>Laddar...</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={g.adminPageTitle}>Bröllop</h1>
      <p className={g.adminPageSubtitle}>
        Redigera blocken i bröllopssektionen. Välj typ för varje block och fyll i fälten.
      </p>
      {message && (
        <p className={`${message === "Sparat." ? g.adminMessageSuccess : g.adminMessageError} ${styles.message}`}>
          {message}
        </p>
      )}

      <div className={styles.ctaSection}>
        <label className={g.adminLabel}>Knapptext under sektionen (CTA)</label>
        <input
          type="text"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          className={g.adminInput}
          placeholder="👉 Kontakta oss för lediga datum"
        />
      </div>

      <div className={styles.blockList}>
        {blocks.map((block, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Block {i + 1}</h3>
              <button type="button" onClick={() => removeBlock(i)} className={g.adminBtnDanger}>
                Ta bort block
              </button>
            </div>
            <div className={styles.formRow}>
              <label className={g.adminLabel}>Underrubrik</label>
              <input
                type="text"
                value={block.subtitle}
                onChange={(e) => updateBlock(i, { subtitle: e.target.value })}
                className={g.adminInput}
                placeholder="T.ex. Rubrik för detta block"
              />
            </div>
            <div className={styles.formRow}>
              <label className={g.adminLabel}>Typ av innehåll</label>
              <select
                value={block.type}
                onChange={(e) => updateBlock(i, { type: e.target.value as BlockType })}
                className={g.adminInput}
              >
                {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((t) => (
                  <option key={t} value={t}>{BLOCK_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            {(block.type === "text" || block.type === "text_list") && (
              <div className={styles.formRow}>
                <label className={g.adminLabel}>Brödtext (radbryt = nytt stycke)</label>
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(i, { content: e.target.value })}
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            )}

            {(block.type === "text_list" || block.type === "list") && (
              <div className={styles.formRow}>
                <label className={g.adminLabel}>Lista (en rad = en punkt)</label>
                <textarea
                  value={block.listText}
                  onChange={(e) => updateBlock(i, { listText: e.target.value })}
                  className={styles.textarea}
                  rows={5}
                  placeholder="Punkt 1&#10;Punkt 2&#10;Punkt 3"
                />
              </div>
            )}

            {block.type === "steps" && (
              <div className={styles.formRow}>
                <label className={g.adminLabel}>Steg</label>
                {(block.steps ?? []).map((step, k) => (
                  <div key={k} className={styles.stepRow}>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(i, k, "title", e.target.value)}
                      className={g.adminInput}
                      placeholder="Titel"
                    />
                    <input
                      type="text"
                      value={step.text}
                      onChange={(e) => updateStep(i, k, "text", e.target.value)}
                      className={g.adminInput}
                      placeholder="Text"
                    />
                    <button type="button" onClick={() => removeStep(i, k)} className={g.adminBtnDanger}>
                      Ta bort
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addStep(i)} className={g.adminBtnSecondary}>
                  + Lägg till steg
                </button>
              </div>
            )}

            {block.type === "items" && (
              <div className={styles.formRow}>
                <label className={g.adminLabel}>Punkter (etikett + text)</label>
                {(block.items ?? []).map((item, k) => (
                  <div key={k} className={styles.itemRow}>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(i, k, "label", e.target.value)}
                      className={g.adminInput}
                      placeholder="Etikett (t.ex. 🎵 Ceremoni)"
                    />
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateItem(i, k, "text", e.target.value)}
                      className={g.adminInput}
                      placeholder="Text"
                    />
                    <button type="button" onClick={() => removeItem(i, k)} className={g.adminBtnDanger}>
                      Ta bort
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addItem(i)} className={g.adminBtnSecondary}>
                  + Lägg till punkt
                </button>
              </div>
            )}

            {block.type === "intro_outro" && (
              <>
                <div className={styles.formRow}>
                  <label className={g.adminLabel}>Intro (text före listan)</label>
                  <input
                    type="text"
                    value={block.intro}
                    onChange={(e) => updateBlock(i, { intro: e.target.value })}
                    className={g.adminInput}
                    placeholder="T.ex. Ett bröllop där:"
                  />
                </div>
                <div className={styles.formRow}>
                  <label className={g.adminLabel}>Lista (en rad = en punkt)</label>
                  <textarea
                    value={block.listText}
                    onChange={(e) => updateBlock(i, { listText: e.target.value })}
                    className={styles.textarea}
                    rows={4}
                  />
                </div>
                <div className={styles.formRow}>
                  <label className={g.adminLabel}>Outro (avslutande text)</label>
                  <input
                    type="text"
                    value={block.outro}
                    onChange={(e) => updateBlock(i, { outro: e.target.value })}
                    className={g.adminInput}
                    placeholder="T.ex. Avslutande text"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.blockActions}>
        <button type="button" onClick={addBlock} className={g.adminBtnSecondary}>
          + Lägg till block
        </button>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleSave} disabled={saving} className={g.adminBtnPrimary}>
          {saving ? "Sparar..." : "Spara alla block och CTA"}
        </button>
      </div>
    </div>
  );
}
