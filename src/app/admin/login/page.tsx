"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Fel e-post eller lösenord.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Logga in</h1>
        <label className={styles.label}>
          E-post
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} autoComplete="email" />
        </label>
        <label className={styles.label}>
          Lösenord
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} autoComplete="current-password" />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
    </div>
  );
}
