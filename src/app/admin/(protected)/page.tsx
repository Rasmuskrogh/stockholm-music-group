import styles from "./page.module.css";

export default function AdminDashboardPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.mainTitle}>Översikt</h1>
      <p className={styles.mainText}>
        Välj en sektion i menyn för att redigera innehållet på sidan.
      </p>
    </div>
  );
}
