import { services } from "@/lib/data";
import Button from "./Button";
import SectionHeader, { Lines } from "./SectionHeader";
import { GlassPlatform, type PlatformKey } from "./Icons";

const growIcons = [
  "from-[#efffb0] to-[#7fb800]",
  "from-[#efffb0] to-[#7fb800]",
  "from-[#c8ff2e] to-[#7fb800]",
];

export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 py-20 md:py-[120px]" aria-labelledby="services-title">

      <div className="container-x">
        <div className="mx-auto max-w-[1094px]">
          <div className="mx-auto max-w-[888px]">
            <SectionHeader badge={services.badge} title={services.title} description={services.description} descClass="max-w-[710px]" />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-2.5 md:mt-[60px] md:grid-cols-3">
            {services.cards.map((c) => (
              <article
                key={c.lead}
                data-reveal
                className="glass glass-glow flex min-h-[460px] flex-col items-center justify-between px-6 py-8 text-center md:min-h-[536px]"
              >
                <h3 className="font-display text-[32px] font-medium leading-[40px] tracking-[-0.03em] text-cream md:text-[40px] md:leading-[48px]">
                  {c.lead} <span className="text-[#c8ff2e]">{c.accent}</span>
                </h3>
                <GlassPlatform platform={c.icon as PlatformKey} className="my-6 w-[190px] drop-shadow-[0_20px_40px_rgb(200_255_46/0.25)] md:w-[230px]" />
                <p className="max-w-[274px] text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/70">{c.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* More content, less chaos */}
        <div
          data-reveal
          className="glass glass-glow mt-20 p-6 md:mt-[100px] md:p-10 lg:mx-auto lg:max-w-[1090px]"
        >
          <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-8">
            <div className="flex max-w-[384px] flex-col justify-between gap-10 md:py-6">
              <div className="flex flex-col gap-6">
                <h3 className="font-display text-[24px] font-medium leading-[31.2px] tracking-[-0.03em] text-white md:text-[48px] md:leading-[62.4px]">
                  <Lines lines={services.grow.title} />
                </h3>
                <p className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/70">{services.grow.description}</p>
              </div>
              <div>
                <Button href={services.grow.cta.href} variant="lime">
                  {services.grow.cta.label}
                </Button>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2.5 md:w-[318px] md:shrink-0">
              {services.grow.cards.map((c, i) => (
                <article key={c.title} className="glass-inset p-6">
                  <span className={`block size-5 rounded-full bg-gradient-to-br ${growIcons[i]} shadow-[0_0_14px_rgb(200_255_46/0.5)]`} aria-hidden />
                  <div aria-hidden className="my-5 h-px w-full bg-gradient-to-r from-white/25 to-transparent" />
                  <h4 className="font-display text-[24px] font-medium leading-[26.4px] tracking-[-0.03em] text-white">{c.title}</h4>
                  <p className="mt-3 text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/70">{c.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
