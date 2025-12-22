"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./GalleryModal.module.css";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface GalleryModalProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryModalProps) {
  const currentImage = images[currentIndex];

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onNavigate((currentIndex - 1 + images.length) % images.length);
          break;
        case "ArrowRight":
          event.preventDefault();
          onNavigate((currentIndex + 1) % images.length);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Använd try-catch för att undvika hydration mismatch
      try {
        document.body.style.overflow = "hidden";
      } catch (error) {
        console.warn("Could not set body overflow:", error);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      try {
        document.body.style.overflow = "unset";
      } catch (error) {
        console.warn("Could not reset body overflow:", error);
      }
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !currentImage) return null;

  const goToPrevious = () => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Stäng modal"
        >
          ×
        </button>

        <button
          className={`${styles.navButton} ${styles.navButtonLeft}`}
          onClick={goToPrevious}
          aria-label="Föregående bild"
        >
          <svg
            className={styles.navIconLeft}
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className={styles.imageContainer}>
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            width={currentImage.width}
            height={currentImage.height}
            className={styles.modalImage}
            priority
          />
        </div>

        <button
          className={`${styles.navButton} ${styles.navButtonRight}`}
          onClick={goToNext}
          aria-label="Nästa bild"
        >
          <svg
            className={styles.navIconRight}
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div className={styles.imageInfo}>
          <p className={styles.imageTitle}>{currentImage.alt}</p>
          <p className={styles.imageCounter}>
            {currentIndex + 1} av {images.length}
          </p>
        </div>
      </div>
    </div>
  );
}
