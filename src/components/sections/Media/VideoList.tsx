import styles from "./VideoList.module.css";
import { VideoCardProps } from "@/types";

function VideoList({ composer, title, youtubeId }: VideoCardProps) {
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;

  return (
    <div className={styles.videoCard}>
      <div className={styles.videoInfo}>
        <h3 className={styles.composer}>{composer}</h3>
        <p className={styles.title}>{title}</p>
      </div>
      <div className={styles.videoWrapper}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.video}
        />
      </div>
    </div>
  );
}

export default VideoList;
