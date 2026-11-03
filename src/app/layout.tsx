import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import CtaFooter from "@/components/layout/CtaFooter";

// Body / UI face (same as the template).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// Stand-in for PP Neue Montreal (paid, Pangram Pangram). To use the licensed files, replace this
// with next/font/local and keep the `--font-display-face` variable name.
const displayFace = Hanken_Grotesk({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClipCut — Short-form Video Editing Agency",
  description:
    "We turn your raw clips into high-performing Reels, TikToks, and Shorts — designed to grab attention, boost engagement, and grow your audience faster.",
};

export const viewport: Viewport = {
  themeColor: "#090401",
  colorScheme: "dark",
};

/**
 * Runs before first paint (and before React). Opts into the "hide until revealed" CSS only when motion
 * is allowed, and arms a failsafe: if hydration hasn't marked motion ready within 3s, drop the class so
 * everything shows (the GSAP setup then skips itself via `__motionSkipped`).
 */
const motionGate = `(function(w,d){try{
var h=d.documentElement;
if(!w.matchMedia('(prefers-reduced-motion: no-preference)').matches)return;
h.classList.add('motion');
w.__motionTimer=w.setTimeout(function(){
if(!w.__motionReady){w.__motionSkipped=true;h.classList.remove('motion');}
},3000);
}catch(e){}})(window,document);`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the gate script above adds a class to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${displayFace.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      </head>
      <body className="relative flex min-h-screen flex-col bg-bg">
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <CtaFooter />
      </body>
    </html>
  );
}
