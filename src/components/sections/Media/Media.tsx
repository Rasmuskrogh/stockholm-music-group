import Container from "@/components/ui/Container/Container";
import Section from "@/components/ui/Section/Section";
import Image from "next/image";
import VideoList from "./VideoList";

import styles from "./Media.module.css";

const videos = [
  {
    id: 1,
    composer: "Leonard Cohen",
    title: "Hallelujah",
    youtubeId: "gWM82gyJuqM",
  },
  {
    id: 2,
    composer: "Nat King Cole",
    title: "L-O-V-E",
    youtubeId: "tmXfLsj8Is0",
  },
  {
    id: 3,
    composer: "Elvis Presley",
    title: "Can't help falling in Love",
    youtubeId: "LHYlxyZUU4I",
  },
  {
    id: 4,
    composer: "Fred Åkerström",
    title: "Jag ger dig min morgon",
    youtubeId: "ntgveY_yZAA",
  },
];

function Media() {
  return (
    <Section className={styles.transparentSection}>
      <Container>
        <h2 className={styles.title}>Media</h2>
        <section className={styles.iconsWrapper}>
          <Image
            src="/images/youtube.svg"
            alt="YouTube"
            width={30}
            height={30}
          />
          <Image
            src="/images/instagram.svg"
            alt="Instagram"
            width={30}
            height={30}
          />
          <Image
            src="/images/facebook.svg"
            alt="Facebook"
            width={30}
            height={30}
          />
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
