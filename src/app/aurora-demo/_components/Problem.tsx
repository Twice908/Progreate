import { problem } from "@/lib/data";
import SectionHeader from "./SectionHeader";

const panel =
  "glass-inset relative h-[254px] overflow-hidden p-[15px] [background-image:radial-gradient(90%_70%_at_50%_110%,rgb(200_255_46/0.16)_0%,transparent_70%)]";

/* ---------- 1. Views / retention chart ---------- */
function ViewsPanel() {
  const v = problem.views;
  return (
    <div className={panel}>
      <p className="text-[12px] font-light leading-[16.8px] tracking-[-0.04em] text-white">{v.label}</p>
      <p className="mt-1 text-[40px] font-semibold leading-10 tracking-[-0.04em] text-white" data-count={v.value} data-suffix={v.suffix}>
        {v.value}
        {v.suffix}
      </p>
      <p className="mt-1 text-[12px] leading-[16.8px] tracking-[-0.04em] text-white/80">{v.note}</p>

      <svg viewBox="0 0 336 120" className="absolute inset-x-[15px] bottom-[34px] w-[calc(100%-30px)]" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="aurora-vp-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fb800" stopOpacity=".7" />
            <stop offset="1" stopColor="#7fb800" stopOpacity=".05" />
          </linearGradient>
          <pattern id="aurora-vp-bars" width="19" height="10" patternUnits="userSpaceOnUse">
            <rect width="3" height="10" x="16" fill="#000" opacity=".55" />
          </pattern>
        </defs>
        <path d="M0 18 C28 16 48 22 78 28 S126 36 150 50 S190 74 206 78 S250 90 336 94 V120 H0 Z" fill="url(#aurora-vp-fill)" />
        <path d="M0 18 C28 16 48 22 78 28 S126 36 150 50 S190 74 206 78 S250 90 336 94 V120 H0 Z" fill="url(#aurora-vp-bars)" />
        <path data-draw d="M0 18 C28 16 48 22 78 28 S126 36 150 50 S190 74 206 78 S250 90 336 94" fill="none" stroke="#c8ff2e" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden className="absolute left-[62%] top-[148px] size-2.5 rounded-full border-2 border-white bg-aurora shadow-[0_0_12px_rgb(200_255_46)]" />
      <span className="absolute right-[15px] top-[128px] rounded-full bg-gradient-to-b from-[#e0ff7a] to-[#a4dc14] px-2.5 py-1 text-[12px] font-medium leading-[14.4px] tracking-[-0.04em] text-[#0a0f03] shadow-[0_6px_18px_-6px_rgb(200_255_46/0.8)]">
        {v.tooltip}
      </span>
      <div className="absolute inset-x-[15px] bottom-3 flex justify-between text-[8px] font-light tracking-[-0.04em] text-white/60">
        {v.months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- 2. Engagement / growth rings ---------- */
function GrowthPanel() {
  const g = problem.growth;
  return (
    <div className={panel}>
      <p className="text-[12px] font-light leading-[16.8px] tracking-[-0.04em] text-white">{g.engagementLabel}</p>
      <p className="mt-1 text-[40px] font-semibold leading-10 tracking-[-0.04em] text-white" data-count={g.engagement} data-suffix={g.suffix}>
        {g.engagement}
        {g.suffix}
      </p>

      <div aria-hidden className="absolute left-1/2 top-1/2 size-[210px] -translate-x-1/2 -translate-y-[44%]">
        {[1, 0.78, 0.56, 0.36].map((s, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border border-[rgb(200_255_46/0.35)]"
            style={{
              width: `${s * 100}%`,
              height: `${s * 100}%`,
              transform: "translate(-50%,-50%)",
              background: `radial-gradient(circle, rgb(200 255 46 / ${0.05 + i * 0.07}) 0%, rgb(24 40 8 / ${0.35 - i * 0.04}) 100%)`,
              boxShadow: "inset 0 0 24px rgb(200 255 46 / 0.12)",
            }}
          />
        ))}
        <span className="absolute left-1/2 top-1/2 grid size-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-b from-[#c8ff2e] to-[#7fb800] shadow-[0_0_28px_rgb(200_255_46/0.7),inset_0_-2px_3px_rgb(255_255_255/0.4)]">
          <svg viewBox="0 0 24 24" className="ml-0.5 size-5" aria-hidden>
            <path fill="#0a0f03" d="M8 5.5v13a1 1 0 0 0 1.5.9l10.6-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
          </svg>
        </span>
      </div>

      <span className="absolute right-[18px] top-[40px] flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#2f4a10] to-[#0f1a06] px-3 py-1 text-[12px] leading-[14.4px] tracking-[-0.04em] text-white/90 backdrop-blur-[6px]">
        <span aria-hidden className="size-2 rounded-full border border-aurora" />
        {g.chips[0]}
      </span>
      <span className="absolute bottom-[40px] left-[22px] flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#2f4a10] to-[#0f1a06] px-3 py-1 text-[12px] leading-[14.4px] tracking-[-0.04em] text-white/90 backdrop-blur-[6px]">
        <span aria-hidden className="size-2 rounded-[2px] border border-aurora" />
        {g.chips[1]}
      </span>

      <div className="absolute bottom-[14px] right-[18px] text-right">
        <p className="text-[12px] font-light leading-[16.8px] tracking-[-0.04em] text-white/80">{g.growthLabel}</p>
        <p className="text-[40px] font-semibold leading-10 tracking-[-0.04em] text-white" data-count={g.growth} data-pad="2" data-suffix="%">
          0{g.growth}%
        </p>
      </div>
    </div>
  );
}

/* ---------- 3. Consistency tracker ---------- */
function ConsistencyPanel() {
  const c = problem.consistency;
  return (
    <div className={panel}>
      <p className="text-[12px] leading-[16.8px] tracking-[-0.04em] text-white/30">{c.label}</p>
      <p className="mt-1 text-[24px] font-semibold leading-[28px] tracking-[-0.05em] text-white">{c.title}</p>

      <p className="mt-5 text-[10px] font-medium leading-[14px] tracking-[-0.04em] text-white/30">{c.activityLabel}</p>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {c.days.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1.5">
            <span className={`text-[10px] leading-[14px] tracking-[-0.04em] ${c.posted[i] ? "text-white/80" : "text-white/40"}`}>{d}</span>
            <span
              className={`size-[22px] rounded-full ${
                c.posted[i]
                  ? "bg-[radial-gradient(circle_at_35%_30%,#c8ff2e,#7fb800)] shadow-[0_0_12px_rgb(200_255_46/0.55)]"
                  : "border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgb(255_255_255/0.14),rgb(255_255_255/0.03))]"
              }`}
            />
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] font-medium leading-[14px] tracking-[-0.04em] text-white/30">{c.outputLabel}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <p className="flex items-baseline gap-1.5">
          <span className="text-[28px] font-medium leading-7 tracking-[-0.05em] text-aurora">
            <span data-count="3">3</span>
            <span className="text-white/60"> / 10</span>
          </span>
          <span className="text-[10px] tracking-[-0.04em] text-white/70">{c.outputNote}</span>
        </p>
        <span className="text-[12px] font-medium tracking-[-0.04em] text-white/70" data-count={c.percent} data-suffix="%">
          {c.percent}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-[#c8ff2e] to-[#7fb800]" style={{ width: `${c.percent}%` }} />
      </div>
    </div>
  );
}

export default function Problem() {
  const panels = [<ViewsPanel key="v" />, <GrowthPanel key="g" />, <ConsistencyPanel key="c" />];
  return (
    <section className="relative overflow-x-clip py-20 md:py-[120px]" aria-labelledby="problem-title">
      <div className="container-x">
        <div className="mx-auto max-w-[674px]">
          <SectionHeader badge={problem.badge} title={problem.title} description={problem.description} titleClass="max-w-[558px] mx-auto" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-2.5 md:mt-20 md:grid-cols-3">
          {problem.cards.map((card, i) => (
            <article key={card.title} data-reveal className="glass flex flex-col gap-8 p-4 md:p-6 lg:p-8">
              {panels[i]}
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-[28px] font-medium leading-[28px] tracking-[-0.03em] text-cream">{card.title}</h3>
                <p className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
