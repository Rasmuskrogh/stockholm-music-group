import Section from "@/components/ui/Section/Section";
import Image from "next/image";

import styles from "./Hero.module.css";

function Hero() {
  return (
    <Section>
      <div className={styles.heroWrapper}>
        <figure className={styles.heroImageWrapper}>
          <Image
            className={styles.heroImage}
            src="/images/placeholder2.jpg"
            alt="Hero"
            fill
          />
        </figure>
      </div>
    </Section>
  );
}

export default Hero;
