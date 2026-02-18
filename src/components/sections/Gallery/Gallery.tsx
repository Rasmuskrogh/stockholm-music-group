"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GalleryModal from "./GalleryModal";
import { GalleryImage } from "@/types";
import styles from "./Gallery.module.css";
import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";

export type { GalleryImage };

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) {
          if (response.status === 404) {
            setImages([]);
            setError(null);
            return;
          }
          setError(`API error: ${response.status}`);
          return;
        }
        const data = await response.json();
        if (data.error && data.error === "Failed to fetch images") {
          setImages([]);
          setError(null);
          return;
        }
        setImages(data);
      } catch (err) {
        if (
          err instanceof Error &&
          (err.message.includes("Failed to fetch") ||
            err.message.includes("404") ||
            err.message.includes("Network") ||
            err.message.includes("Failed to fetch images"))
        ) {
          setImages([]);
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Galleri</h2>
        <div className={styles.loading}>
          <p>Laddar galleri bilder...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Galleri</h2>
        <div className={styles.error}>
          <p>Fel vid laddning av galleri: {error}</p>
          <small>
            Kontrollera att API-routen är korrekt konfigurerad och att
            Cloudinary är tillgängligt.
          </small>
        </div>
      </section>
    );
  }

  return (
    <Section>
      <Container>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Galleri</h2>
          <div className={styles.galleryGrid}>
            {images.length > 0 ? (
              images.map((image, index) => (
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
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      onError={() => {
                        setFailedImages((prev) => new Set([...prev, image.id]));
                      }}
                      onClick={() => handleImageClick(index)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className={styles.loading}>
                <p>Laddar bilder...</p>
              </div>
            )}
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
