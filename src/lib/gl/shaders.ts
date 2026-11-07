/**
 * GLSL for the living-cell stage and the petri dish.
 *
 * The stage is a two-pass GPU metaball renderer:
 *  1. FIELD: every cell is an instanced quad drawn additively into a half-res float target, so cost
 *     scales with screen coverage rather than cell count and thousands of cells stay cheap. Cell
 *     positions are looked up in the vertex shader from a binary "family tree" texture, which makes
 *     division a pure function of one float (the generation) and fully reversible on scroll.
 *  2. COMPOSITE: thresholds the field and lights it, with refraction of real page type.
 */

export const FIELD_VERT = /* glsl */ `
precision highp float;
precision highp int;
precision highp sampler2D;

in vec2 position;
in float aIndex;

uniform sampler2D uTree;
uniform int uTreeW;
uniform float uGen;
uniform float uTime;
uniform float uR0;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uWordMix;
uniform float uZoom;
uniform vec2 uFocus;
uniform vec3 uPointer;
uniform float uPush;
uniform vec3 uBead;
uniform vec2 uVel;
uniform float uPortrait;

out vec2 vQ;
out vec2 vN;
out float vW;
out float vNuc;

// Visible radius / kernel radius at the composite threshold of 0.3.
const float KERNEL = 0.575;

vec4 nodeAt(int n) {
  return texelFetch(uTree, ivec2(n % uTreeW, n / uTreeW), 0);
}

float hash(float n) {
  return fract(sin(n * 12.9898) * 43758.5453);
}

void main() {
  float g = max(uGen, 0.0);
  int C = int(ceil(g));
  int total = 1 << C;
  int i = int(aIndex + 0.5);

  vec2 p;
  float r;
  float w = 1.0;
  float nucW = 1.0;
  vec2 nOff = vec2(0.0);

  if (i >= total) {
    // One extra instance: the bead that follows the pointer and fuses with whatever it touches.
    p = uBead.xy;
    r = uBead.z;
    nucW = 0.0;
  } else {
    int n = total + i;
    int par = C == 0 ? 1 : (n >> 1);
    float f = C == 0 ? 1.0 : g - float(C - 1);

    // Siblings share a phase, and families divide slightly out of step, as real cultures do.
    const float spread = 0.5;
    float tt = clamp((f - hash(float(par)) * spread) / (1.0 - spread), 0.0, 1.0);
    float e = tt * tt * tt * (tt * (6.0 * tt - 15.0) + 10.0);

    vec4 a = nodeAt(par);
    vec4 b = nodeAt(n);
    vec2 wordPos = mix(a.xy, b.xy, e);
    vec2 clusRel = mix(a.zw, b.zw, e);
    vec2 clus = uCenter + clusRel * uR0;

    // The letters assemble along the reading direction of the word.
    float wave = mix(wordPos.x / uRes.x, 1.0 - wordPos.y / uRes.y, uPortrait);
    float m = clamp(uWordMix * 1.6 - wave * 0.6, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    p = mix(clus, wordPos, m);

    // Area is conserved: two daughters have the same total area as their parent.
    float genf = C == 0 ? 0.0 : float(C - 1) + e;
    r = uR0 * pow(2.0, -0.5 * genf);

    // Coincident daughters each weigh 0.5, so the field does not pop when a cell starts dividing.
    w = C == 0 ? 1.0 : mix(0.5, 1.0, e);
    nucW = w;

    // The nucleus splits first, then the membrane pinches: that is what makes it read as mitosis.
    float ttn = clamp(tt * 1.7, 0.0, 1.0);
    float en = ttn * ttn * (3.0 - 2.0 * ttn);
    vec2 nRel = mix(a.zw, b.zw, en);
    nOff = (nRel - clusRel) * uR0 * (1.0 - m);
    nOff += r * 0.13 * vec2(sin(uTime * 0.53 + clusRel.x * 5.0), cos(uTime * 0.47 + clusRel.y * 5.0));

    p += r * 0.05 * vec2(sin(uTime * 0.7 + p.y * 0.02), cos(uTime * 0.6 + p.x * 0.02));

    // The pointer pushes cells aside.
    if (uPointer.z > 0.0) {
      vec2 d = p - uPointer.xy;
      float dl = length(d) + 0.001;
      float falloff = 1.0 - smoothstep(0.0, uPointer.z, dl);
      p += (d / dl) * falloff * falloff * uPush;
    }
  }

  p = uFocus + (p - uFocus) * uZoom;
  r *= uZoom;
  nOff *= uZoom;

  float R = r / KERNEL;
  vec2 off = position * R;

  // Jelly: stretch along the direction of travel, thin across it.
  float sp = length(uVel);
  if (sp > 0.001 && i < total) {
    vec2 dir = uVel / sp;
    float s = 1.0 + min(sp * 0.0035, 0.3);
    float along = dot(off, dir);
    vec2 across = off - dir * along;
    off = dir * along * s + across / s;
  }

  vQ = position;
  vN = (position * R - nOff) / max(r * 0.42, 0.001);
  vW = w;
  vNuc = nucW;

  vec2 clip = (p + off) / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

export const FIELD_FRAG = /* glsl */ `
precision highp float;

