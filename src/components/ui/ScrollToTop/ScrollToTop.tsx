"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ScrollToTop.module.css";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className={styles.scrollToTop}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <Image
        src="/images/arrow-up.svg"
        alt="Scroll to top"
        width={24}
        height={24}
        unoptimized
      />
    </button>
  );
}
