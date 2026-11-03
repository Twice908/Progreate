"use client";

import { useRef } from "react";
import { claimMotion, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { hero } from "@/lib/data";
import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import Stars from "@/components/ui/Stars";
import { Sparkle } from "@/components/ui/Icons";

/** width/height at the 1440px design, plus perspective tilt and placeholder hue. */
const stage = [
  { w: 330, h: 470, r: 24, hue: 285 },
  { w: 175, h: 266, r: 14, hue: 32 },
  { w: 133, h: 194, r: 8, hue: 20 },
  { w: 122, h: 175, r: 0, hue: 60 },
  { w: 133, h: 196, r: -8, hue: 150 },
  { w: 176, h: 268, r: -14, hue: 215 },
  { w: 330, h: 450, r: -24, hue: 18 },
];

const tagIcons = [
  // short video editing
  <svg key="v" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2.5" y="3.5" width="15" height="13" rx="3" />
    <path d="m8.5 7.6 4 2.4-4 2.4V7.6Z" />
  </svg>,
  // content strategy
  <svg key="s" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2.5" y="2.5" width="15" height="15" rx="3.5" />
    <path d="M7 10.5 9 12.5l4-5" />
  </svg>,
  // growth optimization
  <svg key="g" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2.5" y="2.5" width="15" height="15" rx="3.5" />
    <path d="M6.5 13.5 9 10l2 2 2.5-4" />
  </svg>,
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!claimMotion()) return;
        const title = el.querySelector<HTMLElement>("[data-hero-title]")!;
        const split = SplitText.create(title, { type: "words" });
        gsap.set([...el.querySelectorAll("[data-intro]"), title], { opacity: 1 });

        const cards = gsap.utils.toArray<HTMLElement>("[data-hero-card]", el);
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
        tl.from("[data-intro='badge']", { opacity: 0, y: 16, duration: 0.7 })
          .from(split.words, { opacity: 0, y: 26, filter: "blur(14px)", duration: 1, stagger: 0.07, clearProps: "filter,transform" }, "-=0.35")
          .from("[data-intro='desc']", { opacity: 0, y: 20, filter: "blur(8px)", duration: 0.9, clearProps: "filter,transform" }, "-=0.55")
          .from("[data-intro='cta']", { opacity: 0, y: 18, duration: 0.8 }, "-=0.6")
          .from(cards, { opacity: 0, y: 140, scale: 0.92, duration: 1.3, stagger: { each: 0.09, from: "center" }, ease: "expo.out" }, "-=0.7")
          .from("[data-intro='tags']", { opacity: 0, y: 24, duration: 0.9 }, "-=0.7");

        // Cards drift upward slightly as the hero scrolls away.
        gsap.to("[data-hero-stage]", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        // Glow follows scroll a touch slower than the content.
        gsap.to("[data-hero-glow]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });

        return () => split.revert();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el.querySelectorAll("[data-intro], [data-hero-title]"), { opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden pb-24 pt-[140px] md:pb-32 md:pt-[196px]">
      {/* Backdrop: ember glow, soft haze, pinstripes, stars */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-hero-glow className="absolute -left-[260px] -top-[330px] size-[990px] md:-left-[300px]">
          <div
            className="absolute inset-0 rounded-full blur-[36px]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgb(255 112 36) 0%, rgb(250 97 20 / 0.85) 24%, rgb(214 70 14 / 0.4) 46%, transparent 66%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full opacity-60 mix-blend-multiply"
            style={{ background: "repeating-radial-gradient(circle at 50% 50%, rgb(0 0 0 / 0.0) 0 40px, rgb(0 0 0 / 0.28) 40px 70px)" }}
          />
        </div>
        <div
          className="absolute left-1/2 top-[160px] h-[570px] w-[809px] -translate-x-1/2 rounded-full blur-[60px]"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgb(150 52 18 / 0.45) 0%, transparent 100%)" }}
        />
        <div className="stripes absolute inset-0 [mask-image:linear-gradient(180deg,#000_30%,transparent_100%)]" />
        <Stars count={70} seed={3} />
      </div>

      <div className="container-x relative flex flex-col items-center text-center">
        <div data-intro="badge">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-4 py-1.5 text-[16px] leading-[22.4px] tracking-[-0.02em] text-white backdrop-blur-[25px]">
            <Sparkle className="size-4" />
            {hero.badge}
          </span>
        </div>

        <h1 data-hero-title className="t-h1 mt-6 max-w-[856px] text-balance md:mt-10">
          {hero.title}
        </h1>

        <p data-intro="desc" className="t-lead mt-6 max-w-[674px] text-pretty md:mt-10">
          {hero.description}
        </p>

        <div data-intro="cta" className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row md:mt-10">
          <Button href={hero.primary.href} variant="ember" className="w-full sm:w-auto">
            {hero.primary.label}
          </Button>
          <Button href={hero.secondary.href} variant="ghost" className="w-full sm:w-auto">
            {hero.secondary.label}
          </Button>
        </div>
      </div>

      {/* Curved 3D carousel. Sized in --u so the 1440px composition scales down smoothly. */}
      <div className="relative mt-12 h-[300px] [--u:0.62px] md:mt-14 md:h-[400px] md:[--u:0.0694vw] min-[1440px]:[--u:1px] min-[1440px]:h-[500px]" style={{ perspective: "1400px" }}>
        <div data-hero-stage className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center [gap:calc(var(--u)*25)]" style={{ transformStyle: "preserve-3d" }}>
          {stage.map((c, i) => (
            <div
              key={i}
              data-hero-card
              className="shrink-0 overflow-hidden rounded-[22px] border border-white/10 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] will-change-transform"
              style={{ width: `calc(var(--u) * ${c.w})`, height: `calc(var(--u) * ${c.h})`, transform: `rotateY(${c.r}deg)` }}
            >
              <Media kind="portrait" hue={c.hue} className="size-full" alt={`Showcase video ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="container-x relative mt-10 flex justify-center md:mt-14">
        <div data-intro="tags" className="relative">
          <div aria-hidden className="absolute inset-x-[8%] -bottom-6 h-[93px] rounded-full bg-[rgb(210_97_40/0.45)] blur-[60px]" />
          <ul className="relative flex flex-col items-start gap-3 rounded-[28px] border border-white/[0.07] bg-surface/90 px-6 py-4 backdrop-blur-[5px] md:flex-row md:items-center md:gap-5 md:rounded-[48px]">
            {hero.tags.map((t, i) => (
              <li key={t} className="flex items-center gap-5 text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/80">
                <span className="flex items-center gap-2">
                  <span className="text-white/90">{tagIcons[i]}</span>
                  {t}
                </span>
                {i < hero.tags.length - 1 && <span aria-hidden className="hidden size-1.5 rotate-45 bg-ember md:block" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
