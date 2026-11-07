import { gsap, ScrollTrigger } from "./gsap";
import { mediums, type Medium, type MediumKey } from "@/lib/mediums";

export type MediumControl = {
  set: (key: MediumKey) => void;
  current: () => MediumKey;
  onChange: (fn: (m: Medium) => void) => void;
};

/** Washes the whole page from one growth medium to the next. */
export function createMedium(initial: MediumKey): MediumControl {
  const root = document.documentElement;
  const nameEl = document.querySelector<HTMLElement>("[data-medium-name]");
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const listeners = new Set<(m: Medium) => void>();
  let current = initial;

  return {
    current: () => current,
    onChange: (fn) => void listeners.add(fn),
    set(key) {
      if (key === current) return;
      current = key;
      const m = mediums[key];
      gsap.to(root, {
        "--bg": m.bg,
        "--ink": m.ink,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      });
      if (nameEl) nameEl.textContent = m.name;
      // Tints the phone browser's own UI, so the colour change reaches past the page.
      meta?.setAttribute("content", m.bg);
      listeners.forEach((fn) => fn(m));
    },
  };
}

/**
 * The medium is whichever [data-medium] element most recently crossed the line just past mid-screen.
 * It is looked up from scroll position rather than fired by enter/leave events, so a jump of any
 * size, from a link or a reload, always lands on the right colour.
 */
export function bindMedium(medium: MediumControl) {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-medium]"));
  let starts: { y: number; key: MediumKey }[] = [];

  const update = () => {
    const y = window.scrollY;
    let key = starts[0]?.key;
    for (const s of starts) {
      if (s.y > y) break;
      key = s.key;
    }
    if (key) medium.set(key);
  };

  const measure = () => {
    const H = window.innerHeight;
    // The doubling hands over the instant it unpins, while the screen is one flat colour. With reduced
    // motion nothing is pinned, so there it is treated like any other section.
    const pinned = !document.documentElement.classList.contains("calm");
    starts = els
      .map((el) => ({
        y: el.getBoundingClientRect().top + window.scrollY - (pinned && el.hasAttribute("data-work-intro") ? H : H * 0.55),
        key: el.dataset.medium as MediumKey,
      }))
      .sort((a, b) => a.y - b.y);
    update();
  };

  measure();
  ScrollTrigger.addEventListener("refresh", measure);
  window.addEventListener("scroll", update, { passive: true });
  return () => {
    ScrollTrigger.removeEventListener("refresh", measure);
    window.removeEventListener("scroll", update);
  };
}
