import type { SchemaTypeDefinition } from "sanity";
import homePage from "./documents/homePage";
import siteSettings from "./documents/siteSettings";
import contentBlock from "./objects/contentBlock";
import ctaBlock from "./objects/ctaBlock";
import youtubeVideo from "./objects/youtubeVideo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, siteSettings, contentBlock, ctaBlock, youtubeVideo],
};
