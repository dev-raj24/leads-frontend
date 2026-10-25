import type { Plan } from "@/types/models";

export interface PlanInfo {
  id: Plan;
  name: string;
  blurb: string;
  price: string;
  per: string;
  features: string[];
  locked: string[];
  featured: boolean;
}

/** The one source of truth for what Free vs Pro includes — pricing, onboarding and Account all read this. Keep it in step with backend/src/config/plans.ts. */
export const PLANS: PlanInfo[] = [
  {
    id: "free",
    name: "Free",
    blurb: "For owners who want every enquiry in one place and reply themselves.",
    price: "₹0",
    per: "forever",
    features: [
      "Up to 50 leads a month",
      "Website enquiry forms",
      "One inbox for every lead",
      "Instant email alert for each new lead",
      "Reply by email from the dashboard",
      "Customer list and follow-up reminders",
    ],
    locked: ["AI reply in seconds", "AI chat on your website", "Offers and popups", "AI blog", "SEO check with ready-made fixes", "Google Search Console rankings", "Automatic follow-ups"],
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "Replies in seconds, a chat that answers visitors, an SEO check that writes the fixes, and follow-ups that run themselves.",
    price: "₹999",
    per: "/ month",
    features: [
      "Up to 1,000 leads a month",
      "AI writes the first reply in seconds",
      "AI chat on your website, with your team able to step in",
      "Offers as a floating card or popup with a lead form",
      "AI blog that publishes to your site, with its own SEO pages and sitemap",
      "Banner and chat colours matched to your website",
      "Automatic follow-ups when nobody has replied",
      "SEO check with a score and ready-to-paste fixes",
      "Google Search Console: your real searches and rankings",
    ],
    locked: [],
    featured: true,
  },
];
