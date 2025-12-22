"use client";
import { useState } from "react";
import styles from "./VideoList.module.css";
import { VideoCardProps } from "@/types";
import { createPortal } from "react-dom";

function VideoList({ composer, title, youtubeId }: VideoCardProps) {
  const [open, setOpen] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <>
      <div className={styles.videoCard}>
        <div className={styles.videoWrapper} onClick={() => setOpen(true)}>
          <img src={thumbnailUrl} alt={title} className={styles.thumbnail} />
          <span className={styles.playButton}>▶</span>
        </div>

        <div className={styles.videoInfo}>
          <h3 className={styles.composer}>{composer}</h3>
          <p className={styles.title}>{title}</p>
        </div>
      </div>

      {open &&
        createPortal(
          <div className={styles.modalBackdrop} onClick={() => setOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <iframe
                src={embedUrl}
                title={title}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default VideoList;
