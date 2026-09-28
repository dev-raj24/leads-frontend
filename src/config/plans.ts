import type { Plan } from "@/types/models";

export interface PlanInfo {
  id: Plan;
  name: string;
  blurb: string;
  price: string;
  per: string;
  features: string[];
  featured: boolean;
}

/** The one source of truth for what free vs. Pro includes — pricing page and Account page both read this. */
export const PLANS: PlanInfo[] = [
  {
    id: "free",
    name: "Starter",
    blurb: "For solo owners getting started with lead capture.",
    price: "₹0",
    per: "forever",
    features: ["Up to 50 leads / month", "Web chat widget", "Unified inbox", "Instant email alerts"],
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "Everything on autopilot — replies, follow-ups and WhatsApp.",
    price: "₹999",
    per: "/ month",
    features: ["Unlimited leads", "AI instant responder", "WhatsApp integration", "Automated follow-ups", "AI blog & offer banners"],
    featured: true,
  },
];
