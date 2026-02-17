"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";

import styles from "./Bio.module.css";

const defaultBio =
  "Stockholm Music Group är en stilren och mångsidig covertrio från Stockholm som specialiserar sig på att tolka klassiker ur pop-, rock-, soul- och jazzrepertoaren. Med två distinkta sångröster – en kvinnlig och en manlig – samt ett dynamiskt samspel mellan piano och gitarr skapar trion stämningar som passar allt från intima ceremonier till större festliga sammanhang.\n\nGruppen har lång erfarenhet av att framträda vid bröllop, begravningar, dop och företagsevenemang, och är uppskattade för sin förmåga att anpassa musiken efter varje tillfälle. Oavsett om det handlar om tidlös elegans, modern energi eller personlig musik skräddarsydd för ett specifikt ögonblick levererar Stockholm Music Group alltid musik med hög kvalitet, känsla och professionalism.\n\nMed sin kombination av musikalisk värme, bred repertoar och lyhördhet inför publikens önskemål har Stockholm Music Group etablerat sig som ett givet val för evenemang där musiken får spela en viktig roll.";

function Bio() {
  const [text, setText] = useState(defaultBio);

  useEffect(() => {
    fetch("/api/content?key=bio_text")
      .then((r) => r.json())
      .then((data) => (data.value != null ? setText(data.value) : null))
      .catch(() => { });
  }, []);

  return (
    <Section>
      <Container>
        <p className={styles.text}>
          {text.split("\n\n").map((para, i) => (
            <span key={i}>
              {para}
              {i < text.split("\n\n").length - 1 && (
                <>
                  <br />
                  <br />
                </>
              )}
            </span>
          ))}
        </p>
      </Container>
    </Section>
  );
}

export default Bio;
