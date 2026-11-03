import { tools } from "@/lib/data";
import SectionHeader from "@/components/ui/SectionHeader";
import Marquee from "@/components/motion/Marquee";

function Tile({ label, hue }: { label: string; hue: number }) {
  return (
    <div
      className="relative grid size-[96px] shrink-0 place-items-center rounded-[26px] border border-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_20px_40px_-20px_rgb(0_0_0/0.9)] md:size-[108px] md:rounded-[30px]"
      style={{ background: `linear-gradient(160deg, hsl(${hue} 30% 22% / .9) 0%, hsl(${hue} 30% 8%) 100%)` }}
    >
      <span
        className="font-display text-[40px] font-medium leading-none tracking-[-0.04em] md:text-[46px]"
        style={{ backgroundImage: `linear-gradient(180deg, hsl(${hue} 90% 80%), hsl(${hue} 70% 52%))`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Tools() {
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-[120px]" aria-labelledby="tools-title">
      <div className="container-x">
        <div className="mx-auto max-w-[714px]">
          <SectionHeader badge={tools.badge} title={tools.title} description={tools.description} descClass="max-w-[484px]" />
        </div>
      </div>

      <div className="relative mt-14 md:mt-[60px]">
        {/* Orbit rings + glow behind the ticker */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[1144px] -translate-x-1/2 -translate-y-1/2">
          {[1, 0.74, 0.5, 0.26].map((s) => (
            <span key={s} className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.06]" style={{ width: `${s * 100}%`, height: `${s * 100}%`, transform: "translate(-50%,-50%)" }} />
          ))}
          <span className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(250_97_20/0.75)_0%,rgb(190_66_18/0.35)_45%,transparent_72%)] blur-[24px]" />
        </div>

        <Marquee speed={38} gap={87} className="mask-x-fade py-3">
          {tools.items.map((t) => (
            <Tile key={t.label} {...t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
