import type { Metadata } from "next";
import PageMotion from "@/components/motion/PageMotion";
import VideoCard from "@/components/ui/VideoCard";
import { brand, works } from "@/lib/data";
import GlowGroup from "../_components/GlowGroup";
import SectionHeader from "../_components/SectionHeader";
import Testimonials from "../_components/Testimonials";

export const metadata: Metadata = {
  title: `Our Works — ${brand.name}`,
  description: works.description,
};

const hues = [78, 92, 70, 104, 84, 118];

export default function AuroraAllWorks() {
  return (
    <PageMotion>
      <section className="pb-10 pt-[140px] md:pt-[196px]">
        <div className="container-x">
          <div className="mx-auto max-w-[674px]">
            <SectionHeader badge={works.badge} title={works.title} description={works.description} />
          </div>

          <GlowGroup className="mt-14 md:mt-20">
            <div aria-hidden data-aurora-merge="primary" className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-aurora/45 to-transparent" />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {works.videos.map((w, i) => (
                <div key={i} data-reveal {...(i < 3 ? { "data-glow-card": true } : {})} className={i < 3 ? "glow-card rounded-2xl" : undefined}>
                  <VideoCard work={w} hue={hues[i]} />
                </div>
              ))}
            </div>
          </GlowGroup>
        </div>
      </section>

      <Testimonials />
    </PageMotion>
  );
}
