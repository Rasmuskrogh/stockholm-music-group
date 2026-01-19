import Section from "@/components/ui/Section/Section";
import Image from "next/image";

import styles from "./Hero.module.css";
import Link from "next/link";

function Hero() {
  return (
    <Section>
      <div className={styles.heroWrapper}>
        <figure className={styles.heroImageWrapper}>
          {/* <Image
            className={styles.heroImage}
            src="/images/placeholder2.jpg"
            alt="Hero"
            fill
          /> */}
          <video
            className={styles.heroVideo}
            src="/videos/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </figure>
        <div>
        <h1>Stockholm</h1>
        <h3>Music Group</h3>
        </div>
        {/* <Image
          className={styles.logo}
          src="/images/SMGLogo.svg"
          alt="Logo"
          width={150}
          height={300}
        /> */}
        <Link className={styles.cta} href="/">
          BOKA OSS
        </Link>
      </div>
    </Section>
  );
}

export default Hero;
