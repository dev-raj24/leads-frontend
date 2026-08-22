// config/env.ts — single place every other file reads config from.
// Nothing else in the app should touch process.env directly.

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // In dev without a DB configured yet, we don't want the whole app to
    // crash on import — routes that need it will surface a clear error.
    return "";
  }
  return value;
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
};
