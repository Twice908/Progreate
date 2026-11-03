import type { Metadata } from "next";
import PageMotion from "@/components/motion/PageMotion";
import SectionHeader from "@/components/ui/SectionHeader";
import VideoCard from "@/components/ui/VideoCard";
import Stars from "@/components/ui/Stars";
import Testimonials from "@/components/sections/Testimonials";
import { works } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Works — ClipCut",
  description: works.description,
};

const hues = [200, 215, 26, 30, 210, 24];

export default function AllWorks() {
  return (
    <PageMotion>
      <section className="relative isolate overflow-hidden pb-10 pt-[140px] md:pt-[196px]">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[620px] [mask-image:linear-gradient(180deg,#000_30%,transparent)]">
          <div className="absolute inset-0 [background:radial-gradient(60%_70%_at_50%_0%,rgb(120_50_20/0.35),transparent)]" />
          <div className="stripes absolute inset-0" />
          <Stars count={40} seed={61} />
        </div>

        <div className="container-x">
          <div className="mx-auto max-w-[674px]">
            <SectionHeader badge={works.badge} title={works.title} description={works.description} />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-2.5 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {works.videos.map((w, i) => (
              <div key={i} data-reveal>
                <VideoCard work={w} hue={hues[i]} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </PageMotion>
  );
}
