// components/icons.tsx — a small, hand-drawn icon set (no external icon
// package/CDN). Consistent stroke style: 1.8px, round caps, currentColor.

type P = React.SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};
const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
});

export const IconCheck = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconArrowRight = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconPlay = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
  </svg>
);
export const IconSparkle = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="currentColor" />
  </svg>
);
export const IconBolt = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
  </svg>
);
export const IconRobot = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <rect
      x="4"
      y="8"
      width="16"
      height="12"
      rx="4"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="9" cy="14" r="1.5" fill="currentColor" />
    <circle cx="15" cy="14" r="1.5" fill="currentColor" />
    <path
      d="M12 8V4M9 4h6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
export const IconRefresh = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M20 12a8 8 0 10-2.3 5.6"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M20 4v5h-5"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconInbox = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M3 12l2-7h14l2 7v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M3 12h6a3 3 0 006 0h6" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
export const IconTag = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M12 3l9 9-7.5 7.5a2 2 0 01-2.8 0L3 11.7V4a1 1 0 011-1h8z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1.6" fill="currentColor" />
  </svg>
);
export const IconChat = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M4 5h16v11H9l-5 4V5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconMail = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M3 7l9 6 9-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconClock = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
export const IconBlog = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M4 19.5A2.5 2.5 0 016.5 17H20"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);
export const IconQuestion = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M9.5 9.5a2.5 2.5 0 114 2c-.8.6-1.5 1-1.5 2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);
export const IconPhone = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M6 3h4l1.5 5-2.5 1.5a12 12 0 006 6L16.5 13l5 1.5V19a2 2 0 01-2 2C10.5 21 3 13.5 3 5a2 2 0 013-2z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconRupee = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M8 8h8M8 11h8M8 8c3 0 5 1.2 5 3.2S11 14.4 8 14.4L15 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconWhatsapp = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M12 3a9 9 0 00-7.8 13.4L3 21l4.7-1.2A9 9 0 1012 3z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 8.8c.2 3 2.7 5.5 5.7 5.7.9.1 1.1-.6 1.1-1.1l-.1-.9-1.9-.5-.7.9c-1.1-.5-2-1.4-2.5-2.5l.9-.7-.5-1.9-.9-.1c-.5 0-1.1.2-1.1 1.1z"
      fill="currentColor"
    />
  </svg>
);
export const IconChart = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M4 20V10M10 20V4M16 20v-7M20 20V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
export const IconGlobe = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
export const IconClose = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M9 9l6 6M15 9l-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
export const IconSend = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M4 12L20 4l-6 16-3-7-7-1z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconSearch = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M21 21l-4.3-4.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
export const IconPlus = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
export const IconHome = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconUsers = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M15 20c.3-2.5 1.8-4.4 4-5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
export const IconSettings = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1L5.6 5.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
export const IconTrophy = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M7 4h10v5a5 5 0 01-10 0V4z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 14v3M9 20h6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);
export const IconTrash = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconEdit = ({ size, className, style, ...props }: P) => (
  <svg {...base(size)} className={className} style={style} {...props}>
    <path
      d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
