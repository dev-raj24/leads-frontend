import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/"], disallow: ["/dashboard", "/leads", "/customers", "/follow-ups", "/seo", "/settings", "/account", "/onboarding"] }],
    host: env.appUrl,
  };
}
