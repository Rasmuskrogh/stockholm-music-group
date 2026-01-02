"use client";

import { useEffect, useState } from "react";
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
    setSwipeOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentX = e.targetTouches[0].clientX;
    const offset = currentX - touchStart;
    setSwipeOffset(offset);
    setTouchEnd(currentX);
  };

  const onTouchEnd = () => {
    if (!touchStart || touchEnd === null) {
      setIsSwiping(false);
      setSwipeOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const screenWidth =
      typeof window !== "undefined" ? window.innerWidth : 1000;

    if (isLeftSwipe) {
      setIsAnimating(true);
      setSwipeOffset(-screenWidth);
      setTimeout(() => {
        goToNext();
        setSwipeOffset(0);
        setIsSwiping(false);
        setIsAnimating(false);
      }, 300);
    } else if (isRightSwipe) {
      setIsAnimating(true);
      setSwipeOffset(screenWidth);
      setTimeout(() => {
        goToPrevious();
        setSwipeOffset(0);
        setIsSwiping(false);
        setIsAnimating(false);
      }, 300);
    } else {
      // Reset om swipe inte var tillräckligt lång
      setIsAnimating(true);
      setSwipeOffset(0);
      setTimeout(() => {
        setIsSwiping(false);
        setIsAnimating(false);
      }, 200);
    }

    setTouchStart(null);
    setTouchEnd(null);
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

        <div
          className={styles.imageContainer}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Föregående bild (visas när man swipear höger) */}
          {swipeOffset > 0 && (
            <div
              className={`${styles.imageWrapper} ${
                isAnimating ? styles.animating : ""
              }`}
              style={{
                transform: `translateX(${
                  swipeOffset -
                  (typeof window !== "undefined" ? window.innerWidth : 1000)
                }px)`,
                opacity: Math.min(Math.abs(swipeOffset) / 200, 1),
                transition: isAnimating
                  ? "transform 0.3s ease-out, opacity 0.3s ease-out"
                  : "none",
              }}
            >
              <Image
                src={
                  images[(currentIndex - 1 + images.length) % images.length].url
                }
                alt={
                  images[(currentIndex - 1 + images.length) % images.length].alt
                }
                width={
                  images[(currentIndex - 1 + images.length) % images.length]
                    .width
                }
                height={
                  images[(currentIndex - 1 + images.length) % images.length]
                    .height
                }
                className={styles.modalImage}
                priority
              />
            </div>
          )}

          {/* Nuvarande bild */}
          <div
            className={`${styles.imageWrapper} ${
              isAnimating ? styles.animating : ""
            }`}
            style={{
              transform: `translateX(${swipeOffset}px)`,
              opacity: isSwiping
                ? 1 - Math.min(Math.abs(swipeOffset) / 300, 0.7)
                : 1,
              transition: isAnimating
                ? "transform 0.3s ease-out, opacity 0.3s ease-out"
                : "none",
            }}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              width={currentImage.width}
              height={currentImage.height}
              className={styles.modalImage}
              priority
            />
          </div>

          {/* Nästa bild (visas när man swipear vänster) */}
          {swipeOffset < 0 && (
            <div
              className={`${styles.imageWrapper} ${
                isAnimating ? styles.animating : ""
              }`}
              style={{
                transform: `translateX(${
                  swipeOffset +
                  (typeof window !== "undefined" ? window.innerWidth : 1000)
                }px)`,
                opacity: Math.min(Math.abs(swipeOffset) / 200, 1),
                transition: isAnimating
                  ? "transform 0.3s ease-out, opacity 0.3s ease-out"
                  : "none",
              }}
            >
              <Image
                src={images[(currentIndex + 1) % images.length].url}
                alt={images[(currentIndex + 1) % images.length].alt}
                width={images[(currentIndex + 1) % images.length].width}
                height={images[(currentIndex + 1) % images.length].height}
                className={styles.modalImage}
                priority
              />
            </div>
          )}
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
