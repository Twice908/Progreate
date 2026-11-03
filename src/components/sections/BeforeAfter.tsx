"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { process } from "@/lib/data";

/**
 * Draggable before/after compare. A one-time GSAP "tease" sweep plays when it scrolls
 * into view; pointer or keyboard input takes over from there.
 */
export default function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const s = process.slider;

  useGSAP(
    () => {
      const el = box.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { v: 50 };
        const tween = gsap.timeline({
          paused: true,
          defaults: { ease: "power2.inOut", duration: 0.9 },
          onUpdate: () => !touched.current && setPos(state.v),
        });
        tween.to(state, { v: 28 }).to(state, { v: 72 }).to(state, { v: 50 });
        const st = ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => tween.play() });
        return () => {
          st.kill();
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: box },
  );

  const setFromEvent = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    touched.current = true;
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="relative size-full touch-pan-y select-none overflow-hidden rounded-lg bg-surface"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromEvent(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && setFromEvent(e.clientX)}
    >
      {/* BEFORE: raw, flat */}
      <div className="absolute inset-0 p-4">
        <span className="rounded-full bg-bg px-2 py-0.5 text-[12px] font-light leading-[16.8px] tracking-[-0.04em] text-white/80">{s.before}</span>
        <div className="mt-[72px] space-y-2 pl-1" aria-hidden>
          {[78, 64, 70, 52, 66, 40].map((w, i) => (
            <div key={i} className="h-[3px] rounded-full bg-white/10" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* AFTER: styled */}
      <div className="absolute inset-0 bg-surface p-4" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <div className="flex justify-end">
          <span className="rounded-full bg-bg px-2 py-0.5 text-[12px] font-light leading-[16.8px] tracking-[-0.04em] text-white/80">{s.after}</span>
        </div>
        <div className="absolute right-4 top-[62px] flex w-[46%] flex-col items-center gap-2" aria-hidden>
          <span className="rounded-md bg-gradient-to-b from-[#ff7a45] to-[#e0501a] px-2.5 py-1 text-[11px] font-medium leading-none tracking-[-0.04em] text-white shadow-[0_6px_16px_-6px_rgb(250_97_20/0.8)]">
            {s.tag}
          </span>
          <div className="h-1.5 w-full rounded-full bg-white/25" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/85" />
          <div className="mt-1 flex h-6 items-end gap-[2px]">
            {Array.from({ length: 22 }, (_, i) => (
              <span key={i} className="w-[2px] rounded-full bg-ember" style={{ height: `${30 + ((i * 37) % 70)}%` }} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {s.chips.map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-bg px-2 py-0.5 text-[12px] font-light leading-[16.8px] tracking-[-0.04em] text-white/60">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Handle */}
      <div className="absolute inset-y-0 w-px bg-white/30" style={{ left: `${pos}%` }}>
        <button
          type="button"
          role="slider"
          aria-label="Before / after position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            touched.current = true;
            const step = e.key === "ArrowLeft" ? -4 : 4;
            setPos((p) => Math.min(96, Math.max(4, p + step)));
          }}
          className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-gradient-to-b from-[#ff7a45] to-[#e0501a] shadow-[0_0_24px_rgb(250_97_20/0.6),inset_0_-2px_2px_rgb(255_255_255/0.4)] outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m8 8-4 4 4 4M16 8l4 4-4 4M4 12h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
