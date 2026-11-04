"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { claimMotion, gsap, useGSAP } from "@/lib/gsap";
import Media from "@/components/ui/Media";

export type CarouselItem = { hue: number; src?: string; alt?: string };

/* ---------------------------------------------------------------------------------------------
 * Draggable, endlessly looping 3D carousel.
 *
 * Every card sits on a "slot" ring. A card's distance from the centre (`o`, in slots, signed) is the
 * only input to its look: position, size and tilt are read off smooth curves that were measured from
 * the original design's static composition. At rest (integer offsets) this reproduces that composition
 * exactly; while moving, the curves make big edge cards travel much faster than small centre cards —
 * that speed difference is the parallax. Each photo also slides inside its own frame, so the image and
 * the frame move at different rates.
 * ------------------------------------------------------------------------------------------- */

// Design-px curves for |o| = 0,1,2,3… (1440px composition; scaled by the CSS `--u` unit).
const X = [0, 152.5, 331.5, 609, 972, 1351, 1730]; // card-centre distance from the middle
const SCALE = [0.37, 0.403, 0.53, 1, 1.05, 1.1, 1.1]; // relative to the 330×470 base card
const TILT = [0, 8, 14, 24, 28, 30, 30]; // rotateY degrees (tilts toward the centre)

const BASE_W = 330;
const BASE_H = 470;
const RADIUS = 22; // design px, kept constant on screen regardless of card scale
const MIN_SLOTS = 11; // enough cards that the loop seam is always off-screen
const PITCH = 200; // design px of pointer travel per slot while dragging
const IMAGE_SHIFT = 5; // % the photo slides inside its frame per slot of offset
const AUTOPLAY_SLOTS_PER_SEC = 0.16;
const IDLE_MS = 2500;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
// Extend a table to negative indices. Position and tilt are *odd* about the centre (left = −right), so the
// reflected neighbour is negated; size is *even*. Getting this right keeps position linear through the
// centre, so the two middle cards never bunch up while crossing.
const mirror = (t: number[], i: number, odd: boolean) => (i < 0 ? (odd ? -t[-i] : t[-i]) : t[Math.min(i, t.length - 1)]);

/** Catmull-Rom through the table, kept inside each segment so it never overshoots. */
function curve(t: number[], a: number, odd = false) {
  const i = Math.min(Math.floor(a), t.length - 2);
  const f = a - i;
  const p0 = mirror(t, i - 1, odd);
  const p1 = mirror(t, i, odd);
  const p2 = mirror(t, i + 1, odd);
  const p3 = mirror(t, i + 2, odd);
  const v =
    0.5 *
    (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f);
  return clamp(v, Math.min(p1, p2), Math.max(p1, p2));
}

/** Signed distance (in slots) from the centre, wrapped onto the ring. */
const wrap = (i: number, pos: number, slots: number) => {
  const o = i - pos;
  return ((((o + slots / 2) % slots) + slots) % slots) - slots / 2;
};

function place(o: number) {
  const a = Math.abs(o);
  const sign = o < 0 ? -1 : 1;
  const s = curve(SCALE, a);
  return {
    // `--u` is the CSS design-px unit (see className on the root), so this is responsive with no JS measuring.
    transform: `translate3d(calc(var(--u) * ${(sign * curve(X, a, true)).toFixed(2)}), 0, 0) rotateY(${(-sign * curve(TILT, a, true)).toFixed(2)}deg) scale(${s.toFixed(4)})`,
    zIndex: String(Math.round(a * 10)),
    opacity: String(a < 4.6 ? 1 : Math.max(0, (5.4 - a) / 0.8)),
    radius: `calc(var(--u) * ${(RADIUS / s).toFixed(2)})`,
    inner: `translate3d(${clamp(-o * IMAGE_SHIFT, -14, 14).toFixed(2)}%, 0, 0) scale(1.35)`,
  };
}

type State = {
  pos: number;
  vel: number;
  dragging: boolean;
  lastX: number;
  lastT: number;
  pitch: number;
  idleSince: number;
  tween: gsap.core.Tween | null;
};