in vec2 vQ;
in vec2 vN;
in float vW;
in float vNuc;
out vec4 o;

const float KERNEL = 0.575;

void main() {
  float s = max(0.0, 1.0 - dot(vQ, vQ));
  float nk = max(0.0, 1.0 - dot(vN, vN));
  // Field value, and its analytic gradient scaled by cell radius so it is dimensionless. Gradients
  // add just like the field does, which gives perfectly smooth normals with no finite differences:
  // half-float precision is far too coarse to difference across a cell the size of the screen.
  vec2 grad = -6.0 * vQ * s * s * KERNEL * vW;
  o = vec4(s * s * s * vW, grad, nk * nk * vNuc);
}
`;

export const FULLSCREEN_VERT = /* glsl */ `
precision highp float;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const COMPOSITE_FRAG = /* glsl */ `
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 o;

uniform sampler2D tField;
uniform sampler2D tPlate;
uniform vec2 uRes;
uniform vec4 uPlateRect;
uniform float uPlateOn;
uniform float uTime;
uniform float uWarp;
uniform float uFlat;
uniform float uOpacity;
uniform float uIris;
uniform float uCellR;
uniform vec3 cBody;
uniform vec3 cEdge;
uniform vec3 cInk;
uniform vec3 cNuc;
uniform vec3 cNucCore;
uniform vec3 cShadow;

const float TH = 0.30;

float plateAt(vec2 q) {
  vec2 inside = step(vec2(0.0), q) * step(q, vec2(1.0));
  // Thresholding the filtered sample keeps edges crisp under magnification.
  return smoothstep(0.32, 0.68, textureLod(tPlate, q, 0.0).r) * inside.x * inside.y;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  float t = uTime;

  // Organic membrane: a slow, cheap domain warp rather than noise, so empty screen costs almost nothing.
  vec2 warp = vec2(
    sin(px.y * 0.011 + t * 0.7) + 0.6 * sin(px.y * 0.027 - t * 0.45 + px.x * 0.009),
    sin(px.x * 0.012 - t * 0.6) + 0.6 * sin(px.x * 0.024 + t * 0.5 + px.y * 0.008)
  ) * uWarp;

  vec2 uv = vUv + vec2(warp.x, -warp.y) / uRes;
  vec4 f = textureLod(tField, uv, 0.0);
  float v = f.r;
  float aa = clamp(fwidth(v) * 0.9, 0.0015, 0.09);
  vec4 flatFill = vec4(cBody, 1.0);

  if (v < 0.09) {
    o = mix(vec4(0.0), flatFill, uFlat);
    return;
  }

  float edge = smoothstep(TH - aa, TH + aa, v);

  // y is down, matching px. The gradient points inward; this points out through the surface.
  vec2 g = f.gb;
  float slope = length(g);
  vec2 outward = -g / max(slope, 1e-4);

  // How far out from the cell's centre we are, 0 to 1, recovered by inverting the kernel. It treats a
  // large cell as a true ball, where the raw gradient would make a sharply peaked cone. Small cells
  // keep the gradient, so that a mass of fused beads stays bumpy.
  float rho = clamp(sqrt(max(1.0 - pow(min(v, 1.0), 1.0 / 3.0), 0.0)) / 0.575, 0.0, 1.0);
  vec3 nBall = vec3(outward * rho, sqrt(max(1.0 - rho * rho, 0.0)));
  vec3 nBead = normalize(vec3(-g * 1.7, 1.0));
  float ball = smoothstep(14.0, 40.0, uCellR);
  vec3 n = normalize(mix(nBead, nBall, ball));
  float tilt = 1.0 - n.z;

  // Distance inside the membrane in CSS px, so its line weight is deliberate at every cell size.
  float inward = (v - TH) * uCellR / max(slope, 0.02);

  vec3 body = mix(cBody, cEdge, smoothstep(0.1, 0.66, tilt));

  // Fine organelles drifting in the cytoplasm of large cells only.
  float specks = sin(px.x * 0.083 + warp.y * 0.3 + t * 0.2) * sin(px.y * 0.097 - warp.x * 0.3 - t * 0.17);
  body = mix(body, cEdge, smoothstep(0.88, 0.95, specks) * ball * 0.28);

  // Page type seen through the cell, as through a drop of water: magnified about 1.7x at the centre,
  // compressing towards the rim. The profile is chosen so the image never folds back on itself. Each
  // colour channel refracts by a slightly different amount, which gives a hairline fringe at the rim.
  if (uPlateOn > 0.001) {
    vec2 off = -outward * uCellR * rho * (0.42 + 0.14 * rho * rho * rho);
    vec2 base = px - uPlateRect.xy;
    vec3 ink = vec3(
      plateAt((base + off * 0.982) / uPlateRect.zw),
      plateAt((base + off) / uPlateRect.zw),
      plateAt((base + off * 1.018) / uPlateRect.zw)
    );
    body = mix(body, cInk, ink * uPlateOn);
  }

  vec3 col = body;

  // Nucleus, with a hairline ring and a paler nucleolus.
  float nv = f.a;
  float nW = 0.5 * clamp(fwidth(nv) * 1.6, 0.008, 0.08);
  float ne = smoothstep(0.42 - nW, 0.42 + nW, nv);
  float ring = ne - smoothstep(0.47 - nW, 0.47 + nW, nv);
  vec3 nc = mix(cNuc, cNucCore, smoothstep(0.5, 1.05, nv));
  float nucleolus = smoothstep(0.86, 0.9, nv + 0.1 * sin(px.x * 0.05 + t * 0.4) * sin(px.y * 0.06 - t * 0.3));
  nc = mix(nc, cBody, nucleolus * 0.7);
  nc = mix(nc, cNucCore, ring * 0.8);
  col = mix(col, nc, ne * ball);

  // Membrane: a crisp line just inside the edge.
  float memW = max(1.2, uCellR * 0.02);
  col = mix(cEdge * 0.72, col, smoothstep(memW * 0.6, memW * 1.25, inward));

  // Light. A hard, painted highlight and a thin crescent of reflected window keep this feeling like
  // a poster illustration rather than a CG render.
  vec3 L = normalize(vec3(-0.5, -0.66, 0.56));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float ndh = max(dot(n, H), 0.0);
  float spec = smoothstep(0.35, 0.55, pow(ndh, mix(70.0, 520.0, ball)));
  col += pow(ndh, 8.0) * 0.05;

  float side = dot(outward, normalize(vec2(-0.6, -0.8)));
  float crescent = smoothstep(0.76, 0.81, rho) * (1.0 - smoothstep(0.86, 0.9, rho)) * smoothstep(0.35, 0.95, side);
  col = mix(col, vec3(1.0), crescent * ball * 0.55);

  float bounce = pow(tilt * 1.4, 2.0) * max(dot(outward, normalize(vec2(0.6, 0.8))), 0.0);
  col += cBody * bounce * 0.3;

  // Thin-film sheen for the metallic colonies on EMB agar: green, gold, a touch of violet at the rim.
  float seed = 0.5 + 0.5 * sin(px.x * 0.021 + px.y * 0.017);
  vec3 film = 0.5 + 0.5 * cos(6.2831 * (n.z * 1.15 + seed * 0.45 + t * 0.03 + vec3(0.0, 0.08, 0.3)));
  col = mix(col, col * (0.56 + film * 0.8) + film * 0.05, uIris);

  col = mix(col, vec3(1.0), spec * 0.96);
  col += (hash(px + fract(t)) - 0.5) * 0.016;

  // A tight contact shadow, offset so it reads as a shape on the agar and not a glow around one.
  vec2 shadowUv = uv + vec2(-0.022, 0.04) * uCellR / uRes;
  float shadowField = textureLod(tField, shadowUv, 0.0).r;
  float shadow = smoothstep(TH - 0.05, TH, shadowField) * (1.0 - edge) * 0.24;

  float alpha = edge + shadow;
  vec4 lit = vec4(col * edge + cShadow * shadow, alpha) * uOpacity;

  // At the end of the fly-through the frame resolves to one flat colour, which is the next section.
  o = mix(lit, flatFill, uFlat);
}
`;

