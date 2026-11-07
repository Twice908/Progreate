import { clamp01 } from "./gsap";
import { mediums } from "@/lib/mediums";

const S = (x: number, k: number, x0: number) => 1 / (1 + Math.exp(-k * (x - x0)));

/** A real bacterial growth curve, plotted on a log axis: lag, exponential, stationary, death. */
const mainCurve = (x: number) => 0.05 + 0.8 * S(x, 27, 0.35) - 0.62 * S(x, 24, 0.84);
/** The next strain, climbing out of the old one's decline. */
const nextCurve = (x: number) => 0.035 + 1.05 * S(x, 30, 0.93);

export const PHASE_EDGES = [0, 0.24, 0.5, 0.72, 1];
const NEXT_START = 0.72;

const backOut = (t: number) => {
  const c = 1.9;
  const u = t - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
};

export function createCurveChart(canvas: HTMLCanvasElement, labels: string[]) {
  const ctx = canvas.getContext("2d")!;
  let W = 1;
  let H = 1;
  let dpr = 1;
  const ink = mediums.mannitol.ink;
  const paper = mediums.mannitol.bg;
  const accent = mediums.blood.bg;
  let font = "monospace";
  let progress = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    font = getComputedStyle(document.documentElement).getPropertyValue("--font-mono") || "monospace";
    draw(progress);
  };

  /** Scroll progress, stretched so each of the four phases gets an equal share of the scroll. */
  const headAt = (p: number) => {
    const scaled = clamp01(p) * 4;
    const i = Math.min(3, Math.floor(scaled));
    return PHASE_EDGES[i] + (PHASE_EDGES[i + 1] - PHASE_EDGES[i]) * (scaled - i);
  };

  function draw(p: number) {
    progress = p;
    const head = headAt(p);
    const labelBand = 24;
    const base = H - labelBand;
    const plotH = base - Math.max(8, H * 0.03);
    const phase = Math.min(3, Math.floor(clamp01(p) * 4));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const yAt = (v: number) => base - v * plotH;

    // Halftone colonies under the curve: dots appear as the line passes.
    const step = Math.max(9, Math.min(19, W / 74));
    const maxR = step * 0.44;
    const paintDots = (curve: (x: number) => number, fromX: number, colour: string) => {
      ctx.fillStyle = colour;
      ctx.beginPath();
      for (let cx = step / 2; cx < W; cx += step) {
        const xn = cx / W;
        if (xn < fromX) continue;
        const reveal = (head - xn) / 0.05;
        if (reveal <= 0) continue;
        const pop = backOut(clamp01(reveal));
        const height = curve(xn) * plotH;
        for (let row = 0; row * step + step / 2 < height; row++) {
          const depth = (row * step) / Math.max(height, 1);
          const r = maxR * (0.14 + 0.86 * depth * depth) * pop;
          if (r <= 0.1) continue;
          // Dots stay under the line: nothing pokes through the top of the curve.
          if (row * step + step / 2 + r + 2 > height) continue;
          const cy = base - (row * step + step / 2);
          ctx.moveTo(cx + r, cy);
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    paintDots(mainCurve, 0, ink);
    if (head > NEXT_START) paintDots(nextCurve, NEXT_START, accent);

    // The baseline, then stems that rise only as far as the curve, so they never run through the copy.
    ctx.fillStyle = ink;
    ctx.fillRect(0, base, W, 1);
    ctx.font = `${Math.max(10.5, Math.min(13, W / 95))}px ${font}`;
    ctx.textBaseline = "top";
    labels.forEach((label, i) => {
      const edge = PHASE_EDGES[i];
      const x = edge * W;
      ctx.globalAlpha = i === phase ? 1 : 0.55;
      // On a narrow chart, a label that would run into the next one is cut down to fit.
      let text = label.toUpperCase();
      const room = ((PHASE_EDGES[i + 1] ?? 1) - edge) * W - 12;
      if (ctx.measureText(text).width > room) text = `${text.slice(0, 4)}.`;
      ctx.fillText(text, x + (i === 0 ? 0 : 6), base + 8);
      if (i > 0) {
        const stemTop = yAt(mainCurve(edge)) - 18;
        ctx.globalAlpha = 0.34;
        ctx.fillRect(x, stemTop, 1, H - stemTop);
      }
    });
    ctx.globalAlpha = 1;

    // The line itself.
    const trace = (curve: (x: number) => number, fromX: number, colour: string, width: number) => {
      const end = Math.min(head, 1);
      if (end <= fromX) return;
      // A halo in the page colour lifts the line off the dots beneath it.
      const path = new Path2D();
      const samples = Math.ceil(W / 2);
      for (let i = 0; i <= samples; i++) {
        const xn = fromX + (end - fromX) * (i / samples);
        const yv = yAt(curve(xn));
        if (i === 0) path.moveTo(xn * W, yv);
        else path.lineTo(xn * W, yv);
      }
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = paper;
      ctx.lineWidth = width + 6;
      ctx.stroke(path);
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.stroke(path);

      // The cell riding the head of the line.
      const hx = end * W;
      const hy = yAt(curve(end));
      if (hy > -10) {
        ctx.beginPath();
        ctx.arc(hx, hy, 11, 0, Math.PI * 2);
        ctx.fillStyle = paper;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(hx, hy, 9, 0, Math.PI * 2);
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = paper;
        ctx.fill();
      }
    };
    trace(mainCurve, 0, ink, 3);
    if (head > NEXT_START) trace(nextCurve, NEXT_START, accent, 3);
  }

  return { draw, resize, phaseOf: (p: number) => Math.min(3, Math.floor(clamp01(p) * 4)) };
}