export default function HeroCarousel({ items, autoplay = true }: { items: CarouselItem[]; autoplay?: boolean }) {
  const slots = items.length * Math.ceil(MIN_SLOTS / items.length);
  const root = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef<State>({ pos: 0, vel: 0, dragging: false, lastX: 0, lastT: 0, pitch: PITCH, idleSince: 0, tween: null });

  const settle = (s: State) => {
    const projected = s.pos + clamp(s.vel * 0.28, -4, 4);
    const target = Math.round(projected);
    s.tween?.kill();
    s.tween = gsap.to(s, {
      pos: target,
      duration: Math.min(1.5, 0.55 + Math.abs(target - s.pos) * 0.28),
      ease: "power3.out",
      onComplete: () => {
        s.tween = null;
        s.idleSince = performance.now();
      },
    });
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const s = state.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let inView = true;

      const measure = () => {
        // The probe is exactly 100 design px wide, so this yields the current px-per-design-px.
        const u = (probe.current?.offsetWidth ?? 100) / 100;
        s.pitch = PITCH * (u || 1);
      };
      const render = () => {
        for (let i = 0; i < slots; i++) {
          const card = cards.current[i];
          if (!card) continue;
          const p = place(wrap(i, s.pos, slots));
          card.style.transform = p.transform;
          card.style.zIndex = p.zIndex;
          card.style.opacity = p.opacity;
          card.style.borderRadius = p.radius;
          (card.firstElementChild as HTMLElement | null)?.style.setProperty("transform", p.inner);
        }
      };

      measure();
      render();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), { rootMargin: "120px" });
      io.observe(el);

      const tick = (_time: number, deltaMs: number) => {
        const busy = s.dragging || s.tween;
        if (!inView && !busy) return;
        if (!reduce && autoplay && !busy && performance.now() - s.idleSince > IDLE_MS) {
          s.pos += (AUTOPLAY_SLOTS_PER_SEC * Math.min(deltaMs, 50)) / 1000;
        }
        render();
      };
      gsap.ticker.add(tick);

      // Intro: cards glide in from the side to the composition (skipped if the load failsafe already ran).
      if (!reduce && claimMotion()) {
        s.tween = gsap.fromTo(
          s,
          { pos: -2.4 },
          {
            pos: 0,
            duration: 1.9,
            delay: 0.85,
            ease: "expo.out",
            onComplete: () => {
              s.tween = null;
              s.idleSince = performance.now();
            },
          },
        );
      } else {
        s.idleSince = performance.now();
      }

      return () => {
        gsap.ticker.remove(tick);
        ro.disconnect();
        io.disconnect();
        s.tween?.kill();
        s.tween = null;
        s.dragging = false;
        s.pos = 0;
      };
    },
    { scope: root, dependencies: [slots, autoplay] },
  );

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const s = state.current;
    s.tween?.kill();
    s.tween = null;
    s.dragging = true;
    s.vel = 0;
    s.lastX = e.clientX;
    s.lastT = e.timeStamp;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging) return;
    const d = -(e.clientX - s.lastX) / s.pitch; // dragging right brings earlier cards to the centre
    const dt = Math.max(1, e.timeStamp - s.lastT) / 1000;
    s.pos += d;
    s.vel = s.vel * 0.7 + (d / dt) * 0.3;
    s.lastX = e.clientX;
    s.lastT = e.timeStamp;
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (e.timeStamp - s.lastT > 100) s.vel = 0; // held still before letting go → no fling
    settle(s);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const s = state.current;
    s.tween?.kill();
    s.tween = gsap.to(s, {
      pos: Math.round(s.pos) + (e.key === "ArrowRight" ? 1 : -1),
      duration: 0.8,
      ease: "power3.out",
      onComplete: () => {
        s.tween = null;
        s.idleSince = performance.now();
      },
    });
  };

  return (
    <div
      ref={root}
      role="group"
      aria-roledescription="carousel"
      aria-label="Showcase videos — drag or use the arrow keys"
      tabIndex={0}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      onDragStart={(e) => e.preventDefault()}
      // `--u` = one design pixel. Phone 0.62px; tablet scales with the viewport; desktop caps at 1px (1440 design).
      className="relative h-[300px] cursor-grab touch-pan-y select-none rounded-2xl outline-none focus-visible:outline-2 focus-visible:outline-white/40 active:cursor-grabbing md:h-[400px] min-[1440px]:h-[500px] [--u:0.62px] md:[--u:0.0694vw] min-[1440px]:[--u:1px]"
      style={{ perspective: "1400px" }}
    >
      <span ref={probe} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 h-0" style={{ width: "calc(var(--u) * 100)" }} />
      {Array.from({ length: slots }, (_, i) => {
        const item = items[i % items.length];
        const p = place(wrap(i, 0, slots));
        const duplicate = i >= items.length;
        return (
          <div
            key={i}
            ref={(node) => {
              cards.current[i] = node;
            }}
            aria-hidden={duplicate || undefined}
            className="absolute left-1/2 top-1/2 overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] will-change-transform"
            style={{
              width: `calc(var(--u) * ${BASE_W})`,
              height: `calc(var(--u) * ${BASE_H})`,
              marginLeft: `calc(var(--u) * ${-BASE_W / 2})`,
              marginTop: `calc(var(--u) * ${-BASE_H / 2})`,
              transform: p.transform,
              zIndex: p.zIndex,
              opacity: p.opacity,
              borderRadius: p.radius,
            }}
          >
            <div className="absolute inset-0 will-change-transform" style={{ transform: p.inner }}>
              <Media kind="portrait" hue={item.hue} src={item.src} alt={item.alt ?? `Showcase video ${(i % items.length) + 1}`} className="size-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
