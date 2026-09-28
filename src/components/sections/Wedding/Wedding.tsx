import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";
import styles from "./Wedding.module.css";
import Link from "next/link";
import type { ContentBlock, CtaBlock } from "@/types";

function Wedding({ blocks }: { blocks: (ContentBlock | CtaBlock)[] }) {
  if (blocks.length === 0) return null;

  return (
    <Section>
      <Container>
        {blocks.map((block) =>
          block._type === "ctaBlock" ? (
            <div key={block._key} className={styles.ctaWrapper}>
              <Link className={styles.cta} href="#contact">{block.text}</Link>
            </div>
          ) : (
            <div key={block._key} className={styles.block}>
              {block.subtitle && <h3 className={styles.subtitle}>{block.subtitle}</h3>}
              {block.content && <p className={styles.text}>{block.content.split("\n").map((line, j) => <span key={j}>{line}<br /></span>)}</p>}
              {block.intro && <p className={styles.text}>{block.intro}</p>}
              {block.list && (
                <ul className={styles.list}>
                  {block.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
              {block.steps && (
                <ol className={styles.list}>
                  {block.steps.map((step) => (
                    <li key={step._key}><strong>{step.title}</strong><br />{step.text}</li>
                  ))}
                </ol>
              )}
              {block.items?.map((item) => (
                <p key={item._key} className={styles.text}><strong>{item.label}</strong> <br /> {item.text}</p>
              ))}
              {block.outro && <p className={styles.text}>{block.outro}</p>}
            </div>
          )
        )}
      </Container>
    </Section>
  );
}

export default Wedding;
