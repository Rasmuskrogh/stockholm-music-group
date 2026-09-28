import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN in production (fast, cached); always fresh in dev so edits show immediately.
  useCdn: process.env.NODE_ENV === "production",
});
