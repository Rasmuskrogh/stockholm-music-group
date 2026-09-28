import type { SanityImageCrop, SanityImageHotspot } from "@sanity/image-url";

export interface VideoCardProps {
  composer: string;
  title: string;
  youtubeId: string;
}

export type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  lqip?: string;
}

export type ContentBlock = {
  _key: string;
  _type: "contentBlock";
  subtitle?: string;
  content?: string;
  intro?: string;
  list?: string[];
  steps?: { _key: string; title: string; text?: string }[];
  items?: { _key: string; label: string; text?: string }[];
  outro?: string;
};

export type CtaBlock = { _key: string; _type: "ctaBlock"; text: string };

export type SocialLink = { _key: string; platform: string; url: string };

export interface SiteData {
  home: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroCtaText?: string;
    heroVideoUrl?: string;
    contentBlocks?: (ContentBlock | CtaBlock)[];
    mediaTitle?: string;
    videos?: ({ _key: string } & VideoCardProps)[];
    bio?: string;
    gallery?: {
      _key: string;
      alt?: string;
      asset: { _ref: string };
      crop?: SanityImageCrop;
      hotspot?: SanityImageHotspot;
      width: number;
      height: number;
      lqip?: string;
    }[];
  } | null;
  settings: {
    email?: string;
    phone?: string;
    socialLinks?: SocialLink[];
    copyright?: string;
  } | null;
}
