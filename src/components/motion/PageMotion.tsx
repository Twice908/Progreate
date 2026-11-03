"use client";

import { useRef, type ReactNode } from "react";
import { claimMotion, gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Declarative scroll motion for a page. Server-rendered sections just tag elements:
 *
 *   data-split                 word-by-word blur-in (headings)
 *   data-reveal                fade/blur/rise on enter; siblings in view stagger
 *   data-count="68"            count up from 0 (optional data-suffix, data-prefix, data-decimals)
 *   data-draw                  SVG path stroke draw
 *   data-parallax="0.15"       scrubbed vertical drift (fraction of element height)
 *
 * Everything is created inside a gsap.context (via useGSAP) so it reverts cleanly when a route
 * is hidden/re-shown by Next's Activity-based navigation.
 */
export default function PageMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const q = <T extends HTMLElement | SVGElement = HTMLElement>(sel: string) =>
        gsap.utils.toArray<T>(sel, scope);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Page was already revealed by the load failsafe — don't re-hide content to animate it.
        if (!claimMotion()) return;

        // Headings: split into words, blur them in.
        q("[data-split]").forEach((el) => {
          const split = SplitText.create(el, { type: "words", wordsClass: "will-change-transform" });
          gsap.set(el, { opacity: 1 });
          gsap.from(split.words, {
            opacity: 0,
            y: 22,
            filter: "blur(12px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.055,
            clearProps: "filter,transform",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Generic reveal, staggered per batch.
        const reveals = q("[data-reveal]");
        if (reveals.length) {
          ScrollTrigger.batch(reveals, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { opacity: 0, y: 36, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.95, ease: "power3.out", stagger: 0.12, overwrite: true, clearProps: "filter,transform" },
              ),
          });
        }

        // Count-ups.
        q("[data-count]").forEach((el) => {
          const target = parseFloat(el.dataset.count ?? "0");
          const decimals = parseInt(el.dataset.decimals ?? "0", 10);
          const prefix = el.dataset.prefix ?? "";
          const suffix = el.dataset.suffix ?? "";
          const pad = parseInt(el.dataset.pad ?? "0", 10);
          const fmt = (n: number) => {
            const s = n.toFixed(decimals);
            return prefix + (pad ? s.padStart(pad, "0") : s) + suffix;
          };
          const state = { v: 0 };
          el.textContent = fmt(0);
          gsap.to(state, {
            v: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => (el.textContent = fmt(state.v)),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // SVG line draw.
        q<SVGGeometryElement>("[data-draw]").forEach((path) => {
          const len = path.getTotalLength?.() ?? 0;
          if (!len) return;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.inOut",
            scrollTrigger: { trigger: path, start: "top 90%", once: true },
          });
        });

        // Parallax.
        q("[data-parallax]").forEach((el) => {
          const amt = parseFloat(el.dataset.parallax ?? "0.1");
          gsap.fromTo(
            el,
            { yPercent: -amt * 100 },
            {
              yPercent: amt * 100,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([...q("[data-split]"), ...q("[data-reveal]")], { opacity: 1 });
      });

      // Images/fonts can shift layout; make sure trigger positions are right.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const t = window.setTimeout(refresh, 400);

      return () => {
        window.removeEventListener("load", refresh);
        window.clearTimeout(t);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
