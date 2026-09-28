import Container from "@/components/ui/Container/Container";
import Section from "@/components/ui/Section/Section";
import Image from "next/image";
import Link from "next/link";
import VideoList from "./VideoList";
import { youtubeIdFrom } from "@/lib/youtube";
import type { SocialLink, VideoCardProps } from "@/types";

import styles from "./Media.module.css";

const socialIcons: Record<string, string> = {
  YouTube: "/images/youtube.svg",
  Instagram: "/images/instagram.svg",
  Facebook: "/images/facebook.svg",
};

interface MediaProps {
  title?: string;
  videos: ({ _key: string } & VideoCardProps)[];
  socialLinks: SocialLink[];
}

function Media({ title, videos, socialLinks }: MediaProps) {
  return (
    <Section className={styles.transparentSection}>
      <Container>
        {title && <h2 className={styles.title}>{title}</h2>}
        <section className={styles.iconsWrapper}>
          {socialLinks
            .filter((link) => socialIcons[link.platform])
            .map((link) => (
              <Link
                key={link._key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
              >
                <Image
                  src={socialIcons[link.platform]}
                  alt={link.platform}
                  width={30}
                  height={30}
                />
              </Link>
            ))}
        </section>
        <section className={styles.videoSection}>
          {videos.map((video) => (
            <VideoList
              key={video._key}
              composer={video.composer}
              title={video.title}
              youtubeId={youtubeIdFrom(video.youtubeId)}
            />
          ))}
        </section>
      </Container>
    </Section>
  );
}

export default Media;
