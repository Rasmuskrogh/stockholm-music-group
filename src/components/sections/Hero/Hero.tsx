import Section from "@/components/ui/Section/Section";
import Image from "next/image";

import styles from "./Hero.module.css";

function Hero() {
  return (
    <Section>
      <figure className={styles.heroImageWrapper}>
        <Image
          className={styles.heroImage}
          src="/images/placeholder.jpg"
          alt="Hero"
          fill
        />
      </figure>
    </Section>
  );
}

export default Hero;
