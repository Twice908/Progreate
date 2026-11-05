"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Card = { element: HTMLElement; near: number; far: number };

/**
 * Lights the borders of the [data-glow-card] elements inside it as you scroll, spreading outward from
 * the [data-aurora-merge] element if there is one, otherwise from the top centre of each card. Follows
 * the scroll, so it plays backwards too.
 */
export default function GlowGroup({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const group = root.current;
      if (!group) return;
      const anchor = group.querySelector("[data-aurora-merge]");
      const state = { progress: 0 };
      let cards: Card[] = [];
      let reach = 1;

      const measure = () => {
        const from = anchor?.getBoundingClientRect();
        cards = gsap.utils.toArray<HTMLElement>("[data-glow-card]", group).map((element) => {
          const box = element.getBoundingClientRect();
          const x = (from ? from.left + from.width / 2 : box.left + box.width / 2) - box.left;
          const y = (from ? from.top : box.top) - box.top;
          element.style.setProperty("--glow-x", `${x}px`);
          element.style.setProperty("--glow-y", `${y}px`);
          const nearX = Math.max(-x, 0, x - box.width);
          const nearY = Math.max(-y, 0, y - box.height);
          return {
            element,
            near: Math.hypot(nearX, nearY),
            far: Math.hypot(Math.max(Math.abs(x), Math.abs(x - box.width)), Math.max(Math.abs(y), Math.abs(y - box.height))),
          };
        });
        reach = Math.max(1, ...cards.map((card) => card.far)) + 80;
      };

      const paint = () => {
        const radius = state.progress * reach;
        for (const { element, near, far } of cards) {
          element.style.setProperty("--glow-radius", `${radius}px`);
          element.style.setProperty("--glow-outer", String(Math.min(1, Math.max(0, (radius - near) / (far - near + 1)))));
        }
      };

      const refresh = () => {
        measure();
        paint();
      };
      refresh();

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(state, {
          progress: 1,
          ease: "none",
          onUpdate: paint,
          scrollTrigger: { trigger: group, start: "top 75%", end: "bottom 80%", scrub: 0.4 },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.progress = 1;
        paint();
      });

      ScrollTrigger.addEventListener("refresh", refresh);
      return () => {
        ScrollTrigger.removeEventListener("refresh", refresh);
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
