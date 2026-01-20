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

function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contact-info");
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    };

    fetchContactInfo();
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
      
    </Section>
  );
}

export default Footer;
