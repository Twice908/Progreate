import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { readEnv } from "./env";
import { bindMedium, createMedium } from "./medium";
import { createChoreography, type Choreography } from "./choreography";
import { createSound } from "./sound";
import { applyInputCopy, initCurve, initMagnetic, initMedia, initNotes, initPremise, initReveals, initWork } from "./sections";
import { createReadouts, initAnchors, initBar, initCursor, initMenu } from "./chrome";
import { doubling } from "@/content/site";
import { mediums, nutrientBehindText } from "@/lib/mediums";
import type { Stage } from "@/lib/gl/stage";

declare global {
  interface Window {
    __pgFailsafe?: ReturnType<typeof setTimeout>;
  }
}

const SEEN_KEY = "pg-seen";

/** Wakes the page up. Returns a function that tears all of it down again. */
export function boot() {
  const html = document.documentElement;
  const env = readEnv();
  const cleanups: (() => void)[] = [];
  let dead = false;
  let stage: Stage | null = null;
  let choreo: Choreography | null = null;

  clearTimeout(window.__pgFailsafe);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const hashTarget = location.hash.length > 1 ? document.querySelector<HTMLElement>(location.hash) : null;
  if (!hashTarget) window.scrollTo(0, 0);

  const heroTitle = document.querySelector<HTMLElement>("[data-plate='hero']");
  const footerMark = document.querySelector<HTMLElement>("[data-plate='footer']");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-stage]");
  const veil = document.querySelector<HTMLElement>("[data-veil]");
  const introEl = document.querySelector<HTMLElement>("[data-intro]");
  const introCount = document.querySelector<HTMLElement>("[data-intro-count]");
  const introDot = document.querySelector<HTMLElement>("[data-intro-dot]");
  const rises = gsap.utils.toArray<HTMLElement>("[data-rise]");
  const heroIn = gsap.utils.toArray<HTMLElement>("[data-hero-in]");
  const barEl = document.querySelector<HTMLElement>("[data-bar]");
  const readoutEl = document.querySelector<HTMLElement>("[data-readout]");
  const hintEl = document.querySelector<HTMLElement>("[data-hint]");

  const lenis = env.calm ? null : new Lenis({ lerp: 0.105, smoothWheel: true });
  const readouts = createReadouts();
  cleanups.push(() => readouts.dispose());
  const sound = createSound(document.querySelector<HTMLButtonElement>("[data-sound]"));
  cleanups.push(() => sound.dispose());
  const medium = createMedium("tcbs");

  applyInputCopy(env);

  let onVelocity: (v: number) => void = () => {};
  let work: { tick: (seconds: number, dtMs: number) => void; dispose: () => void } = { tick() {}, dispose() {} };
  const cursor = initCursor(env);
  cleanups.push(() => cursor.dispose());

  // Everything added to this context is reverted together on teardown.
  const ctx = gsap.context(() => {});

  cleanups.push(initAnchors(lenis));
  cleanups.push(initMenu(lenis));

  // Smooth scroll drives ScrollTrigger; the GSAP ticker drives everything.
  if (lenis) {
    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      onVelocity(e.velocity);
    });
  }
  const onTick = (seconds: number, deltaMs: number) => {
    lenis?.raf(seconds * 1000);
    if (dead) return;
    const dt = Math.min(deltaMs, 100);
    // With reduced motion the cell is one still frame, drawn once in prepareStage.
    if (!env.calm) choreo?.tick(seconds, dt);
    work.tick(seconds, dt);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  // A resize that changes the shape of the viewport rebuilds the colony for the new shape.
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // A phone's URL bar sliding away changes only the height, and only slightly. Ignore it.
      const significant = w !== lastW || Math.abs(h - lastH) > 140;
      if (!significant) return;
      lastW = w;
      lastH = h;
      stage?.resize();
      ScrollTrigger.refresh();
    }, 180);
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => {
    clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
  });

  const finish = () => {
    html.classList.remove("booting");
    html.classList.add("booted");
    gsap.set([veil, introEl], { autoAlpha: 0 });
    if (choreo) choreo.intro.active = false;
    lenis?.start();
    ScrollTrigger.refresh();
    if (hashTarget) {
      if (lenis) lenis.scrollTo(hashTarget, { immediate: true });
      else hashTarget.scrollIntoView();
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: replays the long intro next time, which is fine */
    }
  };

  /**
   * Hero type and furniture coming in. These slide and unmask rather than fade, so at no point is any
   * text on screen in a half-transparent, hard-to-read state.
   */
  const heroEntrance = () => {
    const tl = gsap.timeline();
    tl.to(rises, { yPercent: 0, duration: 1.35, stagger: 0.09, ease: "expo.out" }, 0);
    tl.fromTo(
      heroIn,
      { clipPath: "inset(0% 0% 100% 0%)", y: 22, visibility: "inherit" },
      { clipPath: "inset(-8% -8% -8% -8%)", y: 0, duration: 1.15, stagger: 0.08, ease: "expo.out", clearProps: "clipPath" },
      0.35,
    );
    tl.fromTo(barEl, { yPercent: -100, visibility: "inherit" }, { yPercent: 0, duration: 1.1, ease: "expo.out", clearProps: "transform" }, 0.4);
    tl.fromTo(readoutEl, { yPercent: 160, visibility: "inherit" }, { yPercent: 0, duration: 1.1, ease: "expo.out", clearProps: "transform" }, 0.5);
    tl.fromTo(hintEl, { y: 14, visibility: "inherit" }, { y: 0, duration: 1, ease: "expo.out", clearProps: "transform" }, 0.55);
    return tl;
  };

  const playIntro = () => {
    if (dead) return;
    if (env.calm || html.classList.contains("booted")) {
      finish();
      return;
    }

    lenis?.stop();
    let quick = Boolean(hashTarget);
    try {
      quick = quick || sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* ignore */
    }

    // The h1 has already painted under the veil, so it counts for LCP. Only now is it tucked away.
    gsap.set(rises, { yPercent: 112 });

    const intro = choreo?.intro;
    const skipOnClick = () => tl.progress(1);
    window.addEventListener("pointerdown", skipOnClick, { once: true });
    cleanups.push(() => window.removeEventListener("pointerdown", skipOnClick));

    const tl = gsap.timeline({
      onComplete: () => {
        window.removeEventListener("pointerdown", skipOnClick);
        finish();
      },
    });

    if (intro && stage) {
      const m = Math.min(stage.W, stage.H);
      intro.active = true;
      intro.r = 6;
      intro.gen = 0;
      intro.toHome = 0;
      intro.plate = 0;
      gsap.set(introDot, { autoAlpha: 0 });

      if (!quick) {
        const count = { g: 0 };
        tl.to(intro, { r: m * 0.085, duration: 1.2, ease: "power2.out" }, 0);
        tl.to(intro, { gen: 4, duration: 1.2, ease: "power1.inOut" }, 0);
        tl.to(
          count,
          {
            g: 10,
            duration: 1.2,
            ease: "power1.in",
            onUpdate: () => {
              if (introCount) introCount.textContent = Math.round(2 ** count.g).toLocaleString("en-US");
            },
          },
          0,
        );
        tl.to(introEl, { autoAlpha: 0, duration: 0.35 }, 1.3);
        tl.to(intro, { gen: 0, duration: 0.5, ease: "power3.inOut" }, 1.25);
      } else {
        tl.to(introEl, { autoAlpha: 0, duration: 0.2 }, 0);
      }

      const go = quick ? 0.05 : 1.45;
      tl.to(intro, { toHome: 1, duration: 1.25, ease: "expo.inOut" }, go);
      tl.to(veil, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, go + 0.25);
      tl.add(heroEntrance(), go + 0.45);
      tl.to(intro, { plate: 1, duration: 0.7, ease: "power2.out" }, go + 1.1);
    } else {
      // No WebGL: the same entrance, minus the cell.
      html.classList.add("no-gl");
      tl.to(introEl, { autoAlpha: 0, duration: 0.3 }, 0);
      tl.to(veil, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, 0.1);
      tl.add(heroEntrance(), 0.2);
    }
  };

  /**
   * Setup is split across tasks so that a slow phone can still respond to input and paint while it
   * runs, instead of locking up for one long stretch right after load.
   */
  const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

  const setupSections = async () => {
    const steps: (() => void)[] = [
      () => cleanups.push(bindMedium(medium)),
      () => initBar(),
      () => {
        if (!env.calm) initReveals();
      },
      () => {
        if (!env.calm) initPremise();
      },
      () => {
        work = initWork(env, (over) => cursor.setForced(over ? "Feed" : null));
        cleanups.push(() => work.dispose());
      },
      () => cleanups.push(initCurve(env)),
      () => cleanups.push(initMedia(env)),
      () => {
        if (!env.calm) onVelocity = initNotes();
      },
      () => cleanups.push(initMagnetic(env)),
    ];
    for (const step of steps) {
      if (dead) return;
      ctx.add(step);
      await yieldToMain();
    }
  };

  // Fonts first (the cells need the real letterforms), then WebGL, then the show.
  const prepareStage = async () => {
    if (!env.webgl) {
      html.classList.add("no-gl");
      return;
    }
    if (!canvas || !heroTitle) return;
    const family = getComputedStyle(heroTitle).fontFamily;
    const fontLoad = document.fonts
      ? Promise.race([
          document.fonts.load(`400 100px ${family}`, doubling.word),
          new Promise((resolve) => setTimeout(resolve, 2200)),
        ])
      : Promise.resolve();
    const [{ Stage: StageClass }] = await Promise.all([import("@/lib/gl/stage"), fontLoad]);
    if (dead) return;

    stage = new StageClass({
      canvas,
      gens: env.gens,
      dprCap: env.dprCap,
      word: doubling.word,
      family,
      initial: mediums.tcbs,
    });
    await yieldToMain();
    if (dead) return;
    stage.addPlate("hero", heroTitle);
    if (footerMark) stage.addPlate("footer", footerMark);
    medium.onChange((m) => stage?.setPalette(m === mediums.nutrient && stage.portrait ? nutrientBehindText : m));

    ctx.add(() => {
      choreo = createChoreography({ stage: stage!, env, readouts, sound });
    });
    cleanups.push(() => choreo?.dispose());

    // Reduced motion: one still frame of the hero cell, and no loop.
    if (env.calm) choreo?.tick(0, 16);

    // If a font arrives late, the letterforms inside the cells must catch up.
    void document.fonts?.ready.then(() => {
      if (!dead) stage?.refresh();
      if (!dead && env.calm) choreo?.tick(0, 16);
    });
  };

  void setupSections()
    .then(prepareStage)
    .catch(() => {
      html.classList.add("no-gl");
    })
    .finally(playIntro);

  // Tab title easter egg: the culture keeps going while you're away.
  const title = document.title;
  const onVisibility = () => {
    document.title = document.hidden ? "Still growing…" : title;
  };
  document.addEventListener("visibilitychange", onVisibility);
  cleanups.push(() => {
    document.removeEventListener("visibilitychange", onVisibility);
    document.title = title;
  });

  return () => {
    dead = true;
    gsap.ticker.remove(onTick);
    cleanups.forEach((fn) => fn());
    ctx.revert();
    lenis?.destroy();
    stage?.dispose();
    stage = null;
  };
}
