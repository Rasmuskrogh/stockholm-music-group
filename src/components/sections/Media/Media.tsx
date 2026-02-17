"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container/Container";
import Section from "@/components/ui/Section/Section";
import Image from "next/image";
import Link from "next/link";
import VideoList from "./VideoList";

import styles from "./Media.module.css";

interface MediaVideo {
  id: number;
  composer: string;
  title: string;
  youtubeId: string;
  sortOrder: number;
}

function Media() {
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [sectionTitle, setSectionTitle] = useState("Media");

  useEffect(() => {
    Promise.all([fetch("/api/media").then((r) => r.json()), fetch("/api/content?key=media_section_title").then((r) => r.json()).catch(() => ({}))])
      .then(([vids, content]) => {
        setVideos(Array.isArray(vids) ? vids : []);
        if (content?.value) setSectionTitle(content.value);
      })
      .catch(() => { });
  }, []);

  return (
    <Section className={styles.transparentSection}>
      <Container>
        <h2 className={styles.title}>{sectionTitle}</h2>
        <section className={styles.iconsWrapper}>
          <Link
            href="https://youtube.com/@stockholmmusicgroup?"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <Image
              src="/images/youtube.svg"
              alt="YouTube"
              width={30}
              height={30}
            />
          </Link>
          <Link
            href="https://www.instagram.com/stockholmmusicgroup?igsh=MXJvM3JscHcybXFmbA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <Image
              src="/images/instagram.svg"
              alt="Instagram"
              width={30}
              height={30}
            />
          </Link>
          <Link
            href="https://www.facebook.com/share/1JwFqG14MH/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <Image
              src="/images/facebook.svg"
              alt="Facebook"
              width={30}
              height={30}
            />
          </Link>
        </section>
        <section className={styles.videoSection}>
          {videos.map((video) => (
            <VideoList
              key={video.id}
              composer={video.composer}
              title={video.title}
              youtubeId={video.youtubeId}
            />
          ))}
        </section>
      </Container>
    </Section>
  );
}

export default Media;
