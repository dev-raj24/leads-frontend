import "./globals.css";

export const metadata = {
  title: "Leadworks — Every lead, one place",
  description:
    "Your website, WhatsApp and forms — every enquiry lands in one inbox. AI sends the first reply and never forgets a follow-up.",
};

import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
