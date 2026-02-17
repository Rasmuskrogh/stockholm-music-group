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

const defaultBlocks: WeddingBlock[] = [
  { subtitle: "Musik som gör ert bröllop personligt, varmt och minnesvärt", content: "Att planera ett bröllop innebär många val. Ett av de viktigaste är musiken – den som ska bära känslan genom hela dagen.\n\nStockholm Music Group hjälper er att skapa rätt stämning, utan stress eller osäkerhet. Vi är en professionell och samspelt cover-trio som guidar er från ceremoni till mingel och middag, med varm sång, personlig repertoar och en trygg helhetslösning." },
  { subtitle: "Känner ni igen er?", content: "Ni vill att musiken ska kännas ni – inte generisk. Ni vill kunna lita på att allt fungerar på dagen. Ni vill slippa krångel med ljud, upplägg och detaljer.\n\nNi ska inte behöva oroa er för musiken på ert bröllop. Det är där vi kommer in.", list: ["Ni vill att musiken ska kännas ni – inte generisk", "Ni vill kunna lita på att allt fungerar på dagen", "Ni vill slippa krångel med ljud, upplägg och detaljer"] },
  { subtitle: "Så hjälper vi er – steg för steg", steps: [{ title: "Vi lyssnar på er", text: "Era önskemål, er stil och er vision för dagen" }, { title: "Vi planerar musiken", text: "Låtval, stämning, tider och teknisk lösning – anpassat efter er." }, { title: "Vi levererar tryggt på dagen", text: "Ni kan slappna av och vara närvarande. Vi tar hand om resten." }] },
  { subtitle: "Musik för hela bröllopsdagen", items: [{ label: "🎵 Ceremoni", text: "Personliga tolkningar av era favoritlåtar – musik som förstärker ögonblicket." }, { label: "🥂 Mingel & middag", text: "Stämningsfulla akustiska set som skapar värme och ett naturligt flöde." }] },
  { subtitle: "Varför välja Stockholm Music Group?", list: ["Erfaren, samspelt och pålitlig trio", "Brett repertoarspann: pop, soul, jazz, rock, visor & svenska klassiker", "Personligt bemötande och skräddarsydda låtval", "Professionellt ljud och en smidig helhetslösning"] },
  { subtitle: "Resultatet", intro: "Ett bröllop där:", list: ["ni kan vara helt närvarande", "gästerna känner stämningen", "musiken blir en naturlig del av minnet"], outro: "vi guidar er till ett bröllop som känns lika bra som det låter." },
];

function Wedding() {
  const [blocks, setBlocks] = useState<WeddingBlock[]>(defaultBlocks);
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
