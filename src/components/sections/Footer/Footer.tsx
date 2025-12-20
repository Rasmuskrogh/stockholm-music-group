import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";

import styles from "./Footer.module.css";

function Footer() {
  return (
    <Section>
      <Container>
        <p className={styles.copyright}>
          © Stockholm Music Group 2026. All rights reserved.
        </p>
      </Container>
    </Section>
  );
}

export default Footer;
