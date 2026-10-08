import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/b/"], disallow: ["/f/", "/dashboard", "/leads", "/customers", "/follow-ups", "/chats", "/offers", "/blog", "/ai-widget", "/settings", "/account", "/onboarding"] }],
    host: env.appUrl,
  };
}
