"use client";

import { useState } from "react";
import Section from "@/components/ui/Section/Section";
import Link from "next/link";
import Image from "next/image";

import type { FooterDocument } from "@/types";
import styles from "./Footer.module.css";

interface FooterProps {
  email?: string;
  phone?: string;
  documents?: FooterDocument[];
  copyright?: string;
}

const madeByText = "Rasmus Krogh-Andersen";
const madeByUrl = "https://www.kroghdev.se/";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function Footer({ email, phone, documents = [], copyright }: FooterProps) {
  const [copied, setCopied] = useState<"phone" | "email" | null>(null);

  const handleCopy = async (value: string, kind: "phone" | "email") => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Section>
      <div className={styles.footerContact}>
        <div className={styles.contactRow}>
          <Image src="/images/phone.svg" alt="" width={20} height={20} />
          {phone ? (
            <>
              <Link href={`tel:${phone}`}>Telefon</Link>
              <button
                type="button"
                className={styles.copyButton}
                onClick={() => void handleCopy(phone, "phone")}
                aria-label="Kopiera telefonnummer"
              >
                {copied === "phone" ? "Kopierat!" : "Kopiera"}
              </button>
            </>
          ) : (
            <span>Telefon</span>
          )}
        </div>
        <div className={styles.contactRow}>
          <Image src="/images/mail.svg" alt="" width={20} height={20} />
          {email ? (
            <>
              <Link href={`mailto:${email}`}>E-post</Link>
              <button
                type="button"
                className={styles.copyButton}
                onClick={() => void handleCopy(email, "email")}
                aria-label="Kopiera e-postadress"
              >
                {copied === "email" ? "Kopierat!" : "Kopiera"}
              </button>
            </>
          ) : (
            <span>E-post</span>
          )}
        </div>
        {documents.length ? (
          <div className={styles.documents}>
            {/* PDFs uploaded under Inställningar → Dokument i footern; open in a new tab. */}
            {documents.map((doc) => (
              <a
                key={doc._key}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentButton}
              >
                {doc.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.footerContent}>
        <div className={styles.spacer}></div>
        <div className={styles.copyright}><p>{copyright}</p></div>
        <div className={styles.madeBy}>
          <p>Skapad av: <Link href={madeByUrl}>{madeByText}</Link></p>
        </div>
      </div>
    </Section>
  );
}

export default Footer;
