import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuroraBackground from "@/components/ui/AuroraBackground";
import DemoStyles from "./DemoStyles";
import Navbar from "./_components/Navbar";
import CtaFooter from "./_components/CtaFooter";
import "./_components/theme.css";

export const metadata: Metadata = {
  title: "Aurora background demo",
  robots: { index: false },
};

export default function AuroraDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="aurora-theme">
      <DemoStyles />
      <AuroraBackground />
      <Navbar />
      {children}
      <CtaFooter />
    </div>
  );
}
