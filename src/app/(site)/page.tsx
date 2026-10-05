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
import type { GalleryImage, PageSection, SanityGalleryImage, SiteData, SocialLink } from "@/types";

// Published edits in the Studio show up on the live site within a minute.
export const revalidate = 60;

function toGalleryImages(images: SanityGalleryImage[] = []): GalleryImage[] {
  return images
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
}

/** The old fixed layout, as sections — only while `sections` is empty in Sanity. */
function legacySections(home: NonNullable<SiteData["home"]>): PageSection[] {
  return [
    {
      _key: "hero",
      _type: "heroSection",
      title: home.heroTitle,
      subtitle: home.heroSubtitle,
      ctaText: home.heroCtaText,
      videoUrl: home.heroVideoUrl,
    },
    { _key: "text", _type: "textSection", blocks: home.contentBlocks },
    { _key: "contact", _type: "contactSection" },
    { _key: "media", _type: "mediaSection", title: home.mediaTitle, videos: home.videos },
    { _key: "bio", _type: "bioSection", text: home.bio },
    { _key: "gallery", _type: "gallerySection", images: home.gallery },
  ];
}

function Section({ section, socialLinks }: { section: PageSection; socialLinks: SocialLink[] }) {
  switch (section._type) {
    case "heroSection":
      return (
        <Hero title={section.title} subtitle={section.subtitle} ctaText={section.ctaText} videoUrl={section.videoUrl} />
      );
    case "textSection":
      return <Wedding blocks={section.blocks ?? []} />;
    case "contactSection":
      return <Contact title={section.title} />;
    case "mediaSection":
      return <Media title={section.title} videos={section.videos ?? []} socialLinks={socialLinks} />;
    case "bioSection":
      return <Bio text={section.text} />;
    case "gallerySection":
      return <Gallery images={toGalleryImages(section.images)} />;
    default:
      return null;
  }
}

async function page() {
  const { home, settings } = await client.fetch<SiteData>(siteQuery);
  const sections = home?.sections?.length ? home.sections : home ? legacySections(home) : [];

  return (
    <div>
      {sections.map((section) => (
        <Section key={section._key} section={section} socialLinks={settings?.socialLinks ?? []} />
      ))}
      <Footer email={settings?.email} phone={settings?.phone} copyright={settings?.copyright} />
      <ScrollToTop />
    </div>
  );
}

export default page;
