import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { HomeIcon } from "@sanity/icons/Home";

/**
 * Both document types are singletons: the list opens the ONE document
 * directly, and sanity.config.ts hides them from the "+ Create" menu,
 * so a stray duplicate can never be created.
 */
export const SINGLETON_TYPES = new Set(["homePage", "siteSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innehåll")
    .items([
      S.listItem()
        .title("Startsida")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Inställningar")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
