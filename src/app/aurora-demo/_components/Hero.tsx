"use client";

import { useRef } from "react";
import { claimMotion, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { hero } from "@/lib/data";
import Button from "./Button";
import HeroPipeline from "./HeroPipeline";
import { Sparkle } from "./Icons";

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

        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
        tl.from("[data-intro='badge']", { opacity: 0, y: 16, duration: 0.7 })
          .from(split.words, { opacity: 0, y: 26, filter: "blur(14px)", duration: 1, stagger: 0.07, clearProps: "filter,transform" }, "-=0.35")
          .from("[data-intro='desc']", { opacity: 0, y: 20, filter: "blur(8px)", duration: 0.9, clearProps: "filter,transform" }, "-=0.55")
          .from("[data-intro='cta']", { opacity: 0, y: 18, duration: 0.8 }, "-=0.6")
          .from("[data-intro='stage']", { opacity: 0, y: 80, duration: 1.3, ease: "expo.out" }, "-=0.7")
          .from("[data-intro='tags']", { opacity: 0, y: 24, duration: 0.9 }, "-=0.7");

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
    <section ref={root} className="relative overflow-x-clip pb-16 pt-[120px] md:pb-24 md:pt-[150px]">
      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div className="flex flex-col items-start">
          <div data-intro="badge">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[16px] leading-[22.4px] tracking-[-0.02em] text-white backdrop-blur-md">
              <Sparkle className="size-4" />
              {hero.badge}
            </span>
          </div>

          <h1 data-hero-title className="t-h1 mt-6 text-balance md:mt-8">
            {hero.title}
          </h1>

          <p data-intro="desc" className="t-lead mt-6 max-w-[560px] text-pretty md:mt-8">
            {hero.description}
          </p>

          <div data-intro="cta" className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row md:mt-10">
            <Button href={hero.primary.href} className="w-full sm:w-auto">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="ghost" className="w-full sm:w-auto">
              {hero.secondary.label}
            </Button>
          </div>
        </div>

        <div data-intro="stage" className="min-w-0">
          <HeroPipeline />
        </div>
      </div>

      <div className="container-x mt-10 flex justify-center md:mt-14">
        <div data-intro="tags" className="w-full md:w-auto">
          {/* Phone: three equal columns, icon over label. Tablet and up: one pill. */}
          <ul className="glass grid grid-cols-3 py-4 md:flex md:items-center md:gap-5 md:rounded-[48px] md:px-6">
            {hero.tags.map((t, i) => (
              <li
                key={t}
                className={`flex items-center justify-center gap-5 px-2 text-center text-[13px] leading-[17px] tracking-[-0.02em] text-white/80 md:px-0 md:text-left md:text-[16px] md:leading-[22.4px] ${
                  i ? "border-l border-white/10 md:border-0" : ""
                }`}
              >
                <span className="flex flex-col items-center gap-2 md:flex-row">
                  <span className="text-aurora md:text-white/90">{tagIcons[i]}</span>
                  {t}
                </span>
                {i < hero.tags.length - 1 && <span aria-hidden className="hidden size-1.5 rotate-45 bg-aurora md:block" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
