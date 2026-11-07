/**
 * Builds the colony's family tree.
 *
 * Sample points inside a word's letterforms, then partition them recursively with a k-d tree. Every
 * tree node's position is the centroid of its descendants, so one parent cell really does have two
 * daughters that sit where their own descendants will end up. Generation 12 spells the word; every
 * earlier generation is a coarser version of it. Nodes are stored in heap order (children of n are
 * 2n and 2n+1) in a float texture that the vertex shader reads.
 *
 * Each node also stores a second position (zw) for the early, loose cluster seen before the cells
 * start migrating into the letters.
 */

export type Colony = {
  data: Float32Array;
  texW: number;
  texH: number;
  gens: number;
  /** Radius of a root cell whose area equals the total ink of the word, in CSS px. */
  r0: number;
  /** A point deep inside the thickest stroke, and the zoom needed to fill the screen from there. */
  focus: { x: number; y: number; zoom: number };
};

const CLUSTER_GENS = 6;

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildColony(opts: {
  W: number;
  H: number;
  gens: number;
  family: string;
  word: string;
}): Colony {
  const { W, H, gens, family, word } = opts;
  const portrait = H > W * 1.05;
  const rand = mulberry(2026);

  // --- 1. Rasterise the word at half resolution ---------------------------------------------
  const scale = 0.5;
  const mw = Math.max(2, Math.ceil(W * scale));
  const mh = Math.max(2, Math.ceil(H * scale));
  const canvas = document.createElement("canvas");
  canvas.width = mw;
  canvas.height = mh;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  ctx.font = `400 200px ${family}`;
  const probe = ctx.measureText(word);
  const unitLen = (probe.actualBoundingBoxLeft + probe.actualBoundingBoxRight) / 200;
  const unitAsc = probe.actualBoundingBoxAscent / 200;
  const unitDesc = probe.actualBoundingBoxDescent / 200;

  // The canvas is as tall as the screen gets once a phone's URL bar has gone; lay out for what shows now.
  const visibleH = Math.min(window.innerHeight, H);
  const along = portrait ? visibleH * 0.84 : W * 0.92;
  const acrossMax = portrait ? W * 0.72 : H * 0.62;
  let fontSize = along / unitLen;
  const thick = (unitAsc + unitDesc) * fontSize;
  if (thick > acrossMax) fontSize *= acrossMax / thick;

  const cx = portrait ? W * 0.56 : W * 0.5;
  const cy = portrait ? visibleH * 0.46 : H * 0.46;

  ctx.save();
  ctx.translate(cx * scale, cy * scale);
  if (portrait) ctx.rotate(-Math.PI / 2);
  ctx.font = `400 ${fontSize * scale}px ${family}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  const textLeft = (-unitLen * fontSize) / 2 + probe.actualBoundingBoxLeft / 200 * fontSize;
  ctx.fillText(word, textLeft * scale, (((unitAsc - unitDesc) * fontSize) / 2) * scale);
  ctx.restore();

  const alpha = ctx.getImageData(0, 0, mw, mh).data;
  const ink = new Uint8Array(mw * mh);
  let inkPixels = 0;
  for (let i = 0; i < ink.length; i++) {
    if (alpha[i * 4 + 3] > 127) {
      ink[i] = 1;
      inkPixels++;
    }
  }
  // Fall back to a disc rather than an empty colony if the font failed to draw.
  if (inkPixels < 16) {
    const rad = Math.min(mw, mh) * 0.3;
    inkPixels = 0;
    for (let y = 0; y < mh; y++) {
      for (let x = 0; x < mw; x++) {
        const inside = Math.hypot(x - mw / 2, y - mh / 2) < rad;
        ink[y * mw + x] = inside ? 1 : 0;
        if (inside) inkPixels++;
      }
    }
  }

  const inkArea = inkPixels / (scale * scale);
  const N = 1 << gens;

  // --- 2. Jittered-grid sampling, tightened until there are enough points --------------------
  let spacing = Math.sqrt(inkPixels / N) * 0.96;
  let pts: number[] = [];
  for (let attempt = 0; attempt < 12; attempt++) {
    pts = [];
    for (let gy = spacing / 2; gy < mh; gy += spacing) {
      for (let gx = spacing / 2; gx < mw; gx += spacing) {
        const x = gx + (rand() - 0.5) * spacing * 0.5;
        const y = gy + (rand() - 0.5) * spacing * 0.5;
        const ix = x | 0;
        const iy = y | 0;
        if (ix < 0 || iy < 0 || ix >= mw || iy >= mh) continue;
        if (ink[iy * mw + ix]) pts.push(x / scale, y / scale);
      }
    }
    if (pts.length / 2 >= N) break;
    spacing *= 0.95;
  }
  // Drop extras at random so the count is an exact power of two.
  while (pts.length / 2 > N) {
    const k = (rand() * (pts.length / 2)) | 0;
    const last = pts.length - 2;
    pts[k * 2] = pts[last];
    pts[k * 2 + 1] = pts[last + 1];
    pts.length = last;
  }
  // Duplicate if a pathologically thin font left us short.
  for (let k = 0; pts.length / 2 < N; k++) pts.push(pts[k * 2] + 0.5, pts[k * 2 + 1] + 0.5);

  // --- 3. k-d partition into a heap-ordered tree ---------------------------------------------
  const nodeCount = 1 << (gens + 1);
  const texW = 256;
  const texH = Math.ceil(nodeCount / texW);
  const data = new Float32Array(texW * texH * 4);
  const ids = new Int32Array(N);
  for (let i = 0; i < N; i++) ids[i] = i;

  const partition = (lo: number, hi: number, node: number) => {
    let sx = 0;
    let sy = 0;
    let minx = Infinity;
    let maxx = -Infinity;
    let miny = Infinity;
    let maxy = -Infinity;
    for (let i = lo; i < hi; i++) {
      const x = pts[ids[i] * 2];
      const y = pts[ids[i] * 2 + 1];
      sx += x;
      sy += y;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
    }
    const count = hi - lo;
    data[node * 4] = sx / count;
    data[node * 4 + 1] = sy / count;
    if (count === 1) return;
    const axis = maxx - minx >= maxy - miny ? 0 : 1;
    const seg = Array.from(ids.subarray(lo, hi)).sort((a, b) => pts[a * 2 + axis] - pts[b * 2 + axis]);
    ids.set(seg, lo);
    const mid = lo + (count >> 1);
    partition(lo, mid, node * 2);
    partition(mid, hi, node * 2 + 1);
  };
  partition(0, N, 1);

  // --- 4. The early cluster: real division, then relaxed so cells sit shoulder to shoulder ---
  data[6] = 0;
  data[7] = 0;
  const clusterGens = Math.min(CLUSTER_GENS, gens);
  for (let g = 1; g <= clusterGens; g++) {
    const first = 1 << g;
    const r = Math.pow(2, -g / 2);
    const minD = 2 * r * 1.2;
    const xs = new Float32Array(first);
    const ys = new Float32Array(first);
    for (let i = 0; i < first; i += 2) {
      const par = (first + i) >> 1;
      // Mitosis alternates its axis generation to generation.
      const angle = (g % 2 ? 0.35 : 0.35 + Math.PI / 2) + (rand() - 0.5) * 1.1;
      const ox = Math.cos(angle) * r * 1.2;
      const oy = Math.sin(angle) * r * 1.2;
      xs[i] = data[par * 4 + 2] + ox;
      ys[i] = data[par * 4 + 3] + oy;
      xs[i + 1] = data[par * 4 + 2] - ox;
      ys[i + 1] = data[par * 4 + 3] - oy;
    }
    for (let iter = 0; iter < 90; iter++) {
      for (let a = 0; a < first; a++) {
        for (let b = a + 1; b < first; b++) {
          let dx = xs[b] - xs[a];
          let dy = ys[b] - ys[a];
          const d = Math.hypot(dx, dy) || 1e-4;
          if (d < minD) {
            const push = ((minD - d) / d) * 0.5;
            dx *= push;
            dy *= push;
            xs[a] -= dx;
            ys[a] -= dy;
            xs[b] += dx;
            ys[b] += dy;
          }
        }
      }
      for (let a = 0; a < first; a++) {
        xs[a] *= 0.992;
        ys[a] *= 0.992;
      }
    }
    for (let i = 0; i < first; i++) {
      data[(first + i) * 4 + 2] = xs[i];
      data[(first + i) * 4 + 3] = ys[i];
    }
  }
  // Below the cluster depth, daughters simply inherit: by then the cells are migrating to the word.
  for (let n = 1 << (clusterGens + 1); n < nodeCount; n++) {
    data[n * 4 + 2] = data[(n >> 1) * 4 + 2];
    data[n * 4 + 3] = data[(n >> 1) * 4 + 3];
  }

  // --- 5. Where to fly in: the centre of the thickest stroke, via a chamfer distance transform -
  const dist = new Float32Array(mw * mh);
  for (let i = 0; i < dist.length; i++) dist[i] = ink[i] ? 1e6 : 0;
  const D = 1;
  const D2 = Math.SQRT2;
  for (let y = 1; y < mh - 1; y++) {
    for (let x = 1; x < mw - 1; x++) {
      const i = y * mw + x;
      if (!dist[i]) continue;
      dist[i] = Math.min(dist[i], dist[i - 1] + D, dist[i - mw] + D, dist[i - mw - 1] + D2, dist[i - mw + 1] + D2);
    }
  }
  let best = -Infinity;
  let bx = mw / 2;
  let by = mh / 2;
  let bd = 1;
  for (let y = mh - 2; y >= 1; y--) {
    for (let x = mw - 2; x >= 1; x--) {
      const i = y * mw + x;
      if (!dist[i]) continue;
      dist[i] = Math.min(dist[i], dist[i + 1] + D, dist[i + mw] + D, dist[i + mw + 1] + D2, dist[i + mw - 1] + D2);
      const score = dist[i] - 0.012 * Math.hypot(x - mw / 2, y - mh / 2);
      if (score > best) {
        best = score;
        bx = x;
        by = y;
        bd = dist[i];
      }
    }
  }

  return {
    data,
    texW,
    texH,
    gens,
    r0: Math.sqrt(inkArea / Math.PI),
    focus: {
      x: bx / scale,
      y: by / scale,
      zoom: (Math.hypot(W, H) / (bd / scale)) * 1.25,
    },
  };
}
