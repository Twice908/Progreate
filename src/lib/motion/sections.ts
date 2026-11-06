import { gsap, ScrollTrigger, SplitText, clamp01, mix, range, smooth } from "./gsap";
import type { Env } from "./env";
import { createCurveChart } from "./curveChart";
import { curve as curveCopy } from "@/content/site";
import { mediums, type MediumKey } from "@/lib/mediums";
import type { Dish } from "@/lib/gl/dish";

const all = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** The dish hangs from the top of the screen rather than sitting beside the text. Mirrors the CSS. */
const isStacked = (W: number, H: number) => W <= 760 || H >= W;

/* -------------------------------------------------------------------------- */
/* Shared text reveals                                                         */
/* -------------------------------------------------------------------------- */

export function initReveals() {
  all("[data-lines]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "ln",
      autoSplit: true,
      onSplit: (self: SplitText) =>
        gsap.from(self.lines, {
          yPercent: 112,
          duration: 1.25,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
    });
  });

  all("[data-rise-in]").forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 22,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });
}

/*
 * Words of the premise light up as you read down. They are only dimmed once the paragraph is about to
 * come on screen, so the text is never left faint if anything downstream fails to run. Splitting into
 * words needs no aria handling: the words are still there, in order, for a screen reader.
 */
export function initPremise() {
  const el = document.querySelector<HTMLElement>("[data-scrub-words]");
  if (!el) return;
  ScrollTrigger.create({
    trigger: el,
    start: "top 118%",
    once: true,
    onEnter: () => {
      const split = SplitText.create(el, { type: "words", aria: "none" });
      gsap.fromTo(
        split.words,
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 62%", scrub: 0.4 },
        },
      );
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Work: the living portfolio                                                  */
/* -------------------------------------------------------------------------- */

export function initWork(env: Env, onFeedHover: (over: boolean) => void) {
  const stageEl = document.querySelector<HTMLElement>("[data-dish-stage]");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-dish]");
  const ringEl = document.querySelector<HTMLElement>("[data-dish-ring]");
  const ringText = document.querySelector<SVGTextPathElement>("[data-dish-ring-text]");
  const cards = all("[data-plate-card]");
  if (!stageEl || !canvas || !ringEl || !ringText || !cards.length) {
    return { tick() {}, dispose() {} };
  }

  let dish: Dish | null = null;
  let loading = false;
  let live = false;
  let current = -1;
  let dead = false;
  let W = 1;
  let H = 1;
  let base = { x: 0, y: 0, r: 1 };
  let ringFont = 12;

  const strainOf = (card: HTMLElement) => ({
    feed: Number(card.dataset.feed),
    kill: Number(card.dataset.kill),
    agar: card.dataset.agar!,
    colony: card.dataset.colony!,
    colonyEdge: card.dataset.colonyEdge!,
    shadow: mediums[card.dataset.medium as MediumKey].shadow,
  });

  const measure = () => {
    const rect = stageEl.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    if (isStacked(W, H)) {
      const r = Math.min(W * 0.8, H * 0.46);
      base = { x: W * 0.5, y: Math.max(H * 0.09, r * 0.3), r };
    } else {
      const r = Math.max(H * 0.64, W * 0.335);
      base = { x: W * 0.76, y: H * 0.5, r };
    }
    ringFont = Math.max(11, Math.min(13, W / 110));
    const size = base.r * 2 * 1.12;
    ringEl.style.width = `${size}px`;
    ringEl.style.height = `${size}px`;
    const text = ringEl.querySelector("text");
    if (text) text.style.fontSize = `${(ringFont * 1000) / size}px`;
    dish?.resize();
  };

  const setRing = (card: HTMLElement) => {
    const line = card.dataset.ring ?? "";
    // Enough repeats to wrap the rim, spaced to meet itself exactly.
    const circumference = Math.PI * 2 * 484;
    const approx = line.length * ((ringFont * 1000) / (base.r * 2 * 1.12)) * 0.62;
    const repeats = Math.max(1, Math.floor(circumference / approx));
    ringText.textContent = line.repeat(repeats);
    ringText.setAttribute("textLength", String(Math.round(circumference)));
    ringText.setAttribute("lengthAdjust", "spacing");
  };

  // Reduced motion: each plate is a finished still, grown off-screen and swapped without animation.
  const drawStill = () => {
    if (!dish) return;
    dish.place(base.x, base.y, base.r);
    dish.frame(0, 16);
    const size = base.r * 2 * 1.12;
    gsap.set(ringEl, { x: base.x - size / 2, y: base.y - size / 2, opacity: 1 });
  };

  const activate = (index: number) => {
    if (index === current) return;
    current = index;
    const card = cards[index];
    setRing(card);
    if (!dish) return;
    if (env.calm) {
      dish.setStrain(strainOf(card), true);
      dish.warm(1600);
      drawStill();
    } else {
      dish.setStrain(strainOf(card));
    }
  };

  const load = async () => {
    if (loading || dish || !env.webgl) return;
    loading = true;
    try {
      const { Dish: DishClass } = await import("@/lib/gl/dish");
      if (dead) return;
      dish = new DishClass({
        canvas,
        simSize: env.dish.size,
        stepsPerFrame: env.dish.steps,
        // The pattern is a threshold of a smooth field, so it stays crisp without full retina resolution.
        dprCap: Math.min(env.dprCap, 1.5),
      });
      measure();
      const first = strainOf(cards[Math.max(current, 0)]);
      dish.setStrain(first, true);
      // Already growing by the time you scroll to it, and swept once so the whole dish is colonised.
      dish.warm(env.calm ? 1600 : env.tier === 2 ? 500 : 240);
      if (!env.calm) dish.sweep();
      else if (current >= 0) drawStill();
    } catch {
      document.documentElement.classList.add("no-dish");
    }
  };

  ScrollTrigger.create({
    trigger: "[data-work]",
    start: "top 160%",
    end: "bottom -40%",
    onToggle: (self) => {
      live = self.isActive;
      if (live) void load();
    },
  });

  // Which plate is current comes from scroll position, so any jump lands on the right strain.
  let cardTops: number[] = [];
  const measureCards = () => {
    cardTops = cards.map((card) => card.getBoundingClientRect().top + window.scrollY);
  };
  measureCards();
  ScrollTrigger.addEventListener("refresh", measureCards);

  // The dish arrives as the first case study does.
  const trIn = ScrollTrigger.create({ trigger: cards[0], start: "top 98%", end: "top 40%" });
  const trRing = ScrollTrigger.create({ trigger: "[data-work]", start: "top top", end: "bottom bottom" });

  const onResize = () => {
    measure();
    if (current >= 0) setRing(cards[current]);
  };
  measure();
  setRing(cards[0]);
  window.addEventListener("resize", onResize);

  // Feeding.
  let overDish = false;
  const onPointer = (e: PointerEvent) => {
    if (!dish || !live || env.calm || trIn.progress < 0.5) return;
    const inside = dish.feedAt(e.clientX, e.clientY);
    if (inside !== overDish) {
      overDish = inside;
      onFeedHover(inside && !(e.target as Element)?.closest?.("a,button,input"));
    }
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });

  return {
    tick(time: number, dtMs: number) {
      if (!dish || !live) return;
      const line = window.scrollY + window.innerHeight * 0.55;
      let index = -1;
      for (let i = 0; i < cardTops.length; i++) if (cardTops[i] <= line) index = i;
      if (index >= 0) activate(index);
      if (env.calm) return;

      const e = smooth(trIn.progress);
      const stacked = isStacked(W, H);
      const x = stacked ? base.x : mix(W + base.r * 1.2, base.x, e);
      const y = stacked ? mix(-base.r * 1.2, base.y, e) : base.y;
      dish.place(x, y, base.r);
      canvas.style.visibility = e > 0.001 ? "visible" : "hidden";
      dish.frame(time, dtMs);

      const size = base.r * 2 * 1.12;
      gsap.set(ringEl, {
        x: x - size / 2,
        y: y - size / 2,
        rotation: trRing.progress * 150,
        opacity: range(e, 0.55, 1),
      });
    },
    dispose() {
      dead = true;
      ScrollTrigger.removeEventListener("refresh", measureCards);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      dish?.dispose();
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Curve                                                                       */
/* -------------------------------------------------------------------------- */

export function initCurve(env: Env) {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-curve-canvas]");
  const track = document.querySelector<HTMLElement>("[data-curve-track]");
  const phases = all("[data-phase]");
  if (!canvas || !track) return () => {};

  const chart = createCurveChart(
    canvas,
    curveCopy.phases.map((p) => p.name),
  );

  let phase = -1;
  const setPhase = (i: number) => {
    if (i === phase) return;
    phase = i;
    phases.forEach((el, n) => el.classList.toggle("is-on", n === i));
  };

  const ro = new ResizeObserver(() => chart.resize());
  ro.observe(canvas);

  if (env.calm) {
    chart.resize();
    chart.draw(1);
    return () => ro.disconnect();
  }

  setPhase(0);
  ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      chart.draw(self.progress);
      setPhase(chart.phaseOf(self.progress));
    },
    onRefresh: (self) => chart.draw(self.progress),
  });

  return () => ro.disconnect();
}

