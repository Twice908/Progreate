export type Env = {
  /** The visitor prefers reduced motion. */
  calm: boolean;
  /** WebGL2 exists here. Decided before Three.js is even downloaded. */
  webgl: boolean;
  /** A real mouse or trackpad. */
  fine: boolean;
  /** 0 = low-end phone, 1 = phone or tablet, 2 = desktop. Scales simulation work, not the design. */
  tier: 0 | 1 | 2;
  /** Depth of the colony's family tree. 2^gens cells at the end of the doubling. */
  gens: number;
  dprCap: number;
  dish: { size: number; steps: number };
};

export function readEnv(): Env {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  const tier: Env["tier"] = coarse && (cores <= 4 || memory <= 3) ? 0 : coarse ? 1 : 2;

  let webgl = false;
  try {
    webgl = Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    webgl = false;
  }

  return {
    calm,
    webgl,
    fine,
    tier,
    gens: [10, 11, 12][tier],
    dprCap: [1.25, 1.75, 2][tier],
    dish: [
      { size: 180, steps: 4 },
      { size: 240, steps: 6 },
      { size: 320, steps: 10 },
    ][tier],
  };
}
