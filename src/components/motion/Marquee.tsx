"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Seamless horizontal ticker driven by GSAP. Content is rendered twice; the track
 * tweens by exactly one copy's width, so the loop point is invisible.
 * `speed` is in px/second. Pass `reverse` to run right-to-left → left-to-right.
 */
export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  gap = 24,
  className = "",
  pauseOnHover = false,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  gap?: number;
  className?: string;
  pauseOnHover?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      const one = first.current;
      if (!el || !one) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const build = () => {
          const w = one.offsetWidth;
          if (!w) return null;
          return gsap.fromTo(
            el,
            { x: reverse ? -w : 0 },
            { x: reverse ? 0 : -w, duration: w / speed, ease: "none", repeat: -1 },
          );
        };
        let tween = build();
        const ro = new ResizeObserver(() => {
          const t = tween?.progress() ?? 0;
          tween?.kill();
          tween = build();
          tween?.progress(t);
        });
        ro.observe(one);

        const enter = () => tween?.timeScale(0.25);
        const leave = () => tween?.timeScale(1);
        if (pauseOnHover) {
          el.addEventListener("mouseenter", enter);
          el.addEventListener("mouseleave", leave);
        }
        return () => {
          ro.disconnect();
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [speed, reverse] },
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div ref={first} className="flex shrink-0" style={{ paddingRight: gap, gap }}>
          {children}
        </div>
        <div aria-hidden className="flex shrink-0" style={{ paddingRight: gap, gap }}>
          {children}
        </div>
      </div>
    </div>
  );
}
