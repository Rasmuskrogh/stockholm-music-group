"use client";

import Section from "@/components/ui/Section/Section";
import styles from "./Hero.module.css";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  videoUrl?: string;
}

function Hero({ title, subtitle, ctaText, videoUrl }: HeroProps) {
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
            src={videoUrl || "/videos/hero.mp4"}
            autoPlay
            loop
            muted
            playsInline
          />
        </figure>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <h2 className={styles.heroSubtitle}>{subtitle}</h2>
        </div>
        {ctaText && (
          <Link className={styles.cta} href="#contact" onClick={handleScrollToContact}>
            <strong>{ctaText}</strong>
          </Link>
        )}
      </div>
    </Section>
  );
}

export default Hero;
