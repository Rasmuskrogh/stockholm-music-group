"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";
import styles from "./Wedding.module.css";
import Link from "next/link";

type WeddingBlock = {
  subtitle?: string;
  content?: string;
  list?: string[];
  steps?: { title: string; text: string }[];
  items?: { label: string; text: string }[];
  intro?: string;
  outro?: string;
};

const defaultCta = "👉 Kontakta oss för lediga datum";

function Wedding() {
  const [blocks, setBlocks] = useState<WeddingBlock[]>([]);
  const [cta, setCta] = useState(defaultCta);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        try {
          if (data.wedding_blocks) setBlocks(JSON.parse(data.wedding_blocks));
        } catch { }
        if (data.wedding_cta) setCta(data.wedding_cta);
      })
      .catch(() => { });
  }, []);

  if (blocks.length === 0) {
    return (
      <Section>
        <Container>
          <div className={styles.ctaWrapper}>
            <Link className={styles.cta} href="#contact">{defaultCta}</Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        {blocks.map((block, i) => (
          <div key={i} className={styles.block}>
            {block.subtitle && <h3 className={styles.subtitle}>{block.subtitle}</h3>}
            {block.content && <p className={styles.text}>{block.content.split("\n").map((line, j) => <span key={j}>{line}<br /></span>)}</p>}
            {block.intro && <p className={styles.text}>{block.intro}</p>}
            {block.list && (
              <ul className={styles.list}>
                {block.list.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
            {block.steps && (
              <ol className={styles.list}>
                {block.steps.map((step, j) => (
                  <li key={j}><strong>{step.title}</strong><br />{step.text}</li>
                ))}
              </ol>
            )}
            {block.items?.map((item, j) => (
              <p key={j} className={styles.text}><strong>{item.label}</strong> <br /> {item.text}</p>
            ))}
            {block.outro && <p className={styles.text}><strong>Stockholm Music Group</strong> – {block.outro}</p>}
          </div>
        ))}
        <div className={styles.ctaWrapper}>
          <Link className={styles.cta} href="#contact">{cta}</Link>
        </div>
      </Container>
    </Section>
  );
}

export default Wedding;
