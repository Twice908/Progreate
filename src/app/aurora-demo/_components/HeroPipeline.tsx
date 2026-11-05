import type { ReactNode } from "react";
import { fix, process } from "@/lib/data";
import Media from "@/components/ui/Media";
import { PlatformBadge, Sparkle, type PlatformKey } from "./Icons";

const [send, craft, watch] = process.steps;
const stats = [fix.stats[0], fix.stats[2], fix.stats[3]];

// Heights of the fake audio waveform on the "craft" step.
const bars = Array.from({ length: 34 }, (_, i) => 30 + ((i * 37) % 70));

function Step({ title, icon, delay, right, children }: { title: string; icon: ReactNode; delay: string; right?: boolean; children: ReactNode }) {
  return (
    <div className={`glass-inset pipeline-step flex w-[86%] flex-col gap-2.5 p-3 md:p-3.5 ${right ? "self-end" : ""}`} style={{ animationDelay: delay }}>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-aurora/30 bg-aurora/10 text-aurora">{icon}</span>
        <p className="font-display text-[16px] font-medium leading-[20px] tracking-[-0.02em] text-white md:text-[18px]">{title}</p>
      </div>
      {children}
    </div>
  );
}

/** Curve between two steps, with a pulse of light running along it. */
function Connector({ path, delay }: { path: string; delay: string }) {
  return (
    <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="h-[26px] w-full overflow-visible" fill="none">
      <path d={path} stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d={path} stroke="#c8ff2e" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="pipeline-pulse" style={{ animationDelay: delay }} />
    </svg>
  );
}

/**
 * The hero's right column: the real workflow, from clips in to results out. All its text comes from the
 * Process and How We Fix copy further down the page, so it's hidden from screen readers as a repeat.
 */
export default function HeroPipeline() {
  return (
    <div aria-hidden className="glass flex flex-col gap-4 p-4 md:gap-5 md:p-5 lg:rotate-2">
      <p className="flex items-center gap-2 text-[14px] leading-5 tracking-[-0.02em] text-white/70">
        <span className="pipeline-dot size-2 rounded-full bg-aurora" />
        {process.badge}
      </p>

      <div className="flex flex-col">
        <Step
          title={send.title}
          delay="0s"
          icon={
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V5m-4 4 4-4 4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
            </svg>
          }
        >
          <div className="grid grid-cols-4 gap-1.5">
            {[78, 92, 104, 84].map((hue) => (
              <Media key={hue} kind="scene" hue={hue} className="h-9 rounded-md md:h-10" />
            ))}
          </div>
        </Step>

        <Connector path="M43 0 C43 14 57 12 57 26" delay="0.3s" />

        <Step title={craft.title} delay="1s" right icon={<Sparkle className="size-[18px]" />}>
          <div className="flex h-6 items-center justify-between">
            {bars.map((height, i) => (
              <span key={i} className="pipeline-bar w-[3px] rounded-full bg-aurora/80" style={{ height: `${height}%`, animationDelay: `${-i * 0.13}s` }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {process.slider.chips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[12px] leading-4 tracking-[-0.02em] text-white/70">
                {chip}
              </span>
            ))}
          </div>
        </Step>

        <Connector path="M57 0 C57 14 43 12 43 26" delay="1.3s" />

        <Step
          title={watch.title}
          delay="2s"
          icon={
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.6-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {process.published.map((item) => (
              <span key={item.author} className="flex items-center gap-1.5 text-[13px] font-medium leading-none tracking-[-0.02em] text-aurora">
                <PlatformBadge platform={item.platform as PlatformKey} className="size-6 rounded-md" />
                {item.views}
              </span>
            ))}
          </div>
        </Step>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10 pt-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={i ? "border-l border-white/10 pl-3 md:pl-4" : "pr-3"}>
            <p className="text-aurora-grad font-display text-[26px] font-medium leading-8 tracking-[-0.02em] md:text-[32px] md:leading-10" data-count={stat.value} data-suffix={stat.suffix}>
              {stat.value}
              {stat.suffix}
            </p>
            <p className="mt-0.5 text-[12px] leading-[15px] tracking-[-0.02em] text-white/60 md:text-[13px] md:leading-4">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
