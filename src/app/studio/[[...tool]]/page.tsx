/**
 * Embedded Sanity Studio at /studio — replaces the old /admin area.
 * `[[...tool]]` is the Studio's own internal routing; this file only mounts it.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
