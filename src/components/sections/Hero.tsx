"use client";

import { useRef } from "react";
import { claimMotion, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { hero } from "@/lib/data";
import Button from "@/components/ui/Button";
import Stars from "@/components/ui/Stars";
import { Sparkle } from "@/components/ui/Icons";
import HeroCarousel, { type CarouselItem } from "./HeroCarousel";

/**
 * Placeholder showcase cards. Add `src` to any item to show a real photo/video poster instead
 * (7 distinct items keep every card in the visible composition unique).
 */
const showcase: CarouselItem[] = [
  { hue: 285 },
  { hue: 32 },
  { hue: 20 },
  { hue: 60 },
  { hue: 150 },
  { hue: 215 },
  { hue: 18 },
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

/*
 * The orange "Glow" from the original design: a 990×955 box holding FOUR concentric circles, shaded in
 * different oranges so each layer reads as its own ring, with only the upper half visible (the lower half
 * dissolves). Radii, colours, per-circle opacity falloff and the fade were fitted to the original glow
 * component (RMS ≈ 2% of 255). In the hero, ~37% of the box's width hangs off the left edge and ~22% off
 * the top, so only the remaining part is seen. Fixed px — it does not scale with the viewport, like the original.
 */
const GLOW_W = 990;
const GLOW_H = 955;
const GLOW_CX = GLOW_W / 2; // all four circles share the box centre
const GLOW_CY = GLOW_H / 2;
// Offset of the box from the hero's top-left (negative = overflowing/hidden). Best fit to the real hero is
// −364 / −212 (36.8% / 22.2%); set −396 / −191 for exactly 40% / 20%.
const GLOW_LEFT = -364;
const GLOW_TOP = -212;

type GlowCircle = {
  r: number; // radius, px
  rgb: [number, number, number];
  alpha: [number, number, number, number]; // opacity at 0 / 50 / 85 / 100% of the circle's gradient
  center: [number, number]; // gradient centre relative to the circle's centre (a spotlight above the middle)
};
// Outermost first, so inner circles paint on top. Colours are the original palette nudged toward the
// saturation visible in the live hero.
const GLOW_CIRCLES: GlowCircle[] = [
  { r: 391, rgb: [255, 99, 7], alpha: [1.0, 0.4, 0.05, 0.02], center: [40, -204] },
  { r: 333, rgb: [224, 89, 4], alpha: [0.75, 0.72, 0.02, 0], center: [-6, -225] },
  { r: 287, rgb: [222, 102, 8], alpha: [1.0, 0.53, 0, 0.02], center: [-60, -288] },
  { r: 238, rgb: [255, 121, 13], alpha: [1.0, 0.28, 0, 0], center: [7, -19] },
];

const circleGradient = ({ r, rgb: [R, G, B], alpha, center: [gx, gy] }: GlowCircle) =>
  `radial-gradient(circle ${(r * 1.15).toFixed(1)}px at ${(r + gx).toFixed(1)}px ${(r + gy).toFixed(1)}px, ${[0, 50, 85, 100]
    .map((stop, i) => `rgb(${R} ${G} ${B} / ${alpha[i]}) ${stop}%`)
    .join(", ")})`;

/** Eased (smoothstep) vertical fade: fully visible down to `from`, gone by `to` (px from the box top). */
const smoothFade = (from: number, to: number) => {
  const steps = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    return `rgb(0 0 0 / ${(1 - t * t * (3 - 2 * t)).toFixed(3)}) ${(from + (to - from) * t).toFixed(1)}px`;
  });
  return `linear-gradient(180deg, #000 0px, ${steps.join(", ")}, transparent ${GLOW_H}px)`;
};
// Opaque down to 182px above the centre, gone 185px below it.
const GLOW_MASK = smoothFade(GLOW_CY - 182, GLOW_CY + 185);

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

        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
        tl.from("[data-intro='badge']", { opacity: 0, y: 16, duration: 0.7 })
          .from(split.words, { opacity: 0, y: 26, filter: "blur(14px)", duration: 1, stagger: 0.07, clearProps: "filter,transform" }, "-=0.35")
          .from("[data-intro='desc']", { opacity: 0, y: 20, filter: "blur(8px)", duration: 0.9, clearProps: "filter,transform" }, "-=0.55")
          .from("[data-intro='cta']", { opacity: 0, y: 18, duration: 0.8 }, "-=0.6")
          .from("[data-intro='stage']", { opacity: 0, y: 120, duration: 1.3, ease: "expo.out" }, "-=0.7")
          .from("[data-intro='tags']", { opacity: 0, y: 24, duration: 0.9 }, "-=0.7");

        // Carousel drifts up a touch as the hero scrolls away; the glow trails behind at a slower pace.
        gsap.to("[data-hero-stage]", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-glow]", {
          yPercent: 8,
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
    // overflow-x only: glows may spill *down* past the section edge so it blends into the next section.
    <section ref={root} className="relative isolate overflow-x-clip pb-24 pt-[140px] md:pb-32 md:pt-[196px]">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Orange Glow: four concentric circles, upper half visible, left/top partly outside the hero */}
        <div
          data-hero-glow
          className="absolute"
          style={{ left: GLOW_LEFT, top: GLOW_TOP, width: GLOW_W, height: GLOW_H, maskImage: GLOW_MASK, WebkitMaskImage: GLOW_MASK }}
        >
          {GLOW_CIRCLES.map((c) => (
            <div
              key={c.r}
              className="absolute rounded-full"
              style={{ left: GLOW_CX - c.r, top: GLOW_CY - c.r, width: c.r * 2, height: c.r * 2, backgroundImage: circleGradient(c) }}
            />
          ))}
        </div>

        {/* Warm haze behind the headline */}
        <div
          className="absolute left-1/2 top-[29px] h-[840px] w-[1040px] -translate-x-1/2"
          style={{
            backgroundImage:
              "radial-gradient(closest-side, rgb(139 64 28 / 0.45) 0%, rgb(139 64 28 / 0.38) 35%, rgb(139 64 28 / 0.09) 69%, transparent 100%)",
          }}
        />

        {/* Wide ember glow that straddles the bottom edge: its lower half lights the next section,
            so there is no seam where the hero ends. Radial and fully transparent at its own edges. */}
        <div
          className="absolute bottom-0 left-1/2 h-[760px] w-[min(1700px,170%)] -translate-x-1/2 translate-y-1/2"
          style={{
            backgroundImage:
              "radial-gradient(closest-side, rgb(178 66 22 / 0.28) 0%, rgb(150 52 16 / 0.15) 38%, rgb(120 40 12 / 0.05) 68%, transparent 100%)",
          }}
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

      {/* Draggable carousel (drag with mouse or finger, or use the arrow keys) */}
      <div data-intro="stage" className="relative mt-12 md:mt-14">
        <div data-hero-stage>
          <HeroCarousel items={showcase} />
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