/* -------------------------------------------------------------------------- */
/* Petri dish: Gray-Scott reaction-diffusion                                   */
/* -------------------------------------------------------------------------- */

export const SIM_FRAG = /* glsl */ `
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 o;

uniform sampler2D tState;
uniform vec2 uTexel;
uniform vec2 uFkFrom;
uniform vec2 uFkTo;
uniform float uFront;
uniform vec3 uSeed;
uniform float uGrid;

void main() {
  vec2 c = texture(tState, vUv).rg;
  vec2 lap = -c;
  lap += 0.2 * (
    texture(tState, vUv + vec2(uTexel.x, 0.0)).rg +
    texture(tState, vUv - vec2(uTexel.x, 0.0)).rg +
    texture(tState, vUv + vec2(0.0, uTexel.y)).rg +
    texture(tState, vUv - vec2(0.0, uTexel.y)).rg
  );
  lap += 0.05 * (
    texture(tState, vUv + uTexel).rg +
    texture(tState, vUv - uTexel).rg +
    texture(tState, vUv + vec2(uTexel.x, -uTexel.y)).rg +
    texture(tState, vUv + vec2(-uTexel.x, uTexel.y)).rg
  );

  float d = length(vUv * 2.0 - 1.0);

  // A new strain takes over in a ring spreading from the centre of the dish.
  vec2 fk = mix(uFkFrom, uFkTo, smoothstep(uFront + 0.04, uFront - 0.04, d));

  float u = c.r;
  float v = c.g;
  float reaction = u * v * v;
  float nu = u + (lap.r - reaction + fk.x * (1.0 - u));
  float nv = v + (0.5 * lap.g + reaction - (fk.y + fk.x) * v);

  // The glass wall.
  float inside = 1.0 - smoothstep(0.965, 0.985, d);
  nu = mix(1.0, nu, inside);
  nv *= inside;

  // The growth front: it clears the old culture just ahead of itself and drops new colonies in its
  // wake, on a jittered grid, so every strain establishes evenly across the whole dish.
  if (uFront < 1.3) {
    float ahead = smoothstep(uFront - 0.005, uFront + 0.01, d) * (1.0 - smoothstep(uFront + 0.04, uFront + 0.07, d));
    nv *= 1.0 - ahead * 0.3;
    float behind = smoothstep(uFront - 0.08, uFront - 0.06, d) * (1.0 - smoothstep(uFront - 0.02, uFront - 0.005, d));
    if (behind > 0.0) {
      vec2 gv = vUv * uGrid;
      vec2 id = floor(gv);
      vec2 jitter = vec2(fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453), fract(sin(dot(id, vec2(269.5, 183.3))) * 43758.5453));
      float sd = length(fract(gv) - 0.32 - jitter * 0.36);
      float s = (1.0 - smoothstep(0.2, 0.32, sd)) * behind;
      nv = max(nv, s * 0.5);
      nu = min(nu, 1.0 - s * 0.5);
    }
  }

  // Feeding from the pointer.
  if (uSeed.z > 0.0) {
    float s = smoothstep(uSeed.z, uSeed.z * 0.55, length(vUv - uSeed.xy));
    nv = max(nv, s * 0.55);
    nu = min(nu, 1.0 - s * 0.5);
  }

  o = vec4(clamp(nu, 0.0, 1.0), clamp(nv, 0.0, 1.0), 0.0, 1.0);
}
`;

