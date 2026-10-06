import { defineQuery } from "next-sanity";

/** The booking form's settings — read by /api/contact to validate submissions. */
export const bookingFormQuery = defineQuery(`
  *[_id == "homePage"][0].sections[_type == "contactSection"][0]{
    fields[]{ _key, _type, label, kind, required }, submitLabel, successMessage
  }
`);

export const siteQuery = defineQuery(`{
  "home": *[_id == "homePage"][0]{
    sections[]{
      _key,
      _type,
      _type == "heroSection" => { title, subtitle, ctaText, "videoUrl": video.asset->url },
      _type == "textSection" => {
        blocks[]{ _key, _type, subtitle, content, intro, list, steps[]{ _key, title, text }, items[]{ _key, label, text }, outro, text }
      },
      _type == "contactSection" => { title, fields[]{ _key, _type, label, kind, required }, submitLabel, successMessage },
      _type == "mediaSection" => { title, videos[]{ _key, composer, title, youtubeId } },
      _type == "bioSection" => { text },
      _type == "gallerySection" => {
        images[]{
          _key,
          alt,
          asset,
          crop,
          hotspot,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "lqip": asset->metadata.lqip
        }
      }
    },
    // Legacy layout — used only while \`sections\` is empty.
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
  "settings": *[_id == "siteSettings"][0]{
    email,
    phone,
    socialLinks[]{ _key, platform, url },
    footerDocuments[defined(file.asset)]{ _key, label, "url": file.asset->url },
    copyright
  }
}`);
