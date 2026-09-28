/**
 * Project ID and dataset aren't secrets (they're in every public API URL),
 * so they default to the real values here — the site deploys without any
 * Sanity env vars set. Override via `.env.local` e.g. to point at a
 * scratch dataset.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-28";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ptf3rcbu";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
