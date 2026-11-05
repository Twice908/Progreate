import { tools } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Marquee from "@/components/motion/Marquee";

function Tile({ label }: { label: string; hue: number }) {
  return (
    <div className="glass relative grid size-[96px] shrink-0 place-items-center rounded-[26px] md:size-[108px] md:rounded-[30px]">
      <span className="text-aurora-grad font-display text-[40px] font-medium leading-none tracking-[-0.04em] md:text-[46px]">{label}</span>
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
          <span className="absolute left-1/2 top-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(200_255_46/0.4)_0%,rgb(130_190_30/0.18)_45%,transparent_72%)] blur-[24px]" />
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
