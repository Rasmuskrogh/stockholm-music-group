import styles from "./Section.module.css";
import { SectionProps } from "@/types";

export default function Section({ id, children }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      {children}
    </section>
  );
}
