import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";
import Link from "next/link";

import styles from "./Footer.module.css";

function Footer() {
  return (
    <Section>
      {/* <Container> */}
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
      {/* </Container> */}
    </Section>
  );
}

export default Footer;
