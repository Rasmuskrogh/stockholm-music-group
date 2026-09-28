"use client";

import { useState } from "react";
import Image from "next/image";
import GalleryModal from "./GalleryModal";
import { GalleryImage } from "@/types";
import styles from "./Gallery.module.css";
import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";

export type { GalleryImage };

const FALLBACK_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (images.length === 0) return null;

  return (
    <Section>
      <Container>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Galleri</h2>
          <div className={styles.galleryGrid}>
            {images.map((image, index) => (
              <div key={image.id} className={styles.galleryItem}>
                {failedImages.has(image.id) ? (
                  <div className={styles.imagePlaceholder}>
                    <div className={styles.placeholderContent}>
                      <p>Bild kunde inte laddas</p>
                      <small>{image.alt}</small>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className={`${styles.galleryImage} ${image.height > image.width ? styles.portraitImage : ""
                      }`}
                    priority={false}
                    placeholder="blur"
                    blurDataURL={image.lqip || FALLBACK_BLUR}
                    onError={() => {
                      setFailedImages((prev) => new Set([...prev, image.id]));
                    }}
                    onClick={() => handleImageClick(index)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            ))}
          </div>

          <GalleryModal
            isOpen={isModalOpen}
            images={images}
            currentIndex={currentImageIndex}
            onClose={handleModalClose}
            onNavigate={handleModalNavigate}
          />
        </section>
      </Container>
    </Section>
  );
}
