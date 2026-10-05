import type { SchemaTypeDefinition } from "sanity";
import homePage from "./documents/homePage";
import siteSettings from "./documents/siteSettings";
import contentBlock from "./objects/contentBlock";
import ctaBlock from "./objects/ctaBlock";
import youtubeVideo from "./objects/youtubeVideo";
import heroSection from "./sections/heroSection";
import textSection from "./sections/textSection";
import contactSection from "./sections/contactSection";
import mediaSection from "./sections/mediaSection";
import bioSection from "./sections/bioSection";
import gallerySection from "./sections/gallerySection";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homePage,
    siteSettings,
    contentBlock,
    ctaBlock,
    youtubeVideo,
    heroSection,
    textSection,
    contactSection,
    mediaSection,
    bioSection,
    gallerySection,
  ],
};
