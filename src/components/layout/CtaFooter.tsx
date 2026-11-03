import Link from "next/link";
import { cta, footer, brand } from "@/lib/data";
import Button from "@/components/ui/Button";
import Stars from "@/components/ui/Stars";
import { Lines } from "@/components/ui/SectionHeader";
import { Logo } from "@/components/ui/Icons";
import PageMotion from "@/components/motion/PageMotion";

export default function CtaFooter() {
  return (
    <PageMotion>
      <section className="container-x pt-20 md:pt-[120px]" aria-labelledby="cta-title">
        <div
          className="relative isolate overflow-hidden rounded-2xl border border-white/[0.08] px-5 py-14 text-center md:py-[88px]"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(90deg, rgb(0 0 0 / 0.30) 0 26px, rgb(0 0 0 / 0) 26px 54px)",
              "radial-gradient(70% 95% at 100% 0%, rgb(214 74 28 / 0.75) 0%, transparent 70%)",
              "radial-gradient(60% 80% at 0% 100%, rgb(160 50 16 / 0.55) 0%, transparent 70%)",
              "linear-gradient(180deg, #0b0502 0%, #1c0b05 55%, #6d230c 100%)",
            ].join(","),
          }}
        >
          <Stars count={26} seed={21} className="-z-10" />
          <div className="mx-auto flex max-w-[720px] flex-col items-center gap-8">
            <h2 id="cta-title" data-split className="t-h2 text-balance">
              <Lines lines={cta.title} />
            </h2>
            <p data-reveal className="t-lead max-w-[560px] text-pretty text-white/70">
              {cta.description}
            </p>
            <div data-reveal className="flex flex-col items-center gap-4">
              <Button href={cta.button.href} variant="ember">
                {cta.button.label}
              </Button>
              <span className="text-[14px] leading-[19.6px] tracking-[-0.04em] text-white/70">{cta.note}</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative mt-16 overflow-hidden md:mt-20">
        <div className="container-x relative z-10">
          <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-8">
            <Link href="/" className="flex items-center gap-2.5 self-start" aria-label={`${brand.name} home`}>
              <Logo className="size-8 text-white md:size-10" />
              <span
                className="font-display text-[28px] leading-none tracking-[-0.02em] md:text-[32px]"
                style={{ backgroundImage: "linear-gradient(90deg,#fff 55%,#ff8a4d 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
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
                          <Link href={l.href} className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60 transition-colors hover:text-white">
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

          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-ember/40 to-transparent md:mt-16" />

          <div className="mt-8 flex flex-col justify-between gap-3 text-[14px] leading-[19.6px] tracking-[-0.04em] text-white/70 md:flex-row md:items-start">
            <p>{footer.copyright}</p>
          
          </div>
        </div>

        {/* Oversized wordmark, fading into the page edge */}
        <div aria-hidden className="relative mt-3 select-none overflow-hidden [container-type:inline-size] md:-mt-3">
          <Stars count={14} seed={5} />
          <p
            className="stripes-text pointer-events-none whitespace-nowrap text-center font-display font-medium leading-[0.82] tracking-[-0.04em]"
            style={{
              // Sized from the container's width so the whole name always fits (measured: text ≈ 5.24em wide).
              fontSize: "calc(90cqw / 5.24)",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgb(0 0 0 / 0.35) 0 5px, transparent 5px 12px), linear-gradient(180deg, #ff6a2a 0%, #a8340f 55%, rgb(60 20 6 / 0) 100%)",
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
