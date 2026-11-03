import { services } from "@/lib/data";
import Button from "@/components/ui/Button";
import SectionHeader, { Lines } from "@/components/ui/SectionHeader";
import Stars from "@/components/ui/Stars";
import { GlassPlatform, type PlatformKey } from "@/components/ui/Icons";

const growIcons = [
  "from-[#ffb27a] to-[#d4511a]",
  "from-[#ffc28a] to-[#c8501f]",
  "from-[#ff9a5c] to-[#b8441a]",
];

export default function Services() {
  return (
    <section id="services" className="relative isolate scroll-mt-24 overflow-hidden py-20 md:py-[120px]" aria-labelledby="services-title">
      <div aria-hidden className="absolute left-1/2 top-[640px] -z-10 hidden h-[640px] w-[799px] -translate-x-1/2 rounded-full blur-[110px] [background:radial-gradient(50%_50%_at_50%_50%,rgb(200_70_20/0.28),transparent)] md:block" />
      <Stars count={36} seed={31} className="-z-10" />

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
                className="card-glass glow-bottom flex min-h-[460px] flex-col items-center justify-between px-6 py-8 text-center md:min-h-[536px]"
              >
                <h3 className="font-display text-[32px] font-medium leading-[40px] tracking-[-0.03em] text-cream md:text-[40px] md:leading-[48px]">
                  {c.lead} <span className="text-[#e0764a]">{c.accent}</span>
                </h3>
                <GlassPlatform platform={c.icon as PlatformKey} className="my-6 w-[190px] drop-shadow-[0_20px_40px_rgb(250_97_20/0.25)] md:w-[230px]" />
                <p className="max-w-[274px] text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/70">{c.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* More content, less chaos */}
        <div
          data-reveal
          className="relative isolate mt-20 overflow-hidden rounded-2xl border border-white/[0.07] p-6 md:mt-[100px] md:p-10 lg:mx-auto lg:max-w-[1090px]"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(90deg, rgb(0 0 0 / 0.28) 0 24px, transparent 24px 52px)",
              "radial-gradient(55% 90% at 62% 55%, rgb(200 64 20 / 0.55) 0%, transparent 70%)",
              "radial-gradient(40% 60% at 100% 0%, rgb(230 90 40 / 0.5) 0%, transparent 70%)",
              "linear-gradient(180deg, #0c0603 0%, #130804 100%)",
            ].join(","),
          }}
        >
          <Stars count={22} seed={41} className="-z-10" />
          <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-8">
            <div className="flex max-w-[384px] flex-col justify-between gap-10 md:py-6">
              <div className="flex flex-col gap-6">
                <h3 className="font-display text-[24px] font-medium leading-[31.2px] tracking-[-0.03em] text-white md:text-[48px] md:leading-[62.4px]">
                  <Lines lines={services.grow.title} />
                </h3>
                <p className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/70">{services.grow.description}</p>
              </div>
              <div>
                <Button href={services.grow.cta.href} variant="ember">
                  {services.grow.cta.label}
                </Button>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2.5 md:w-[318px] md:shrink-0">
              {services.grow.cards.map((c, i) => (
                <article key={c.title} className="rounded-xl border border-white/[0.08] bg-bg/90 p-6 backdrop-blur-sm">
                  <span className={`block size-5 rounded-full bg-gradient-to-br ${growIcons[i]} shadow-[0_0_14px_rgb(250_97_20/0.5)]`} aria-hidden />
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
