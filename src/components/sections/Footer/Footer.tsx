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

function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [copyright, setCopyright] = useState(defaultCopyright);
  const [madeByText, setMadeByText] = useState(defaultMadeByText);
  const [madeByUrl, setMadeByUrl] = useState(defaultMadeByUrl);

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
        if (data.footer_madeby_text) setMadeByText(data.footer_madeby_text);
        if (data.footer_madeby_url) setMadeByUrl(data.footer_madeby_url);
      })
      .catch(() => { });
  }, []);

  if (!contactInfo) {
    return (
      <Section>
        <div className={styles.footerContact}>
          <span><Image src="/images/phone.svg" alt="Phone icon" width={20} height={20} /> <span>Telefon</span></span>
          <span><Image src="/images/mail.svg" alt="Mail icon" width={20} height={20} /> <span>E-post</span></span>
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

  return (
    <Section>
      <div className={styles.footerContact}>
        <span><Image src="/images/phone.svg" alt="Phone icon" width={20} height={20} /> <Link href={`tel:${contactInfo.phone}`}>Telefon</Link></span>
        <span><Image src="/images/mail.svg" alt="Mail icon" width={20} height={20} /> <Link href={`mailto:${contactInfo.email}`}>E-post</Link></span>
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