/* -------------------------------------------------------------------------- */
/* Growth media accordion                                                      */
/* -------------------------------------------------------------------------- */

export function initMedia(env: Env) {
  const items = all("[data-media-item]");
  const openItem = (item: HTMLElement, open: boolean, instant = false) => {
    const row = item.querySelector<HTMLElement>("[data-media-row]")!;
    const panel = item.querySelector<HTMLElement>("[data-media-panel]")!;
    row.setAttribute("aria-expanded", String(open));
    item.classList.toggle("is-open", open);
    gsap.killTweensOf(panel);
    if (open) gsap.set(panel, { visibility: "visible" });
    const done = () => {
      if (!open) gsap.set(panel, { visibility: "hidden" });
      ScrollTrigger.refresh();
    };
    if (instant || env.calm) {
      gsap.set(panel, { height: open ? "auto" : 0 });
      done();
    } else {
      gsap.to(panel, { height: open ? "auto" : 0, duration: 0.85, ease: "expo.out", onComplete: done });
    }
  };

  const onClick = (e: Event) => {
    const item = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-media-item]")!;
    const wasOpen = item.classList.contains("is-open");
    items.forEach((other) => {
      if (other !== item && other.classList.contains("is-open")) openItem(other, false);
    });
    openItem(item, !wasOpen);
  };

  const rows = items.map((item) => item.querySelector<HTMLElement>("[data-media-row]")!);
  rows.forEach((row) => row.addEventListener("click", onClick));
  if (items[0]) openItem(items[0], true, true);

  return () => rows.forEach((row) => row.removeEventListener("click", onClick));
}

