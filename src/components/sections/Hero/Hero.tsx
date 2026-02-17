"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section/Section";
import styles from "./Hero.module.css";
import Link from "next/link";

const defaultHero = { videoUrl: "/videos/hero.mp4", title: "Stockholm", subtitle: "Music Group", ctaText: "BOKA OSS" };

function Hero() {
  const [hero, setHero] = useState(defaultHero);
  useEffect(() => {
    fetch("/api/hero").then((r) => r.json()).then((d) => setHero({ ...defaultHero, ...d })).catch(() => { });
  }, []);

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Section>
      <div className={styles.heroWrapper}>
        <figure className={styles.heroImageWrapper}>
          <video
            className={styles.heroVideo}
            src="/videos/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </figure>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{hero.title ?? defaultHero.title}</h1>
          <h2 className={styles.heroSubtitle}>{hero.subtitle ?? defaultHero.subtitle}</h2>
        </div>
        <Link className={styles.cta} href="#contact" onClick={handleScrollToContact}>
          <strong>{hero.ctaText ?? defaultHero.ctaText}</strong>
        </Link>
      </div>
    </Section>
  );
}

export default Hero;
