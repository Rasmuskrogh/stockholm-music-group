import Container from "@/components/ui/Container/Container";
import Section from "@/components/ui/Section/Section";
import Image from "next/image";
import Link from "next/link";
import VideoList from "./VideoList";

import styles from "./Media.module.css";

const videos = [
  {
    id: 4,
    composer: "Fred Åkerström",
    title: "Jag ger dig min morgon",
    youtubeId: "ntgveY_yZAA",
  },
  {
    id: 2,
    composer: "Nat King Cole",
    title: "L-O-V-E",
    youtubeId: "tmXfLsj8Is0",
  },
  {
    id: 1,
    composer: "Leonard Cohen",
    title: "Hallelujah",
    youtubeId: "gWM82gyJuqM",
  },
  {
    id: 3,
    composer: "Elvis Presley",
    title: "Can't help falling in Love",
    youtubeId: "LHYlxyZUU4I",
  },
];

function Media() {
  return (
    <Section className={styles.transparentSection}>
      <Container>
        <h2 className={styles.title}>Media</h2>
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
