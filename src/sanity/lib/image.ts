import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** `urlFor(image).width(800).url()` — respects the editor's crop/hotspot. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
