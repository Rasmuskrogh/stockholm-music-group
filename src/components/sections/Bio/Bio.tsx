import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";

import styles from "./Bio.module.css";

function Bio({ text }: { text?: string }) {
  if (!text) return null;
  const paragraphs = text.split("\n\n");

  return (
    <Section>
      <Container>
        <p className={styles.text}>
          {paragraphs.map((para, i) => (
            <span key={i}>
              {para}
              {i < paragraphs.length - 1 && (
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
