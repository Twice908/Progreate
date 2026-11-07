import type { Metadata, Viewport } from "next";
import { DM_Mono, Gloock, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import { mediums } from "@/lib/mediums";
import "@/styles/base.css";
import "@/styles/chrome.css";
import "@/styles/sections.css";

const display = Gloock({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: mediums.tcbs.bg,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before first paint so styles can branch on JS and motion preference without a flash. */
const preflight = `(function(d,w){var h=d.documentElement;h.classList.add('js');try{if(w.matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('calm')}catch(e){}})(document,window);`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preflight }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