/* -------------------------------------------------------------------------- */
/* Lab notes: lines that run with the scroll, leaning into its speed            */
/* -------------------------------------------------------------------------- */

export function initNotes() {
  const rows = all("[data-note-row]");
  rows.forEach((row, i) => {
    const track = row.querySelector<HTMLElement>(".notes__track");
    if (!track) return;
    const leftward = row.dataset.noteRow === "left";
    const travel = 28 + i * 3;
    gsap.fromTo(
      track,
      { xPercent: leftward ? -2 : -travel },
      {
        xPercent: leftward ? -travel : -2,
        ease: "none",
        scrollTrigger: { trigger: "[data-notes]", start: "top bottom", end: "bottom top", scrub: 0.3 },
      },
    );
  });

  const tracks = all(".notes__track");
  const skewers = tracks.map((t) => gsap.quickTo(t, "skewX", { duration: 0.5, ease: "power3.out" }));
  return (velocity: number) => {
    const skew = Math.max(-9, Math.min(9, velocity * 0.11));
    skewers.forEach((fn) => fn(skew));
  };
}

/* -------------------------------------------------------------------------- */
/* Magnetic buttons                                                            */
/* -------------------------------------------------------------------------- */

export function initMagnetic(env: Env) {
  if (!env.fine) return () => {};
  const offs: (() => void)[] = [];
  all("[data-magnetic]").forEach((el) => {
    const toX = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    const toY = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = clamp01((e.clientX - r.left) / r.width) - 0.5;
      const ny = clamp01((e.clientY - r.top) / r.height) - 0.5;
      toX(nx * r.width * 0.26);
      toY(ny * r.height * 0.42);
    };
    const leave = () => {
      toX(0);
      toY(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
  return () => offs.forEach((off) => off());
}

/** Swap mouse copy for touch copy where the instruction differs. */
export function applyInputCopy(env: Env) {
  all("[data-hint-mouse]").forEach((el) => {
    el.textContent = (env.fine ? el.dataset.hintMouse : el.dataset.hintTouch) ?? el.textContent;
  });
}
