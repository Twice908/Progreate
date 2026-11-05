import { pricing } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
import GlowGroup from "./GlowGroup";
import { CheckBadge } from "./Icons";

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 md:py-[120px]" aria-labelledby="pricing-title">
      <div className="container-x">
        <SectionHeader badge={pricing.badge} title={pricing.title} description={pricing.description} descClass="max-w-[499px]" />

        <GlowGroup className="mt-14 grid grid-cols-1 gap-2.5 md:mt-[60px] lg:grid-cols-3">
          {pricing.plans.map((p) => (
            <article
              key={p.name}
              data-reveal
              {...(p.featured ? { "data-glow-card": true } : {})}
              className={`glass relative isolate flex flex-col gap-8 overflow-hidden p-6 md:p-8 ${p.featured ? "glass-featured glow-card" : ""}`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -bottom-16 left-1/2 -z-10 h-[140px] w-[105%] -translate-x-1/2 rounded-full blur-[70px] ${
                  p.featured ? "bg-aurora/25" : "bg-aurora/10"
                }`}
              />
              <div>
                <h3 className="font-display text-[22px] font-medium leading-[22px] tracking-[-0.02em] text-white md:text-[32px] md:leading-8 md:tracking-[-0.02em]">{p.name}</h3>
                <p className="mt-3 text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60">{p.description}</p>
              </div>

              <p className="flex items-baseline gap-3">
                <span className="font-display text-[56px] font-normal leading-[64px] tracking-[-0.03em] [background-image:linear-gradient(180deg,#efffb0_0%,#a4dc14_100%)] [-webkit-background-clip:text] [background-clip:text] [color:transparent] md:text-[72px] md:leading-[64.8px]">
                  {p.price}
                </span>
                <span className="text-[20px] leading-[28px] tracking-[-0.04em] text-white/80">{p.period}</span>
              </p>

              <ul className="flex flex-col gap-3.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/85">
                    <CheckBadge className="size-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                {p.featured ? (
                  <Button href="/contact" variant="lime" className="w-full">
                    {p.cta}
                  </Button>
                ) : (
                  <Button href="/contact" variant="outline" arrow={false}>
                    {p.cta}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </GlowGroup>
      </div>
    </section>
  );
}
