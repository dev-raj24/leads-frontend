/** Two-tone sidebar icons: a soft fill under a 2px outline, both in currentColor. */

export type NavIconName =
  | "dashboard"
  | "leads"
  | "chats"
  | "customers"
  | "followups"
  | "offers"
  | "blog"
  | "seo"
  | "reviews"
  | "widget"
  | "settings"
  | "account";

const common = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const tint = { fill: "currentColor", fillOpacity: 0.2 };

export function NavIcon({ name, size = 20 }: { name: NavIconName; size?: number }) {
  const p = { ...common, width: size, height: size };
  switch (name) {
    case "dashboard":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="8" height="10" rx="2.5" {...tint} />
          <rect x="13" y="3" width="8" height="6" rx="2.5" />
          <rect x="13" y="11" width="8" height="10" rx="2.5" {...tint} />
          <rect x="3" y="15" width="8" height="6" rx="2.5" />
        </svg>
      );
    case "leads":
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3.6" {...tint} />
          <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
          <circle cx="17.5" cy="9" r="2.4" />
          <path d="M17.2 14.2c2.6.2 4.3 2 4.3 4.8" />
        </svg>
      );
    case "chats":
      return (
        <svg {...p}>
          <path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6a3.5 3.5 0 0 1-3.5 3.5H11l-4.4 3.8a.6.6 0 0 1-1-.5V16A3.5 3.5 0 0 1 4 12.5z" {...tint} />
          <path d="M8.5 9.6h7M8.5 12.4h4" />
        </svg>
      );
    case "customers":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="3.5" {...tint} />
          <circle cx="9.2" cy="10.2" r="2.3" />
          <path d="M5.6 16.4c.5-1.8 1.9-2.8 3.6-2.8s3.1 1 3.6 2.8" />
          <path d="M15 9.5h3M15 13h3" />
        </svg>
      );
    case "followups":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.2" {...tint} stroke="none" />
          <path d="M20 12a8 8 0 1 1-2.5-5.8" />
          <path d="M20.2 3.8v4.4h-4.4" />
          <path d="M12 8v4.2l2.6 1.6" />
        </svg>
      );
    case "offers":
      return (
        <svg {...p}>
          <path d="M3.5 11.6V5.5a2 2 0 0 1 2-2h6.1a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.8l-6.1 6.1a2 2 0 0 1-2.8 0L4.1 13a2 2 0 0 1-.6-1.4z" {...tint} />
          <circle cx="8.3" cy="8.3" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "blog":
      return (
        <svg {...p}>
          <path d="M5 3.5h10.5L20 8v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5A1.5 1.5 0 0 1 5.5 3.5z" {...tint} />
          <path d="M15 3.5V8h5" />
          <path d="M8 12.5h8M8 16h5" />
        </svg>
      );
    case "seo":
      return (
        <svg {...p}>
          <circle cx="10.5" cy="10.5" r="6.5" {...tint} />
          <path d="M15.5 15.5L20.5 20.5" />
          <path d="M7.8 11.6l1.8-2.2 1.4 1.4 2-2.6" />
        </svg>
      );
    case "reviews":
      return (
        <svg {...p}>
          <path d="M12 3.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16l-4.8 2.7.9-5.4-3.9-3.8 5.4-.8z" {...tint} />
        </svg>
      );
    case "widget":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" {...tint} />
          <path d="M13 6.5L8.2 13h3.4l-.8 4.5L15.8 11h-3.4z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "settings":
      return (
        <svg {...p}>
          <path d="M3.5 7h9M18 7h2.5M3.5 17h2.5M11.5 17h9" />
          <circle cx="15.2" cy="7" r="2.6" {...tint} />
          <circle cx="8.8" cy="17" r="2.6" {...tint} />
        </svg>
      );
    case "account":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" {...tint} />
          <circle cx="12" cy="9.8" r="3" />
          <path d="M6.2 18.2c1-2.4 3.1-3.6 5.8-3.6s4.8 1.2 5.8 3.6" />
        </svg>
      );
  }
}
