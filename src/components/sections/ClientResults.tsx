import { clientResults } from "@/lib/data";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import VideoCard from "@/components/ui/VideoCard";
import Marquee from "@/components/motion/Marquee";

const hues = [210, 28, 215, 24, 290];

export default function ClientResults() {
  const { videos } = clientResults;
  return (
    <section className="py-20 md:py-[120px]" aria-labelledby="client-results-title">
      <div className="container-x">
        <SectionHeader badge={clientResults.badge} title={clientResults.title} description={clientResults.description} descClass="max-w-[500px]">
          <div data-reveal>
            <Button href={clientResults.cta.href} variant="ember">
              {clientResults.cta.label}
            </Button>
          </div>
        </SectionHeader>
      </div>

      {/* Phone: simple stack. Tablet/desktop: endless ticker. */}
      <div className="container-x mt-12 flex flex-col gap-2.5 md:hidden">
        {videos.slice(0, 4).map((v, i) => (
          <div key={i} data-reveal>
            <VideoCard work={v} hue={hues[i]} className="aspect-[350/620]" />
          </div>
        ))}
      </div>

      <div className="mt-[60px] hidden md:block">
        <Marquee speed={45} gap={20} pauseOnHover>
          {videos.map((v, i) => (
            <div key={i} className="w-[346px] shrink-0">
              <VideoCard work={v} hue={hues[i]} className="aspect-[346/620]" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
