import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import type { Env } from "./env";

/* -------------------------------------------------------------------------- */
/* Cursor                                                                      */
/* -------------------------------------------------------------------------- */

export function initCursor(env: Env) {
  const el = document.querySelector<HTMLElement>("[data-cursor]");
  const label = document.querySelector<HTMLElement>("[data-cursor-label]");
  if (!env.fine || !el || !label) return { dispose() {}, setForced() {} };

  const html = document.documentElement;
  const toX = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3.out" });
  const toY = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3.out" });
  let forced: string | null = null;
  let contextual = "";
  let started = false;

  const paint = () => {
    const text = forced ?? contextual;
    if (text) label.textContent = text;
    el.classList.toggle("has-label", Boolean(text));
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!started) {
      started = true;
      html.classList.add("has-cursor");
      gsap.set(el, { x: e.clientX, y: e.clientY });
    }
    toX(e.clientX);
    toY(e.clientY);
  };

  const onOver = (e: PointerEvent) => {
    const target = e.target as Element;
    const link = target.closest("a,button,[data-media-row]");
    el.classList.toggle("is-link", Boolean(link));
    el.classList.toggle("is-field", Boolean(target.closest("input")));
    contextual = link ? "" : (target.closest<HTMLElement>("[data-cursor-text]")?.dataset.cursorText ?? "");
    paint();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerover", onOver, { passive: true });

  return {
    setForced(text: string | null) {
      forced = text;
      paint();
    },
    dispose() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      html.classList.remove("has-cursor");
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Top bar: hides while reading down, returns on scroll up                      */
/* -------------------------------------------------------------------------- */

export function initBar() {
  const bar = document.querySelector<HTMLElement>("[data-bar]");
  if (!bar) return;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const past = self.scroll() > window.innerHeight * 0.6;
      bar.classList.toggle("is-hidden", past && self.direction === 1);
      bar.classList.toggle("is-solid", past && self.direction === -1);
    },
  });
}

/* -------------------------------------------------------------------------- */
/* In-page links, through the smooth scroller                                   */
/* -------------------------------------------------------------------------- */

export function initAnchors(lenis: Lenis | null) {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!;
    const target = id === "#top" ? document.body : document.querySelector<HTMLElement>(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      target.scrollIntoView();
    }
    history.replaceState(null, "", id === "#top" ? " " : id);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

/* -------------------------------------------------------------------------- */
/* Full-screen menu (small screens)                                             */
/* -------------------------------------------------------------------------- */

export function initMenu(lenis: Lenis | null) {
  const button = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const label = document.querySelector<HTMLElement>("[data-menu-label]");
  const menu = document.querySelector<HTMLElement>("[data-menu]");
  const main = document.getElementById("main");
  if (!button || !menu) return () => {};
  const html = document.documentElement;
  let open = false;

  const set = (next: boolean) => {
    if (next === open) return;
    open = next;
    button.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
    html.classList.toggle("menu-open", open);
    gsap.killTweensOf(menu);
    const links = menu.querySelectorAll("[data-menu-link]");
    if (open) {
      menu.hidden = false;
      main?.setAttribute("inert", "");
      lenis?.stop();
      const r = button.getBoundingClientRect();
      const origin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      gsap.fromTo(
        menu,
        { clipPath: `circle(0px at ${origin})` },
        { clipPath: `circle(150vmax at ${origin})`, duration: 0.9, ease: "power3.inOut" },
      );
      gsap.fromTo(links, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06, delay: 0.22, ease: "expo.out" });
    } else {
      main?.removeAttribute("inert");
      lenis?.start();
      const r = button.getBoundingClientRect();
      const origin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      gsap.to(menu, {
        clipPath: `circle(0px at ${origin})`,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          menu.hidden = true;
        },
      });
      button.focus({ preventScroll: true });
    }
  };

  const onToggle = () => set(!open);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") set(false);
    if (e.key === "Tab" && open) {
      const focusable = [button, ...menu.querySelectorAll<HTMLElement>("a")];
      const i = focusable.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? focusable.length - 1 : i - 1) : (i + 1) % focusable.length;
      e.preventDefault();
      focusable[next].focus();
    }
  };
  const onMenuClick = (e: Event) => {
    if ((e.target as Element).closest("a")) set(false);
  };

  button.addEventListener("click", onToggle);
  menu.addEventListener("click", onMenuClick);
  document.addEventListener("keydown", onKey);

  return () => {
    button.removeEventListener("click", onToggle);
    menu.removeEventListener("click", onMenuClick);
    document.removeEventListener("keydown", onKey);
    set(false);
  };
}

/* -------------------------------------------------------------------------- */
/* Readouts                                                                     */
/* -------------------------------------------------------------------------- */

export function createReadouts() {
  const genEl = document.querySelector<HTMLElement>("[data-gen]");
  const tempEl = document.querySelector<HTMLElement>("[data-temp]");
  const fmt = new Intl.NumberFormat("en-US");

  // The incubator holds 37 °C, give or take.
  const temp = window.setInterval(() => {
    if (!tempEl || document.hidden) return;
    tempEl.textContent = `${(37 + (Math.random() - 0.5) * 0.2).toFixed(1)} °C`;
  }, 2400);

  return {
    setGen(g: number) {
      if (!genEl) return;
      const n = Math.round(2 ** g);
      genEl.textContent = `Gen ${String(g).padStart(2, "0")} · ${fmt.format(n)} ${n === 1 ? "cell" : "cells"}`;
    },
    dispose() {
      window.clearInterval(temp);
    },
  };
}
