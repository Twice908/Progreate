import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  Color,
  LinearSRGBColorSpace,
  Mesh,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from "three";

export type AuroraConfig = {
  colors: {
    background: string;
    strands: string[];
    core: string;
    hot: string;
    hazeDeep: string;
    hazeBright: string;
  };
  origin: { x: number; y: number; glow: number };
  path: { landing: number; curve: number; sectionLength: number; wobble: number; seed: number };
  race: { duration: number; stagger: number; lagFast: number; lagSlow: number; maxGap: number };
  filaments: { count: number; thickCount: number; thinWidth: number; thickWidth: number; glow: number };
  merge: { length: number; returnLength: number; returnEvery: number; flare: number };
  speed: number;
  intensity: number;
  haze: number;
  quietHaze: number;
  vignette: { edge: number; left: number };
  dotGrid: { spacing: number; opacity: number };
  grain: number;
  maxPixelRatio: number;
  phone: { maxWidth: number; lineWidth: number; brightness: number; glow: number; haze: number; originGlow: number };
};

/** Every tunable value for the look. Edit here; nothing below should need touching. */
export const AURORA_CONFIG: AuroraConfig = {
  colors: {
    background: "#040604", // Canvas colour, everything else is light added on top of it.
    strands: ["#FFFFFF", "#EFFFB0", "#C8FF2E"], // Shades the strands are shared out across, evenly from first to last.
    core: "#C8FF2E", // Lime of the origin glow.
    hot: "#EFFFB0", // Near-white of the racing strand tips and the origin glow.
    hazeDeep: "#0B2A12", // Haze in its thin, dark areas.
    hazeBright: "#2F6B1A", // Haze in its dense areas.
  },
  origin: {
    x: 1.12, // Where every strand starts, as a fraction of the viewport width. Above 1 is off-screen right.
    y: 0.02, // Same point, as a fraction of the viewport height from the top of the page.
    glow: 1, // Brightness of the glow around the origin, bleeding in from the right edge. 0 removes it.
  },
  path: {
    landing: 1.05, // Page depth (in viewport heights) where the strands have finished fanning out from the origin.
    curve: 1.9, // How early they turn. Higher = run further left first, then drop. 1 = no extra sweep.
    sectionLength: 1.1, // Viewport heights between a strand's random turns. Smaller = twistier paths.
    wobble: 0.05, // Small extra waviness on top of the turns, in viewport heights.
    seed: 7, // Picks the random paths, thicknesses and shades. Any other number gives a different layout.
  },
  race: {
    duration: 2.4, // Seconds the slowest strand takes on load. Faster strands take 60% of this.
    stagger: 0.5, // Strands set off at random within this many seconds, so they don't all start together.
    lagFast: 0.35, // Seconds the quickest strands take to catch up with a scroll.
    lagSlow: 1, // Same for the slowest. A bigger gap means a more spread-out race while scrolling.
    maxGap: 0.6, // Furthest the tips can fall behind the page, in viewport heights, so a long jump never leaves the screen without strands.
  },
  filaments: {
    count: 10, // Total number of strands.
    thickCount: 3, // How many of them are the thick ones.
    thinWidth: 0.8, // Core width of the thin strands, CSS pixels.
    thickWidth: 2.2, // Core width of the thick strands, CSS pixels.
    glow: 20, // How far the soft glow around each strand reaches, CSS pixels.
  },
  merge: {
    // The page decides where: strands converge on the element marked data-aurora-merge="primary",
    // then stop. A few come back for the element marked data-aurora-merge="final".
    length: 1.2, // Viewport heights over which the strands bend in towards the primary point.
    returnLength: 0.75, // Same for the final point. The strands fade in at the start of this stretch.
    returnEvery: 3, // Which strands come back: 3 = every third one. 1 = all of them.
    flare: 1, // Brightness of the flare at each point as it scrolls into view. 0 removes it.
  },
  speed: 0.14, // Rate of the slow idle drift. Doesn't affect the race. 0 freezes it.
  intensity: 1, // Master brightness of all the light.
  haze: 0.75, // Amount of volumetric green haze around the strands.
  quietHaze: 0.4, // Faint still haze everywhere, so glass cards have something to blur where there are no strands.
  vignette: {
    edge: 0.45, // Darkening towards the viewport edges, 0 to 1.
    left: 0.55, // Extra darkening of the left third, keeps the headline readable, 0 to 1.
  },
  dotGrid: {
    spacing: 24, // Distance between dots, CSS pixels.
    opacity: 0.04, // Dot opacity.
  },
  grain: 0.035, // Film grain strength. Also dithers away banding in the dark gradients.
  maxPixelRatio: 1.5, // devicePixelRatio is clamped to this.
  phone: {
    // On narrow screens text runs the full width, so the strands can't avoid it: they recede instead.
    maxWidth: 810, // Viewports narrower than this (CSS pixels) use these multipliers. Matches the site's md breakpoint.
    lineWidth: 0.7, // Multiplies the strand widths.
    brightness: 0.5, // Multiplies the strand brightness. Doesn't affect the racing tips.
    glow: 0.5, // Multiplies the glow around the strands.
    haze: 0.6, // Multiplies the haze.
    originGlow: 0.5, // Multiplies the origin glow.
  },
};

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  #define PI 3.14159265359
  #define TIME (uTime * uSpeed)

  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform vec2 uScrollLag;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uPixelRatio;

  uniform vec3 uBackground;
  uniform vec3 uCoreColor;
  uniform vec3 uHotColor;
  uniform vec3 uHazeDeep;
  uniform vec3 uHazeBright;

  uniform vec2 uOrigin;
  uniform float uOriginGlow;
  uniform float uLanding;
  uniform float uCurve;
  uniform float uWobble;
  uniform float uRaceDuration;
  uniform float uRaceStagger;
  uniform float uGlow;
  uniform float uLineWidth;
  uniform float uLineBrightness;
  uniform vec2 uMergeA;
  uniform vec2 uMergeB;
  uniform vec2 uFlare;
  uniform float uMergeLength;
  uniform float uReturnLength;
  uniform float uReturnEvery;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform float uHaze;
  uniform float uQuietHaze;
  uniform vec2 uVignette;
  uniform vec2 uDotGrid;
  uniform float uGrain;

  // Per strand, generated once in JS: (turn rate, turn offset, wobble rate, wobble phase),
  // (width, brightness, knot seed, shimmer phase), (race delay, race pace, finish, -), colour.
  uniform vec4 uStrandPath[STRAND_COUNT];
  uniform vec4 uStrandLook[STRAND_COUNT];
  uniform vec3 uStrandRace[STRAND_COUNT];
  uniform vec3 uStrandColor[STRAND_COUNT];

  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(
      mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
      mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Normalised to 0..1. Never called with more than 4 octaves.
  float fbm(vec2 p, int octaves) {
    const mat2 rotation = mat2(0.8, 0.6, -0.6, 0.8);
    float amplitude = 0.5;
    float total = 0.0;
    float sum = 0.0;
    for (int i = 0; i < octaves; i++) {
      sum += amplitude * valueNoise(p);
      total += amplitude;
      p = rotation * p * 2.03 + 17.0;
      amplitude *= 0.5;
    }
    return sum / total;
  }

  // A random horizontal position (0..1 of the viewport width, slightly past both edges) for each turn.
  float turn(float k, float seed) {
    return hash11(k * 1.37 + seed) * 1.14 - 0.07;
  }

  // Catmull-Rom through the random turns. Unlike easing between them, it doesn't go vertical at each
  // turn, so strands wander instead of snaking. Returns (position, slope).
  vec2 wander(float v, float seed) {
    float k = floor(v);
    float f = v - k;
    float a = turn(k - 1.0, seed);
    float b = turn(k, seed);
    float c = turn(k + 1.0, seed);
    float d = turn(k + 2.0, seed);
    float c1 = c - a;
    float c2 = 2.0 * a - 5.0 * b + 4.0 * c - d;
    float c3 = 3.0 * (b - c) + d - a;
    return vec2(
      b + 0.5 * f * (c1 + f * (c2 + f * c3)),
      0.5 * (c1 + f * (2.0 * c2 + 3.0 * f * c3))
    );
  }

  // The flare where strands meet: one tight and two wide falloffs.
  vec3 flareAt(vec2 world, vec2 point, float amount) {
    float d = length(world - point);
    return amount * (
      uHotColor * exp(-d * d * 2600.0) * 2.6 +
      uCoreColor * exp(-d * d * 130.0) * 0.75 +
      uCoreColor * exp(-d * 6.0) * 0.28
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspect = uResolution.x / uResolution.y;
    float t = TIME;

    // Page space, in viewport heights: y runs down the whole document, so paths carry on as you scroll.
    vec2 world = vec2(uv.x * aspect, 1.0 - uv.y + uScroll);
    vec2 origin = vec2(uOrigin.x * aspect, uOrigin.y);
    float originDistance = length(world - origin);
    float cssPixel = uPixelRatio / uResolution.y;

    // The fan: 0 at the origin, 1 at the landing depth. Strands blend from the origin onto their paths.
    float depth = uLanding - origin.y;
    float s = clamp((world.y - origin.y) / depth, 0.0, 1.0);
    float fan = 1.0 - pow(1.0 - s, uCurve);
    float fanSlope = s > 0.0 && s < 1.0 ? uCurve * pow(1.0 - s, uCurve - 1.0) / depth : 0.0;

    // Distance along a strand. Counts the horizontal run in the fan too, so tips don't jump across
    // the near-flat start of each path.
    float run = origin.x * 0.6;
    float along = world.y > uLanding ? world.y : origin.y + depth * (fan * run + s * depth) / (run + depth);

    // Strands only exist above the primary point, then again in the short stretch above the final one.
    bool returning = uMergeB.y > 0.0 && world.y > uMergeB.y - uReturnLength && world.y <= uMergeB.y;
    vec2 mergePoint = returning ? uMergeB : uMergeA;
    float mergeLength = returning ? uReturnLength : uMergeLength;
    float merging = clamp(1.0 - (mergePoint.y - world.y) / mergeLength, 0.0, 1.0);
    float mergeBlend = merging * merging * (3.0 - 2.0 * merging);
    float mergeSlope = 6.0 * merging * (1.0 - merging) / mergeLength;
    float zone = returning || world.y <= uMergeA.y ? 1.0 - smoothstep(mergePoint.y - 0.012, mergePoint.y, world.y) : 0.0;
    if (returning) zone *= smoothstep(0.0, 0.3, merging);
    zone *= 1.0 + mergeBlend * 0.8;

    // Line cores are kept apart from the soft light: the roll-off below would wash lime out to white.
    vec3 lines = vec3(0.0);
    vec3 light = vec3(0.0);
    for (int i = 0; i < STRAND_COUNT; i++) {
      if (zone <= 0.0) break;
      if (returning && mod(float(i), uReturnEvery) > 0.5) continue;

      vec4 path = uStrandPath[i];
      vec4 look = uStrandLook[i];
      vec3 race = uStrandRace[i];

      vec2 w = wander(world.y * path.x + path.y, look.z);
      float wobblePhase = world.y * path.z + path.w + t;
      float target = w.x * aspect + uWobble * sin(wobblePhase);
      float targetSlope = w.y * aspect * path.x + uWobble * path.z * cos(wobblePhase);

      float x = origin.x + (target - origin.x) * fan;
      float slope = targetSlope * fan + (target - origin.x) * fanSlope;

      slope = slope * (1.0 - mergeBlend) + (mergePoint.x - x) * mergeSlope;
      x = mix(x, mergePoint.x, mergeBlend);

      // Horizontal distance, corrected by the slope to keep the line an even width on the diagonals.
      float distancePx = abs(world.x - x) / sqrt(1.0 + slope * slope) / cssPixel;

      float width = look.x * uLineWidth * (0.8 + 0.2 * sin(along * 2.3 + look.w));
      float line = exp(-distancePx * distancePx / (2.0 * width * width));
      float halo = exp(-distancePx / (uGlow * (0.6 + 0.4 * look.x)));

      // The race: every strand has its own start time, speed, finishing distance and scroll lag.
      float progress = clamp((uIntro - race.x * uRaceStagger) / (uRaceDuration * mix(0.6, 1.0, race.y)), 0.0, 1.0);
      float lag = mix(uScrollLag.y, uScrollLag.x, race.y);
      float head = mix(origin.y, mix(1.1, 1.55, race.z), progress * progress * (3.0 - 2.0 * progress)) + lag;
      float revealed = 1.0 - smoothstep(head - 0.012, head, along);

      // The bright tip only shows while racing: once a strand has parked it's a normal strand again.
      float racing = max(1.0 - smoothstep(0.8, 1.0, progress), clamp((uScroll - lag) * 5.0, 0.0, 1.0));
      float tip = exp(-max(head - along, 0.0) * 9.0) * revealed * racing;

      float shimmer = 0.82 + 0.18 * sin(along * 5.0 - uTime * 0.4 + look.w);
      float visible = look.y * uLineBrightness * shimmer * revealed * zone;
      // Feathered past the tip, or the glow would stop in a flat horizontal edge.
      float glowVisible = look.y * uLineBrightness * shimmer * (1.0 - smoothstep(head - 0.15, head + 0.02, along)) * zone;
      float tipGlow = exp(-max(head - along, 0.0) * 9.0) * glowVisible * racing;
      lines += uStrandColor[i] * line * visible + uHotColor * line * tip * zone * 1.5;
      light += uStrandColor[i] * (line * 0.3 * visible + halo * 0.28 * glowVisible) + uHotColor * halo * tipGlow * 0.5;
    }

    light += flareAt(world, uMergeA, uFlare.x);
    if (uMergeB.y > 0.0) light += flareAt(world, uMergeB, uFlare.y);

    // Volumetric haze, spreading in behind the race.
    vec2 q = vec2(
      fbm(world * 1.05 + vec2(0.0, t * 0.6), 2),
      fbm(world * 1.05 + vec2(5.2, 1.3 - t * 0.5), 2)
    ) - 0.5;
    float raceFront = mix(origin.y, 1.3, smoothstep(0.0, uRaceDuration + uRaceStagger, uIntro)) + uScrollLag.x;
    float density = fbm(world * 1.45 + q * 2.0 - vec2(t * 0.12, 0.0), 4);
    float hazeMask = (0.2 + 0.6 * exp(-originDistance * 1.1)) * (1.0 - smoothstep(raceFront - 0.25, raceFront + 0.25, world.y));
    hazeMask *= 1.0 - smoothstep(uMergeA.y - 0.7, uMergeA.y, world.y);
    light += mix(uHazeDeep, uHazeBright, smoothstep(0.3, 0.8, density))
      * smoothstep(0.15, 0.8, density) * hazeMask * uHaze * 1.9;

    // Still haze fixed to the screen. Nothing here moves, so drawing can pause in the quiet sections.
    float stillDensity = fbm(vec2(uv.x * aspect, uv.y) * 1.1 + 3.7, 4);
    light += mix(uHazeDeep, uHazeBright, smoothstep(0.35, 0.75, stillDensity))
      * smoothstep(0.25, 0.75, stillDensity) * uQuietHaze;

    // Origin glow, built from one tight and two wide falloffs.
    float d2 = originDistance * originDistance;
    light += uOriginGlow * smoothstep(0.0, 0.6, uIntro) * (
      uHotColor * exp(-d2 * 900.0) * 3.0 +
      uCoreColor * exp(-d2 * 95.0) * 0.95 +
      uCoreColor * exp(-originDistance * 6.5) * 0.3 +
      uHazeBright * exp(-originDistance * 2.8) * 0.4
    );

    // Vignette: general edge falloff, plus the darker left third.
    vec2 edge = uv - 0.5;
    float vignette = 1.0 - uVignette.x * smoothstep(0.15, 0.75, dot(edge, edge) * 2.0);
    vignette *= 1.0 - uVignette.y * (1.0 - smoothstep(0.0, 0.36, uv.x));

    // Additive light over the background, soft-clipped so highlights roll off instead of flattening.
    vec3 color = uBackground + 1.0 - exp(-light * vignette * uIntensity) + lines * vignette * uIntensity;

    // Dot grid.
    float spacing = uDotGrid.x * uPixelRatio;
    vec2 cell = mod(gl_FragCoord.xy, spacing) - spacing * 0.5;
    color += (1.0 - smoothstep(0.55, 1.25, length(cell) / uPixelRatio)) * uDotGrid.y;

    // Film grain.
    float grainSeed = fract(floor(uTime * 24.0) * 0.137) * 512.0;
    color += (hash12(gl_FragCoord.xy + grainSeed) - 0.5) * uGrain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Colours go in exactly as written: the shader works directly in display values.
const color = (hex: string) => new Color().setStyle(hex, LinearSRGBColorSpace);

/** Seeded random numbers (mulberry32), so a given `path.seed` always gives the same layout. */
function seededRandom(seed: number) {
  let state = seed * 2654435761;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rolls each strand's fixed traits. Shades run evenly through the range, thick strands spaced across them. */
function createStrands(config: AuroraConfig) {
  const random = seededRandom(config.path.seed);
  const { count, thickCount, thinWidth, thickWidth } = config.filaments;
  const stops = config.colors.strands.map(color);
  const thickStrands = new Set(
    Array.from({ length: thickCount }, (_, i) => Math.round((i * (count - 1)) / Math.max(thickCount - 1, 1))),
  );

  const strands = Array.from({ length: count }, (_, i) => {
    const thick = thickStrands.has(i);
    const position = (count > 1 ? i / (count - 1) : 0) * (stops.length - 1);
    const stop = Math.min(Math.floor(position), stops.length - 2);
    const mixed = stops[stop].clone().lerp(stops[stop + 1], position - stop);
    return {
      // Rate varies per strand so their turns never line up across a section.
      path: new Vector4(
        (0.75 + random() * 0.5) / config.path.sectionLength,
        random() * 10,
        2 + random() * 3,
        random() * Math.PI * 2,
      ),
      look: new Vector4(
        thick ? thickWidth * (0.9 + random() * 0.2) : thinWidth * (0.85 + random() * 0.4),
        thick ? 1 : 0.5 + random() * 0.35,
        config.path.seed + 3.17 * i,
        random() * Math.PI * 2,
      ),
      race: new Vector3(random(), random(), random()),
      color: new Vector3(mixed.r, mixed.g, mixed.b),
    };
  });

  return {
    uStrandPath: { value: strands.map((strand) => strand.path) },
    uStrandLook: { value: strands.map((strand) => strand.look) },
    uStrandRace: { value: strands.map((strand) => strand.race) },
    uStrandColor: { value: strands.map((strand) => strand.color) },
  };
}

const smoothstep = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

/**
 * Framework-agnostic WebGL background. Appends its own canvas to `container`.
 *
 * The strands look for elements marked data-aurora-merge="primary" and data-aurora-merge="final" to
 * converge on. With only one of them, they stop at that one. With neither, they run down the whole page.
 */
export class AuroraBackground {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new Camera();
  private readonly geometry = new BufferGeometry();
  private readonly material: ShaderMaterial;
  private readonly resizeObserver: ResizeObserver;
  private readonly lagTimes: [number, number];
  private readonly maxGap: number;
  private readonly merge: AuroraConfig["merge"];
  private flareScale = 1;
  private startTime?: number;
  private lastTime = 0;
  private lastMeasure = -Infinity;
  private drawnIdle = false;
  private frame = 0;

  constructor(container: HTMLElement, config: AuroraConfig = AURORA_CONFIG) {
    this.renderer = new WebGLRenderer({ antialias: false, alpha: false, depth: false, stencil: false });
    this.lagTimes = [config.race.lagSlow, config.race.lagFast];
    this.maxGap = config.race.maxGap;
    this.merge = config.merge;

    const canvas = this.renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100vh;height:100lvh;z-index:-1;pointer-events:none;display:block;";
    container.appendChild(canvas);

    // One triangle that overshoots the viewport: cheaper than a quad, with no diagonal seam.
    this.geometry.setAttribute("position", new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));

    // Reloading part-way down the page: race from where the page is, don't replay the whole scroll.
    const scroll = window.scrollY / canvas.clientHeight;

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      defines: { STRAND_COUNT: config.filaments.count },
      uniforms: {
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uScroll: { value: scroll },
        uScrollLag: { value: new Vector2(scroll, scroll) },
        uResolution: { value: new Vector2(1, 1) },
        uPointer: { value: new Vector2(0.5, 0.5) },
        uPixelRatio: { value: 1 },
        uBackground: { value: color(config.colors.background) },
        uCoreColor: { value: color(config.colors.core) },
        uHotColor: { value: color(config.colors.hot) },
        uHazeDeep: { value: color(config.colors.hazeDeep) },
        uHazeBright: { value: color(config.colors.hazeBright) },
        uOrigin: { value: new Vector2(config.origin.x, config.origin.y) },
        uOriginGlow: { value: config.origin.glow },
        uLanding: { value: config.path.landing },
        uCurve: { value: config.path.curve },
        uWobble: { value: config.path.wobble },
        uRaceDuration: { value: config.race.duration },
        uRaceStagger: { value: config.race.stagger },
        uGlow: { value: config.filaments.glow },
        uLineWidth: { value: 1 },
        uLineBrightness: { value: 1 },
        uMergeA: { value: new Vector2(0, 1e5) },
        uMergeB: { value: new Vector2(0, -1) },
        uFlare: { value: new Vector2(0, 0) },
        uMergeLength: { value: config.merge.length },
        uReturnLength: { value: config.merge.returnLength },
        uReturnEvery: { value: config.merge.returnEvery },
        uSpeed: { value: config.speed },
        uIntensity: { value: config.intensity },
        uHaze: { value: config.haze },
        uQuietHaze: { value: config.quietHaze },
        uVignette: { value: new Vector2(config.vignette.edge, config.vignette.left) },
        uDotGrid: { value: new Vector2(config.dotGrid.spacing, config.dotGrid.opacity) },
        uGrain: { value: config.grain },
        ...createStrands(config),
      },
    });

    const mesh = new Mesh(this.geometry, this.material);
    mesh.frustumCulled = false;
    this.scene.add(mesh);

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio, config.maxPixelRatio);
      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      this.renderer.getDrawingBufferSize(this.material.uniforms.uResolution.value);
      const { uniforms } = this.material;
      uniforms.uPixelRatio.value = pixelRatio;

      const phone = canvas.clientWidth < config.phone.maxWidth;
      uniforms.uLineWidth.value = phone ? config.phone.lineWidth : 1;
      uniforms.uLineBrightness.value = phone ? config.phone.brightness : 1;
      uniforms.uGlow.value = config.filaments.glow * (phone ? config.phone.glow : 1);
      uniforms.uHaze.value = config.haze * (phone ? config.phone.haze : 1);
      uniforms.uOriginGlow.value = config.origin.glow * (phone ? config.phone.originGlow : 1);
      this.flareScale = config.merge.flare * (phone ? config.phone.originGlow : 1);

      this.lastMeasure = -Infinity;
      this.update();
      this.draw(); // Resizing clears the buffer: redraw now so there's no black frame.
    };
    this.resizeObserver = new ResizeObserver(resize);
    this.resizeObserver.observe(canvas);
    resize();

    this.frame = requestAnimationFrame(this.tick);
  }

  private readonly tick = () => {
    const strandsInView = this.update();
    // Off the strands, every frame is identical: draw one and let the GPU rest, which also makes the
    // glass cards in the quiet sections much cheaper to blur.
    if (strandsInView || !this.drawnIdle) this.draw();
    this.drawnIdle = !strandsInView;
    this.frame = requestAnimationFrame(this.tick);
  };

  /** Finds the merge points on the page. Not every frame: they only move when the layout changes. */
  private measure(now: number) {
    if (now - this.lastMeasure < 0.25) return;
    this.lastMeasure = now;

    const height = this.renderer.domElement.clientHeight;
    const locate = (name: string) => {
      for (const element of document.querySelectorAll(`[data-aurora-merge="${name}"]`)) {
        // No box means a page Next is keeping hidden, not the one on screen.
        const box = element.getClientRects()[0];
        if (box) return { x: (box.left + box.width / 2) / height, y: (box.top + window.scrollY) / height };
      }
    };
    const primary = locate("primary");
    const final = locate("final");
    const a = primary ?? final ?? { x: 0, y: 1e5 };
    const b = primary && final ? final : { x: 0, y: -1 };

    const { uMergeA, uMergeB } = this.material.uniforms;
    uMergeA.value.set(a.x, a.y);
    uMergeB.value.set(b.x, b.y);
  }

  /** Moves everything on by a frame. Returns whether any strands or flares are in view. */
  private update() {
    const { uTime, uIntro, uScroll, uScrollLag, uMergeA, uMergeB, uFlare } = this.material.uniforms;
    const now = performance.now() / 1000;
    // Counted from the first drawn frame, so a page opened in a background tab still gets its race.
    this.startTime ??= now;
    const delta = now - (this.lastTime || now);
    this.lastTime = now;

    uTime.value = now - this.startTime;
    uIntro.value = uTime.value;

    // The view tracks the page exactly. The strand heads chase it at two speeds, which is the race.
    uScroll.value = window.scrollY / this.renderer.domElement.clientHeight;
    uScrollLag.value.x += (uScroll.value - uScrollLag.value.x) * (1 - Math.exp(-delta / this.lagTimes[0]));
    uScrollLag.value.y += (uScroll.value - uScrollLag.value.y) * (1 - Math.exp(-delta / this.lagTimes[1]));
    uScrollLag.value.x = Math.max(uScrollLag.value.x, uScroll.value - this.maxGap);
    uScrollLag.value.y = Math.max(uScrollLag.value.y, uScroll.value - this.maxGap);

    this.measure(now);

    // Each flare builds as its point rises up the screen, and is gone by the time it has scrolled off.
    const flare = (y: number) => {
      const fromTop = y - uScroll.value;
      return smoothstep(1.05, 0.55, fromTop) * smoothstep(-0.35, -0.05, fromTop) * this.flareScale;
    };
    uFlare.value.set(flare(uMergeA.value.y), flare(uMergeB.value.y));

    const inFirstStretch = uScroll.value < uMergeA.value.y + 0.4;
    const inReturn =
      uMergeB.value.y > 0 && uScroll.value + 1 > uMergeB.value.y - this.merge.returnLength && uScroll.value < uMergeB.value.y + 0.4;
    return inFirstStretch || inReturn;
  }

  private draw() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
