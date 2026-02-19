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

type CtaBlock = { type: "cta"; text: string };

function isCtaBlock(b: WeddingBlock | CtaBlock): b is CtaBlock {
  return "type" in b && b.type === "cta";
}

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

type BlockItem = { kind: "content"; data: ReturnType<typeof blockToEdit> } | { kind: "cta"; data: CtaBlock };

export default function AdminWeddingPage() {
  const [items, setItems] = useState<BlockItem[]>([]);
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
          const list = Array.isArray(arr) ? arr : [];
          const parsed: BlockItem[] = [];
          for (const b of list) {
            if (isCtaBlock(b)) {
              parsed.push({ kind: "cta", data: { type: "cta", text: b.text ?? "" } });
            } else {
              parsed.push({ kind: "content", data: blockToEdit(b) });
            }
          }
          const hasCta = parsed.some((it) => it.kind === "cta");
          if (!hasCta && data.wedding_cta) {
            parsed.push({ kind: "cta", data: { type: "cta", text: data.wedding_cta } });
          }
          setItems(parsed);
        } catch {
          setItems([]);
        }
      })
      .catch(() => setMessage("Kunde inte ladda."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const outBlocks: (WeddingBlock | CtaBlock)[] = items.map((it) =>
        it.kind === "cta" ? it.data : editToBlock(it.data)
      );
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "wedding_blocks", value: JSON.stringify(outBlocks) }),
      });
      setMessage(res.ok ? "Sparat." : "Kunde inte spara.");
    } catch {
      setMessage("Kunde inte spara.");
    } finally {
      setSaving(false);
    }
  }

  function moveBlock(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function updateBlock(i: number, upd: Partial<ReturnType<typeof blockToEdit>>) {
    setItems((prev) =>
      prev.map((it, j) => (j === i && it.kind === "content" ? { kind: "content" as const, data: { ...it.data, ...upd } } : it))
    );
  }

  function updateCtaBlock(i: number, text: string) {
    setItems((prev) =>
      prev.map((it, j) => (j === i && it.kind === "cta" ? { kind: "cta" as const, data: { type: "cta", text } } : it))
    );
  }

  function addBlock() {
    setItems((prev) => [...prev, { kind: "content", data: blockToEdit({ subtitle: "" }) }]);
  }

  function addCtaBlock() {
    setItems((prev) => [...prev, { kind: "cta", data: { type: "cta", text: "👉 Kontakta oss för lediga datum" } }]);
  }

  function removeBlock(i: number) {
    if (!confirm("Ta bort detta block?")) return;
    setItems((prev) => prev.filter((_, j) => j !== i));
  }

  function addStep(blockIdx: number) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== blockIdx || it.kind !== "content") return it;
        return { kind: "content" as const, data: { ...it.data, steps: [...(it.data.steps ?? []), { title: "", text: "" }] } };
      })
    );
  }
  function updateStep(blockIdx: number, stepIdx: number, field: "title" | "text", value: string) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== blockIdx || it.kind !== "content" || !it.data.steps) return it;
        const steps = [...it.data.steps];
        steps[stepIdx] = { ...steps[stepIdx], [field]: value };
        return { kind: "content" as const, data: { ...it.data, steps } };
      })
    );
  }
  function removeStep(blockIdx: number, stepIdx: number) {
    setItems((prev) =>
      prev.map((it, j) =>
        j === blockIdx && it.kind === "content" && it.data.steps
          ? { kind: "content" as const, data: { ...it.data, steps: it.data.steps.filter((_, k) => k !== stepIdx) } }
          : it
      )
    );
  }

  function addItem(blockIdx: number) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== blockIdx || it.kind !== "content") return it;
        return { kind: "content" as const, data: { ...it.data, items: [...(it.data.items ?? []), { label: "", text: "" }] } };
      })
    );
  }
  function updateItem(blockIdx: number, itemIdx: number, field: "label" | "text", value: string) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== blockIdx || it.kind !== "content" || !it.data.items) return it;
        const items = [...it.data.items];
        items[itemIdx] = { ...items[itemIdx], [field]: value };
        return { kind: "content" as const, data: { ...it.data, items } };
      })
    );
  }
  function removeItem(blockIdx: number, itemIdx: number) {
    setItems((prev) =>
      prev.map((it, j) =>
        j === blockIdx && it.kind === "content" && it.data.items
          ? { kind: "content" as const, data: { ...it.data, items: it.data.items.filter((_, k) => k !== itemIdx) } }
          : it
      )
    );
  }

  if (loading) return <p className={g.adminLoading}>Laddar...</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={g.adminPageTitle}>Innehållssektion</h1>
      <p className={g.adminPageSubtitle}>
        Ordningen här styr hur blocken visas på sidan. CTA-knappen är ett block som du kan flytta, lägga till eller ta bort.
      </p>
      {message && (
        <p className={`${message === "Sparat." ? g.adminMessageSuccess : g.adminMessageError} ${styles.message}`}>
          {message}
        </p>
      )}

      <div className={styles.blockList}>
        {items.map((item, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <span className={styles.orderButtons}>
                  <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className={g.adminBtnSecondary} title="Flytta upp">↑</button>
                  <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === items.length - 1} className={g.adminBtnSecondary} title="Flytta ned">↓</button>
                </span>
                <h3 className={styles.cardTitle}>
                  {item.kind === "cta" ? "CTA-knapp" : `Block ${items.slice(0, i).filter((x) => x.kind === "content").length + 1}`}
                </h3>
              </div>
              <button type="button" onClick={() => removeBlock(i)} className={g.adminBtnDanger}>
                Ta bort block
              </button>
            </div>

            {item.kind === "cta" ? (
              <div className={styles.formRow}>
                <label className={g.adminLabel}>Knapptext</label>
                <input
                  type="text"
                  value={item.data.text}
                  onChange={(e) => updateCtaBlock(i, e.target.value)}
                  className={g.adminInput}
                  placeholder="👉 Kontakta oss för lediga datum"
                />
              </div>
            ) : (
              <>
                <div className={styles.formRow}>
                  <label className={g.adminLabel}>Underrubrik</label>
                  <input
                    type="text"
                    value={item.data.subtitle}
                    onChange={(e) => updateBlock(i, { subtitle: e.target.value })}
                    className={g.adminInput}
                    placeholder="T.ex. Rubrik för detta block"
                  />
                </div>
                <div className={styles.formRow}>
                  <label className={g.adminLabel}>Typ av innehåll</label>
                  <select
                    value={item.data.type}
                    onChange={(e) => updateBlock(i, { type: e.target.value as BlockType })}
                    className={g.adminInput}
                  >
                    {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((t) => (
                      <option key={t} value={t}>{BLOCK_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </div>

                {(item.data.type === "text" || item.data.type === "text_list") && (
                  <div className={styles.formRow}>
                    <label className={g.adminLabel}>Brödtext (radbryt = nytt stycke)</label>
                    <textarea
                      value={item.data.content}
                      onChange={(e) => updateBlock(i, { content: e.target.value })}
                      className={styles.textarea}
                      rows={4}
                    />
                  </div>
                )}

                {(item.data.type === "text_list" || item.data.type === "list") && (
                  <div className={styles.formRow}>
                    <label className={g.adminLabel}>Lista (en rad = en punkt)</label>
                    <textarea
                      value={item.data.listText}
                      onChange={(e) => updateBlock(i, { listText: e.target.value })}
                      className={styles.textarea}
                      rows={5}
                      placeholder="Punkt 1&#10;Punkt 2&#10;Punkt 3"
                    />
                  </div>
                )}

                {item.data.type === "steps" && (
                  <div className={styles.formRow}>
                    <label className={g.adminLabel}>Steg</label>
                    {(item.data.steps ?? []).map((step, k) => (
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
                        <button type="button" onClick={() => removeStep(i, k)} className={g.adminBtnDanger}>Ta bort</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addStep(i)} className={g.adminBtnSecondary}>+ Lägg till steg</button>
                  </div>
                )}

                {item.data.type === "items" && (
                  <div className={styles.formRow}>
                    <label className={g.adminLabel}>Punkter (etikett + text)</label>
                    {(item.data.items ?? []).map((itemRow, k) => (
                      <div key={k} className={styles.itemRow}>
                        <input
                          type="text"
                          value={itemRow.label}
                          onChange={(e) => updateItem(i, k, "label", e.target.value)}
                          className={g.adminInput}
                          placeholder="Etikett (t.ex. 🎵 Ceremoni)"
                        />
                        <input
                          type="text"
                          value={itemRow.text}
                          onChange={(e) => updateItem(i, k, "text", e.target.value)}
                          className={g.adminInput}
                          placeholder="Text"
                        />
                        <button type="button" onClick={() => removeItem(i, k)} className={g.adminBtnDanger}>Ta bort</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addItem(i)} className={g.adminBtnSecondary}>+ Lägg till punkt</button>
                  </div>
                )}

                {item.data.type === "intro_outro" && (
                  <>
                    <div className={styles.formRow}>
                      <label className={g.adminLabel}>Intro (text före listan)</label>
                      <input
                        type="text"
                        value={item.data.intro}
                        onChange={(e) => updateBlock(i, { intro: e.target.value })}
                        className={g.adminInput}
                        placeholder="T.ex. Ett bröllop där:"
                      />
                    </div>
                    <div className={styles.formRow}>
                      <label className={g.adminLabel}>Lista (en rad = en punkt)</label>
                      <textarea
                        value={item.data.listText}
                        onChange={(e) => updateBlock(i, { listText: e.target.value })}
                        className={styles.textarea}
                        rows={4}
                      />
                    </div>
                    <div className={styles.formRow}>
                      <label className={g.adminLabel}>Outro (avslutande text)</label>
                      <input
                        type="text"
                        value={item.data.outro}
                        onChange={(e) => updateBlock(i, { outro: e.target.value })}
                        className={g.adminInput}
                        placeholder="T.ex. Avslutande text"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.blockActions}>
        <button type="button" onClick={addBlock} className={g.adminBtnSecondary}>+ Lägg till innehållsblock</button>
        <button type="button" onClick={addCtaBlock} className={g.adminBtnSecondary}>+ Lägg till CTA-block</button>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleSave} disabled={saving} className={g.adminBtnPrimary}>
          {saving ? "Sparar..." : "Spara ordning och innehåll"}
        </button>
      </div>
    </div>
  );
}
