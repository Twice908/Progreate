import { fix } from "@/lib/data";
import Button from "./Button";
import GlowGroup from "./GlowGroup";
import { SectionBadge } from "./SectionHeader";

export default function HowWeFix() {
  return (
    <section className="py-10 md:py-[60px]" aria-labelledby="fix-title">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex max-w-[888px] flex-col items-start gap-5">
            <SectionBadge>{fix.badge}</SectionBadge>
            <h2 id="fix-title" data-split className="t-h2 text-balance">
              {fix.title}
            </h2>
            <p data-reveal className="t-lead max-w-[674px] text-pretty">
              {fix.description}
            </p>
          </div>
          <div data-reveal className="md:pb-1">
            <Button href={fix.cta.href} variant="lime" className="w-full md:w-auto">
              {fix.cta.label}
            </Button>
          </div>
        </div>

        {/* Where the aurora ends: the strands converge on this line, then light runs out along the cards. */}
        <GlowGroup>
        <div aria-hidden data-aurora-merge="primary" className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-aurora/45 to-transparent md:mt-[60px]" />

        <div className="mt-10 grid grid-cols-1 gap-2.5 md:mt-[50px] md:grid-cols-2 lg:grid-cols-4">
          {fix.stats.map((s) => (
            <article key={s.label} data-reveal data-glow-card className="glass glass-glow glow-card flex min-h-[317px] flex-col justify-between px-6 py-8">
              <div>
                <p className="text-[20px] leading-[28px] tracking-[-0.04em] text-white/80">{s.label}</p>
                <p
                  className="text-aurora-grad mt-6 font-display text-[64px] font-normal leading-[72px] tracking-[-0.02em] md:text-[72px]"
                  data-count={s.value}
                  data-suffix={s.suffix}
                >
                  {s.value}
                  {s.suffix}
                </p>
              </div>
              <p className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/70">{s.description}</p>
            </article>
          ))}
        </div>
        </GlowGroup>
      </div>
    </section>
  );
}
