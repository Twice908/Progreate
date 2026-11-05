import Link from "next/link";
import { cta, footer, brand } from "@/lib/data";
import Button from "./Button";
import GlowGroup from "./GlowGroup";
import { Lines } from "./SectionHeader";
import { Logo } from "./Icons";
import PageMotion from "@/components/motion/PageMotion";
import { demoHref } from "./links";

export default function CtaFooter() {
  return (
    <PageMotion>
      <section className="container-x pt-20 md:pt-[120px]" aria-labelledby="aurora-cta-title">
        <GlowGroup>
        <div data-aurora-merge="final" data-glow-card className="glass glass-glow glow-card px-5 py-14 text-center md:py-[88px]">
          <div className="mx-auto flex max-w-[720px] flex-col items-center gap-8">
            <h2 id="aurora-cta-title" data-split className="t-h2 text-balance">
              <Lines lines={cta.title} />
            </h2>
            <p data-reveal className="t-lead max-w-[560px] text-pretty text-white/70">
              {cta.description}
            </p>
            <div data-reveal className="flex flex-col items-center gap-4">
              <Button href={cta.button.href} variant="lime">
                {cta.button.label}
              </Button>
              <span className="text-[14px] leading-[19.6px] tracking-[-0.04em] text-white/70">{cta.note}</span>
            </div>
          </div>
        </div>
        </GlowGroup>
      </section>

      <footer className="relative mt-16 overflow-hidden md:mt-20">
        <div className="container-x relative z-10">
          <div className="glass p-6 md:p-10">
          <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-8">
            <Link href={demoHref("/")} className="flex items-center gap-2.5 self-start" aria-label={`${brand.name} home`}>
              <Logo className="size-8 text-white md:size-10" />
              <span
                className="font-display text-[28px] leading-none tracking-[-0.02em] md:text-[32px]"
                style={{ backgroundImage: "linear-gradient(90deg,#fff 55%,#c8ff2e 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
              >
                {brand.name}
              </span>
            </Link>

            <div className="flex gap-16 md:gap-[100px]">
              {[footer.quickLinks, footer.socials].map((col) => (
                <div key={col.title}>
                  <h3 className="text-[20px] leading-[28px] tracking-[-0.04em] text-white/80">{col.title}</h3>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        {l.href.startsWith("http") ? (
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60 transition-colors hover:text-white">
                            {l.label}
                          </a>
                        ) : (
                          <Link href={demoHref(l.href)} className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60 transition-colors hover:text-white">
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-aurora/40 to-transparent md:mt-16" />

          <div className="mt-8 flex flex-col justify-between gap-3 text-[14px] leading-[19.6px] tracking-[-0.04em] text-white/70 md:flex-row md:items-start">
            <p>{footer.copyright}</p>
          </div>
          </div>
        </div>

        {/* Oversized wordmark, fading into the page edge */}
        <div aria-hidden className="relative mt-3 select-none overflow-hidden [container-type:inline-size]">
          <p
            className="stripes-text pointer-events-none whitespace-nowrap text-center font-display font-medium leading-[0.82] tracking-[-0.04em]"
            style={{
              // Sized from the container's width so the whole name always fits (measured: text ≈ 5.24em wide).
              fontSize: "calc(90cqw / 5.24)",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgb(0 0 0 / 0.35) 0 5px, transparent 5px 12px), linear-gradient(180deg, #c8ff2e 0%, #4d7a0a 55%, rgb(20 40 6 / 0) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: 0.85,
              paddingBottom: "0.08em",
            }}
          >
            {brand.name}
          </p>
        </div>
      </footer>
    </PageMotion>
  );
}
