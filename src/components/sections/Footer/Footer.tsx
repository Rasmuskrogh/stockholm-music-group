"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section/Section";
import Link from "next/link";
import Image from "next/image";

import styles from "./Footer.module.css";

interface ContactInfo {
  email: string;
  phone: string;
}

const defaultCopyright = "© Stockholm Music Group 2026. All rights reserved.";
const defaultMadeByText = "Rasmus Krogh-Andersen";
const defaultMadeByUrl = "https://portfolio-page-next-js.vercel.app/";

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

function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [copyright, setCopyright] = useState(defaultCopyright);
  const [madeByText] = useState(defaultMadeByText);
  const [madeByUrl] = useState(defaultMadeByUrl);
  const [copied, setCopied] = useState<"phone" | "email" | null>(null);

  useEffect(() => {
    fetch("/api/contact-info")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setContactInfo(data))
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.footer_copyright) setCopyright(data.footer_copyright);
        /* madeBy-text och -url styrs enbart i koden (defaultMadeByText/defaultMadeByUrl) */
      })
      .catch(() => { });
  }, []);

  if (!contactInfo) {
    return (
      <Section>
        <div className={styles.footerContact}>
          <div className={styles.contactRow}>
            <Image src="/images/phone.svg" alt="" width={20} height={20} />
            <span>Telefon</span>
          </div>
          <div className={styles.contactRow}>
            <Image src="/images/mail.svg" alt="" width={20} height={20} />
            <span>E-post</span>
          </div>
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
          <Link href={`tel:${contactInfo.phone}`}>Telefon</Link>
          <button
            type="button"
            className={styles.copyButton}
            onClick={() => void handleCopy(contactInfo.phone, "phone")}
            aria-label="Kopiera telefonnummer"
          >
            {copied === "phone" ? "Kopierat!" : "Kopiera"}
          </button>
        </div>
        <div className={styles.contactRow}>
          <Image src="/images/mail.svg" alt="" width={20} height={20} />
          <Link href={`mailto:${contactInfo.email}`}>E-post</Link>
          <button
            type="button"
            className={styles.copyButton}
            onClick={() => void handleCopy(contactInfo.email, "email")}
            aria-label="Kopiera e-postadress"
          >
            {copied === "email" ? "Kopierat!" : "Kopiera"}
          </button>
        </div>
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
