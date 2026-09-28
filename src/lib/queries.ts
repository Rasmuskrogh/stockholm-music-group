import { defineQuery } from "next-sanity";

export const siteQuery = defineQuery(`{
  "home": *[_id == "homePage"][0]{
    heroTitle,
    heroSubtitle,
    heroCtaText,
    "heroVideoUrl": heroVideo.asset->url,
    contentBlocks[]{ _key, _type, subtitle, content, intro, list, steps[]{ _key, title, text }, items[]{ _key, label, text }, outro, text },
    mediaTitle,
    videos[]{ _key, composer, title, youtubeId },
    bio,
    gallery[]{
      _key,
      alt,
      asset,
      crop,
      hotspot,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    }
  },
  "settings": *[_id == "siteSettings"][0]{ email, phone, socialLinks[]{ _key, platform, url }, copyright }
}`);
