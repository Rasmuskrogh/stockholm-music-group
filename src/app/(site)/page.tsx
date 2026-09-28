import Hero from "@/components/sections/Hero/Hero";
import Bio from "@/components/sections/Bio/Bio";
import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/sections/Footer/Footer";
import Media from "@/components/sections/Media/Media";
import Gallery from "@/components/sections/Gallery/Gallery";
import ScrollToTop from "@/components/ui/ScrollToTop/ScrollToTop";
import Wedding from "@/components/sections/Wedding/Wedding";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { siteQuery } from "@/lib/queries";
import type { GalleryImage, SiteData } from "@/types";

// Published edits in the Studio show up on the live site within a minute.
export const revalidate = 60;

async function page() {
  const { home, settings } = await client.fetch<SiteData>(siteQuery);

  const galleryImages: GalleryImage[] = (home?.gallery ?? [])
    .filter((img) => img.asset)
    .map((img) => {
      // Aspect ratio of the editor's crop, so next/image reserves the right space.
      const c = img.crop;
      const width = Math.round(img.width * (1 - (c?.left ?? 0) - (c?.right ?? 0)));
      const height = Math.round(img.height * (1 - (c?.top ?? 0) - (c?.bottom ?? 0)));
      return {
        id: img._key,
        url: urlFor(img).width(Math.min(width, 1920)).url(),
        alt: img.alt?.trim() || "Galleribild",
        width,
        height,
        lqip: img.lqip,
      };
    });

  return (
    <div>
      <Hero
        title={home?.heroTitle}
        subtitle={home?.heroSubtitle}
        ctaText={home?.heroCtaText}
        videoUrl={home?.heroVideoUrl}
      />
      <Wedding blocks={home?.contentBlocks ?? []} />
      <Contact />
      <Media title={home?.mediaTitle} videos={home?.videos ?? []} socialLinks={settings?.socialLinks ?? []} />
      <Bio text={home?.bio} />
      <Gallery images={galleryImages} />
      <Footer email={settings?.email} phone={settings?.phone} copyright={settings?.copyright} />
      <ScrollToTop />
    </div>
  );
}

export default page;
