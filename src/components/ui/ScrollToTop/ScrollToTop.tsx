"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ScrollToTop.module.css";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Kolla om användaren är nära botten (bara på skärmar under 500px)
      if (window.innerWidth <= 500) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
        
        // 5rem = 80px (om 1rem = 16px)
        // Om det är 5rem eller mindre kvar till botten, sätt isNearBottom till true
        if (distanceFromBottom <= 80) {
          setIsNearBottom(true);
        } else {
          setIsNearBottom(false);
        }
      } else {
        setIsNearBottom(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("resize", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", toggleVisibility);
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
      className={`${styles.scrollToTop} ${isNearBottom ? styles.nearBottom : ''}`}
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
