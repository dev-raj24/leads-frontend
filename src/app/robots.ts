import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/b/"], disallow: ["/f/", "/c/", "/dashboard", "/leads", "/chats", "/ai-widget", "/customers", "/follow-ups", "/offers", "/blog", "/seo", "/settings", "/account", "/onboarding"] }],
    host: env.appUrl,
  };
}
