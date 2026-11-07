import { gsap, ScrollTrigger, mix, range, smooth } from "./gsap";
import type { Env } from "./env";
import type { Stage } from "@/lib/gl/stage";
import type { SoundControl } from "./sound";

export type Readouts = {
  setGen: (g: number) => void;
};

/**
 * The cell stage is a pure function of scroll position, with pointer input layered on top. Nothing
 * here is a scrubbed tween, so jumping to any point on the page, in either direction, always lands
 * on the right frame.
 */
export function createChoreography(opts: {
  stage: Stage;
  env: Env;
  readouts: Readouts;
  sound: SoundControl;
}) {
  const { stage, env, readouts, sound } = opts;
  const s = stage.state;

  const trHero = ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom top" });
  const trPremise = ScrollTrigger.create({ trigger: ".premise", start: "top 80%", end: "bottom 78%" });
  const trIntoDbl = ScrollTrigger.create({ trigger: ".dbl", start: "top bottom", end: "top top" });
  const trDbl = ScrollTrigger.create({ trigger: ".dbl", start: "top top", end: "bottom bottom" });
  const trOut = ScrollTrigger.create({ trigger: ".work__intro", start: "top bottom", end: "top top" });
  const trFoot = ScrollTrigger.create({ trigger: ".footer", start: "top bottom", end: "bottom bottom" });
  // The readout keeps doubling for the rest of the page.
  const trRest = ScrollTrigger.create({
    trigger: ".work",
    start: "top top",
    endTrigger: ".footer",
    end: "bottom bottom",
  });

  const pointer = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.45, seen: false, active: false };
  const eased = { x: pointer.x, y: pointer.y };
  const user = { gen: 0, target: 0 };
  const intro = { active: false, r: 0, gen: 0, toHome: 0, plate: 0 };
  let touchReturn = 0;
  let lastX = 0;
  let lastY = 0;
  let visible = true;
  let lastGenShown = -1;
  let lastPinAlpha = -1;
  let lastTopAlpha = -1;
  let lastBead = false;
  let lastCue = true;
  const pinTop = document.querySelector<HTMLElement>(".dbl__top");
  const pinBottom = document.querySelector<HTMLElement>(".dbl__bottom");
  const scrollCue = document.querySelector<HTMLElement>("[data-scroll-cue]");
  const footerMark = document.querySelector<HTMLElement>("[data-plate='footer']");
  const readoutEl = document.querySelector<HTMLElement>("[data-readout]");
  let lastReadout = true;

  const dblNum = document.querySelector<HTMLElement>("[data-dbl-num]");
  const dblGen = document.querySelector<HTMLElement>("[data-dbl-gen]");
  const beats = gsap.utils.toArray<HTMLElement>("[data-beat]");
  let beatOn = -2;
  const fmt = new Intl.NumberFormat("en-US");

  function heroHome() {
    const { W, H, portrait } = stage;
    return portrait
      ? { x: W * 0.62, y: H * 0.26, r: W * 0.36 }
      : { x: W * 0.745, y: H * 0.37, r: Math.min(W, H) * 0.27 };
  }

  function premiseHome() {
    const { W, H, portrait } = stage;
    return portrait
      ? { x: W * 0.86, y: H * 0.2, r: W * 0.27 }
      : { x: W * 0.82, y: H * 0.54, r: Math.min(W, H) * 0.235 };
  }

  /** Sits on the wordmark itself, wherever the footer's layout has put it. */
  function footHome() {
    const { W, H, portrait } = stage;
    const rect = footerMark?.getBoundingClientRect();
    const y = rect ? rect.top + rect.height * 0.42 : H * 0.8;
    return portrait
      ? { x: W * 0.68, y, r: W * 0.135 }
      : { x: W * 0.68, y, r: Math.min(W, H) * 0.17 };
  }

  function setBeat(generation: number) {
    let index = -1;
    beats.forEach((el, i) => {
      if (generation >= Number(el.dataset.beat)) index = i;
    });
    if (index === beatOn) return;
    beatOn = index;
    beats.forEach((el, i) => el.classList.toggle("is-on", i === index));
  }

  function tick(time: number, dtMs: number) {
    const a = trHero.progress;
    const b = trPremise.progress;
    const d = trIntoDbl.progress;
    const c = trDbl.progress;
    const out = trOut.progress;
    const foot = trFoot.progress;
    const rest = trRest.progress;

    const inTop = out < 1;
    const inFoot = foot > 0.001;

    // Readout: 2^generation, all the way down the page.
    let G = 0;
    if (c > 0) {
      G = 3 + 17 * range(c, 0.02, 0.8);
      if (rest > 0) G = 20 + 10 * rest;
    } else {
      G = Math.max(user.gen * (1 - smooth(range(a, 0, 0.9))), 3 * smooth(b));
    }
    const shown = Math.floor(G + 1e-4);
    if (shown !== lastGenShown) {
      if (lastGenShown >= 0 && shown > lastGenShown && c > 0 && c < 1) sound.tick(shown);
      lastGenShown = shown;
      readouts.setGen(shown);
    }

    // The scene's type clears out of the way before the fly-through. On phones, where the word runs
    // the full height of the screen, the headline makes room as soon as the letters start forming.
    const pinAlpha = 1 - range(c, 0.86, 0.9);
    const crowded = stage.portrait || window.innerHeight < 520;
    const topAlpha = crowded ? pinAlpha * (1 - range(c, 0.2, 0.3)) : pinAlpha;
    if (pinAlpha !== lastPinAlpha || topAlpha !== lastTopAlpha) {
      lastPinAlpha = pinAlpha;
      lastTopAlpha = topAlpha;
      if (pinTop) pinTop.style.opacity = String(topAlpha);
      if (pinBottom) pinBottom.style.opacity = String(pinAlpha);
    }

    // The readout bows out once the wordmark is on screen.
    const readoutOn = foot < 0.5;
    if (readoutOn !== lastReadout) {
      lastReadout = readoutOn;
      readoutEl?.classList.toggle("is-gone", !readoutOn);
    }

    // The scroll cue goes as soon as it has done its job.
    const cueOn = a < 0.04;
    if (cueOn !== lastCue) {
      lastCue = cueOn;
      scrollCue?.classList.toggle("is-gone", !cueOn);
    }

    // The big number and beats in the pinned scene.
    if (env.calm) {
      // Nothing is pinned: the finished figure in the page's own HTML stands, and all the beats show.
    } else if (dblNum && c > 0 && c <= 1) {
      const gDisplay = Math.min(20, 3 + 17 * range(c, 0.02, 0.8));
      dblNum.textContent = fmt.format(Math.round(2 ** gDisplay));
      if (dblGen) dblGen.textContent = String(Math.floor(gDisplay + 1e-4));
      setBeat(gDisplay);
    } else if (c <= 0) {
      if (dblNum) dblNum.textContent = "8";
      if (dblGen) dblGen.textContent = "3";
      setBeat(3);
    }

    if (!inTop && !inFoot) {
      if (visible) {
        visible = false;
        stage.canvas.style.visibility = "hidden";
        document.documentElement.classList.remove("bead-on");
        lastBead = false;
      }
      return;
    }
    if (!visible) {
      visible = true;
      stage.canvas.style.visibility = "visible";
    }

    const { W, H } = stage;

    // Pointer, smoothed. A touch only holds the cell briefly, then it drifts home.
    if (touchReturn > 0) {
      touchReturn -= dtMs;
      if (touchReturn <= 0) pointer.active = false;
    }
    const kp = 1 - Math.pow(0.0015, dtMs / 1000);
    eased.x += (pointer.x - eased.x) * kp;
    eased.y += (pointer.y - eased.y) * kp;

    let x: number;
    let y: number;
    let r: number;
    const m = Math.min(W, H);

    if (inFoot && !inTop) {
      // ---- Footer: a single cell, used as a lens over the wordmark ---------------------------
      const home = footHome();
      const follow = pointer.active ? 0.72 : 0;
      x = home.x + (eased.x - home.x) * follow + Math.sin(time * 0.33) * W * 0.03;
      y = home.y + (eased.y - home.y) * follow * 0.6 + Math.cos(time * 0.29) * H * 0.012;
      r = home.r * smooth(range(foot, 0.25, 0.85));
      s.gen = 0;
      s.wordMix = 0;
      s.zoom = 1;
      s.flat = 0;
      s.warp = 6;
      s.pointerR = 0;
      s.push = 0;
      s.plateOn = 1;
      s.beadR = pointer.seen && env.fine ? 11 : 0;
      stage.usePlate("footer");
    } else {
      // ---- Hero → premise → doubling ---------------------------------------------------------
      const hero = heroHome();
      const prem = premiseHome();
      const ea = smooth(range(a, 0, 0.9));
      const ed = smooth(d);

      const follow = pointer.active && env.fine ? 0.5 : pointer.active ? 0.35 : 0;
      const hx = hero.x + (eased.x - hero.x) * follow + Math.sin(time * 0.31) * W * 0.012;
      const hy = hero.y + (eased.y - hero.y) * follow + Math.cos(time * 0.27) * H * 0.012;

      x = mix(hx, prem.x + Math.sin(time * 0.23) * m * 0.015, ea);
      y = mix(hy, prem.y + Math.cos(time * 0.2) * m * 0.015, ea);
      r = mix(hero.r, prem.r, ea);

      const colonyCx = stage.portrait ? W * 0.56 : W * 0.5;
      const colonyCy = stage.portrait ? window.innerHeight * 0.46 : H * 0.46;
      x = mix(x, colonyCx, ed);
      y = mix(y, colonyCy, ed);
      // Slightly over-full at the end so the letters fuse into solid shapes.
      r = mix(r, stage.colony.r0, ed);

      let g = Math.max(user.gen * (1 - ea), 3 * smooth(b));
      if (c > 0) g = 3 + (env.gens - 3) * range(c, 0.02, 0.8);

      if (intro.active) {
        const t = intro.toHome;
        x = mix(W / 2, hx, t);
        y = mix(H / 2, hy, t);
        r = mix(intro.r, hero.r, t);
        g = intro.gen;
      }

      r *= 1 + 0.012 * Math.sin(time * 1.1);

      // Only the pinned scene spells the word. Clicking the hero up to 64 cells keeps them a loose cluster.
      const wordMix = c > 0 ? smooth(range(g, 3.2, 6.6)) : 0;
      const zt = range(c, 0.875, 1);
      r *= mix(1, 1.2, wordMix);
      s.gen = g;
      s.wordMix = wordMix;
      s.zoom = Math.exp(Math.log(stage.colony.focus.zoom) * zt * zt * zt);
      s.fx = stage.colony.focus.x;
      s.fy = stage.colony.focus.y;
      s.flat = smooth(range(c, 0.95, 0.992));
      s.warp = mix(7, 1, smooth(range(g, 1.5, 7))) * (1 - zt);
      s.pointerR = pointer.seen && wordMix > 0 && zt === 0 ? m * 0.2 * wordMix : 0;
      s.push = 30;
      s.pointerX = eased.x;
      s.pointerY = eased.y;
      s.plateOn = intro.active ? intro.plate : a < 1 ? 1 : 0;
      s.beadR = pointer.seen && env.fine && zt === 0 ? mix(12, 7, range(g, 0, 8)) : 0;
      stage.usePlate("hero");
    }

    const beadOn = s.beadR > 0;
    if (beadOn !== lastBead) {
      lastBead = beadOn;
      document.documentElement.classList.toggle("bead-on", beadOn);
    }

    s.cx = x;
    s.cy = y;
    s.r0 = r;
    s.beadX = eased.x;
    s.beadY = eased.y;

    // Jelly: velocity comes from however the cell actually moved, scroll included.
    const scale = dtMs > 0 ? 16.67 / dtMs : 1;
    const vx = (x - lastX) * scale;
    const vy = (y - lastY) * scale;
    lastX = x;
    lastY = y;
    s.velX += (vx - s.velX) * 0.18;
    s.velY += (vy - s.velY) * 0.18;

    stage.frame(time, dtMs);
  }

  // --- Input --------------------------------------------------------------------------------
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (e.pointerType === "mouse" || e.pointerType === "pen") {
      pointer.active = true;
      if (!pointer.seen) {
        pointer.seen = true;
        eased.x = e.clientX;
        eased.y = e.clientY;
      }
    }
  };

  const hintEl = document.querySelector<HTMLElement>("[data-hint]");
  const hintSteps: string[] = hintEl ? JSON.parse(hintEl.dataset.hintSteps ?? "[]") : [];
  let hintIndex = 0;

  /** Every click or tap on the hero doubles the cells. At 64 they fuse back into one. */
  function divide() {
    user.target = user.target >= 6 ? 0 : user.target + 1;
    gsap.to(user, { gen: user.target, duration: 0.95, ease: "power2.inOut", overwrite: true });
    sound.pop(user.target);
    if (hintEl && hintIndex < hintSteps.length) hintEl.textContent = hintSteps[hintIndex++];
  }

  const onDown = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (e.pointerType === "touch") {
      pointer.active = true;
      touchReturn = 1400;
    }
    const target = e.target as HTMLElement;
    if (target.closest("a,button,input,label")) return;
    if (env.calm || intro.active || trHero.progress > 0.5) return;
    if (!target.closest("[data-hero]")) return;
    divide();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });

  return {
    tick,
    intro,
    refresh: () => ScrollTrigger.refresh(),
    dispose() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      gsap.killTweensOf(user);
    },
  };
}

export type Choreography = ReturnType<typeof createChoreography>;

