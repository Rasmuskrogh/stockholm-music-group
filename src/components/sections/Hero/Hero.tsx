"use client";

import Section from "@/components/ui/Section/Section";
import Image from "next/image";

import styles from "./Hero.module.css";
import Link from "next/link";

function Hero() {
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
          <h1 className={styles.heroTitle}>Stockholm</h1>
          <h2 className={styles.heroSubtitle}>Music Group</h2>
        </div>
        <Link className={styles.cta} href="#contact" onClick={handleScrollToContact}>
          <strong>BOKA OSS</strong>
        </Link>
      </div>
    </Section>
  );
}

export default Hero;