export const SEED_FRAG = /* glsl */ `
precision highp float;

in vec2 vUv;
out vec4 o;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
}

void main() {
  // A scattering of inoculation points clustered near the centre.
  vec2 cell = floor(vUv * 11.0);
  vec2 local = fract(vUv * 11.0) - 0.5;
  float roll = hash(cell);
  float d = length(vUv * 2.0 - 1.0);
  float present = step(0.62, roll) * smoothstep(0.86, 0.5, d);
  float s = present * smoothstep(0.34, 0.22, length(local));
  o = vec4(1.0 - s * 0.5, s * 0.42, 0.0, 1.0);
}
`;

export const DISH_FRAG = /* glsl */ `
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 o;

uniform sampler2D tState;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uRadius;
uniform vec2 uSimTexel;
uniform float uFront;
uniform float uTime;
uniform float uDpr;
uniform vec3 cAgarFrom;
uniform vec3 cAgarTo;
uniform vec3 cColFrom;
uniform vec3 cColTo;
uniform vec3 cEdgeFrom;
uniform vec3 cEdgeTo;
uniform vec3 cShadow;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  vec2 q = (px - uCenter) / uRadius;
  float d = length(q);
  float aa = 1.5 / uRadius;

  // Outside the dish: a soft shadow on the page.
  float shadow = smoothstep(1.2, 1.0, length(q - vec2(0.018, 0.032))) * 0.34;
  if (d > 1.035 + aa) {
    o = vec4(cShadow * shadow, shadow);
    return;
  }

  vec2 uv = q * 0.5 + 0.5;
  float v = texture(tState, uv).g;
  float vx = texture(tState, uv + vec2(uSimTexel.x, 0.0)).g - texture(tState, uv - vec2(uSimTexel.x, 0.0)).g;
  float vy = texture(tState, uv + vec2(0.0, uSimTexel.y)).g - texture(tState, uv - vec2(0.0, uSimTexel.y)).g;

  // The incoming strain's colours arrive with its growth front.
  float m = smoothstep(uFront + 0.05, uFront - 0.05, d);
  vec3 agar = mix(cAgarFrom, cAgarTo, m);
  vec3 colony = mix(cColFrom, cColTo, m);
  vec3 colEdge = mix(cEdgeFrom, cEdgeTo, m);

  // Agar: a pool of light, slightly grainy.
  vec3 col = agar * (0.92 + 0.14 * (1.0 - d * d));
  col += (hash(floor(px / uDpr)) - 0.5) * 0.022;

  // Colonies are a hard threshold of a smooth field, so they stay crisp at any display density.
  float fw = clamp(fwidth(v) * 0.9, 0.002, 0.03);
  float c = smoothstep(0.17 - fw, 0.17 + fw, v);

  vec3 n = normalize(vec3(-vx * 13.0, -vy * 13.0, 1.0));
  vec3 L = normalize(vec3(-0.45, 0.62, 0.64));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float ndh = max(dot(n, H), 0.0);
  float diffuse = clamp(dot(n, L), 0.0, 1.0);

  vec3 lit = mix(colEdge, colony, smoothstep(0.17, 0.3, v));
  lit *= 0.82 + 0.3 * diffuse;
  lit = mix(lit, vec3(1.0), smoothstep(0.5, 0.8, pow(ndh, 60.0)) * 0.86);

  // A faint halo where each colony has changed the agar around it.
  col = mix(col, colEdge, smoothstep(0.03, 0.17, v) * 0.16);
  col = mix(col, lit, c);

  // Glass: inner lip, thick wall, a broad reflection across the lid.
  float lip = smoothstep(0.962, 0.972, d) * smoothstep(1.0 + aa, 1.0 - aa, d);
  col = mix(col, vec3(1.0), lip * 0.17);
  float ringIn = smoothstep(0.003, 0.0, abs(d - 0.968));
  col += ringIn * 0.13;

  vec2 dir = q / max(d, 1e-4);
  float arc = pow(max(dot(dir, normalize(vec2(-0.55, -0.83))), 0.0), 5.0);
  float arc2 = pow(max(dot(dir, normalize(vec2(0.7, 0.71))), 0.0), 9.0);
  float glare = smoothstep(0.1, 0.0, abs(q.x * 0.71 + q.y * 0.71 + 0.42)) * smoothstep(1.0, 0.72, d) * 0.055;
  col += glare;
  col += smoothstep(0.93, 0.965, d) * arc * 0.26;

  // Wall of the dish, outside the agar.
  float wall = smoothstep(1.0 - aa, 1.0 + aa, d);
  vec3 wallCol = mix(agar * 1.1, vec3(1.0), 0.28 + arc * 0.62 + arc2 * 0.3);
  col = mix(col, wallCol, wall);
  float wallA = mix(1.0, 0.62 + arc * 0.3, wall);

  float inner = smoothstep(1.035 + aa, 1.035 - aa, d);
  float a = inner * wallA;
  vec3 premult = col * a + cShadow * shadow * (1.0 - a);
  o = vec4(premult, a + shadow * (1.0 - a));
}
`;
