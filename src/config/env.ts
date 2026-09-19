// config/env.ts — single place every other file reads config from.
// Nothing else in the app should touch process.env directly.

export const env = {
  /** Base URL of leadworks-api (the separate Express backend). */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001",
};
