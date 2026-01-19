import Section from "@/components/ui/Section/Section";
import Link from "next/link";
import Image from "next/image";

import styles from "./Footer.module.css";

function Footer() {
  return (
    <Section>
      <div className={styles.footerContact}>
        <span><Image src="/images/phone.svg" alt="Phone icon" width={20} height={20} /> <Link href="tel: +46701234567">Telefon</Link></span>
        <span><Image src="/images/mail.svg" alt="Mail icon" width={20} height={20} /> <Link href="mailto: stockholm@music.group">E-post</Link></span>
      </div>
      <div className={styles.footerContent}>
        <div className={styles.spacer}></div>
        <div className={styles.copyright}>
          <p>© Stockholm Music Group 2026. All rights reserved.</p>
        </div>
        <div className={styles.madeBy}>
          <p>
            Skapad av:{" "}
            <Link href="https://portfolio-page-next-js.vercel.app/">
              Rasmus Krogh-Andersen
            </Link>
          </p>
        </div>
      </div>
      
    </Section>
  );
}

export default Footer;
