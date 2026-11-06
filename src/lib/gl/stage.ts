import {
  AddEquation,
  BufferGeometry,
  BufferAttribute,
  Camera,
  CanvasTexture,
  ClampToEdgeWrapping,
  ColorManagement,
  CustomBlending,
  DataTexture,
  DoubleSide,
  FloatType,
  GLSL3,
  HalfFloatType,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  NearestFilter,
  NoBlending,
  OneFactor,
  RawShaderMaterial,
  RGBAFormat,
  Scene,
  UnsignedByteType,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { buildColony, type Colony } from "./colony";
import { COMPOSITE_FRAG, FIELD_FRAG, FIELD_VERT, FULLSCREEN_VERT } from "./shaders";
import type { Medium } from "@/lib/mediums";

ColorManagement.enabled = false;

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Everything the choreography drives each frame. Plain numbers, so they are easy to compute. */
export type StageState = {
  gen: number;
  r0: number;
  cx: number;
  cy: number;
  wordMix: number;
  zoom: number;
  fx: number;
  fy: number;
  flat: number;
  opacity: number;
  warp: number;
  velX: number;
  velY: number;
  plateOn: number;
  beadX: number;
  beadY: number;
  beadR: number;
  pointerX: number;
  pointerY: number;
  pointerR: number;
  push: number;
};

type PlateSource = { el: HTMLElement; texture: CanvasTexture | null; w: number; h: number };

const PALETTE_KEYS = ["cBody", "cEdge", "cInk", "cNuc", "cNucCore", "cShadow"] as const;

export type StageOptions = {
  canvas: HTMLCanvasElement;
  gens: number;
  dprCap: number;
  word: string;
  family: string;
  initial: Medium;
};

export class Stage {
  readonly canvas: HTMLCanvasElement;
  readonly state: StageState;
  W = 1;
  H = 1;
  portrait = false;
  colony!: Colony;

  private renderer: WebGLRenderer;
  private camera = new Camera();
  private fieldScene = new Scene();
  private compScene = new Scene();
  private field!: WebGLRenderTarget;
  private fieldMat: RawShaderMaterial;
  private compMat: RawShaderMaterial;
  private geo: InstancedBufferGeometry;
  private treeTex: DataTexture | null = null;
  private blank: DataTexture;

  private gens: number;
  private word: string;
  private family: string;

  private pixelRatio: number;
  private dprScale = 1;
  private frameTimes = 0;
  private frameCount = 0;

  private paletteNow: Record<string, [number, number, number]> = {};
  private paletteTo: Record<string, [number, number, number]> = {};
  private sheenNow = 0;
  private sheenTo = 0;

  private plates = new Map<string, PlateSource>();
  private activePlate: PlateSource | null = null;

  constructor(opts: StageOptions) {
    const { canvas, gens, dprCap, word, family, initial } = opts;
    this.canvas = canvas;
    this.gens = gens;
    this.word = word;
    this.family = family;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, dprCap);

    this.state = {
      gen: 0,
      r0: 0,
      cx: 0,
      cy: 0,
      wordMix: 0,
      zoom: 1,
      fx: 0,
      fy: 0,
      flat: 0,
      opacity: 1,
      warp: 7,
      velX: 0,
      velY: 0,
      plateOn: 0,
      beadX: -999,
      beadY: -999,
      beadR: 0,
      pointerX: 0,
      pointerY: 0,
      pointerR: 0,
      push: 0,
    };

    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000, 0);

    this.renderer.sortObjects = false;
    this.assertFloatTargets();

    // A 1x1 stand-in so the sampler is always valid before a plate exists.
    this.blank = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, RGBAFormat, UnsignedByteType);
    this.blank.needsUpdate = true;

    // --- Field pass: instanced quads, additive ------------------------------------------------
    this.geo = new InstancedBufferGeometry();
    this.geo.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), 2),
    );
    this.geo.setIndex([0, 1, 2, 0, 2, 3]);
    const maxInstances = (1 << gens) + 1;
    const index = new Float32Array(maxInstances);
    for (let i = 0; i < maxInstances; i++) index[i] = i;
    this.geo.setAttribute("aIndex", new InstancedBufferAttribute(index, 1));
    this.geo.instanceCount = 2;

    this.fieldMat = new RawShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: FIELD_VERT,
      fragmentShader: FIELD_FRAG,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneFactor,
      uniforms: {
        uTree: { value: this.blank },
        uTreeW: { value: 256 },
        uGen: { value: 0 },
        uTime: { value: 0 },
        uR0: { value: 100 },
        uRes: { value: new Vector2(1, 1) },
        uCenter: { value: new Vector2() },
        uWordMix: { value: 0 },
        uZoom: { value: 1 },
        uFocus: { value: new Vector2() },
        uPointer: { value: new Vector3() },
        uPush: { value: 0 },
        uBead: { value: new Vector3() },
        uVel: { value: new Vector2() },
        uPortrait: { value: 0 },
      },
    });
    const cells = new Mesh(this.geo, this.fieldMat);
    cells.frustumCulled = false;
    this.fieldScene.add(cells);

    // --- Composite pass: one big triangle -----------------------------------------------------
    const tri = new BufferGeometry();
    tri.setAttribute("position", new BufferAttribute(new Float32Array([-1, -1, 3, -1, -1, 3]), 2));
    this.compMat = new RawShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: FULLSCREEN_VERT,
      fragmentShader: COMPOSITE_FRAG,
      depthTest: false,
      depthWrite: false,
      blending: NoBlending,
      uniforms: {
        tField: { value: null },
        tPlate: { value: this.blank },
        uRes: { value: new Vector2(1, 1) },
        uPlateRect: { value: new Vector4(0, 0, 1, 1) },
        uPlateOn: { value: 0 },
        uTime: { value: 0 },
        uWarp: { value: 7 },
        uFlat: { value: 0 },
        uOpacity: { value: 1 },
        uIris: { value: 0 },
        uCellR: { value: 100 },
        cBody: { value: new Vector3() },
        cEdge: { value: new Vector3() },
        cInk: { value: new Vector3() },
        cNuc: { value: new Vector3() },
        cNucCore: { value: new Vector3() },
        cShadow: { value: new Vector3() },
      },
    });
    const comp = new Mesh(tri, this.compMat);
    comp.frustumCulled = false;
    this.compScene.add(comp);

    this.setPalette(initial, true);
    this.resize(true);
  }

  /** The field needs signed, additive floats. Without them the page falls back to its CSS cell. */
  private assertFloatTargets() {
    const probe = new WebGLRenderTarget(4, 4, {
      type: HalfFloatType,
      format: RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.renderer.setRenderTarget(probe);
    const gl = this.renderer.getContext();
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    this.renderer.setRenderTarget(null);
    probe.dispose();
    if (!ok) throw new Error("Float render targets unavailable");
  }

  setPalette(m: Medium, instant = false) {
    const map: Record<(typeof PALETTE_KEYS)[number], string> = {
      cBody: m.cell,
      cEdge: m.cellEdge,
      cInk: m.cellInk,
      cNuc: m.nucleus,
      cNucCore: m.nucleusCore,
      cShadow: m.shadow,
    };
    for (const key of PALETTE_KEYS) {
      const rgb = hexToRgb(map[key]);
      this.paletteTo[key] = rgb;
      if (instant || !this.paletteNow[key]) this.paletteNow[key] = [...rgb];
    }
    this.sheenTo = m.sheen;
    if (instant) this.sheenNow = m.sheen;
  }

  /** Register an element whose type should be seen through the cells. */
  addPlate(name: string, el: HTMLElement) {
    this.plates.set(name, { el, texture: null, w: 0, h: 0 });
    this.rasterizePlate(name);
  }

  usePlate(name: string | null) {
    this.activePlate = name ? this.plates.get(name) ?? null : null;
  }

  /** Redraw an element's type into a texture, in the element's own coordinates. */
  rasterizePlate(name: string) {
    const plate = this.plates.get(name);
    if (!plate) return;
    const rootRect = plate.el.getBoundingClientRect();
    if (rootRect.width < 1 || rootRect.height < 1) return;

    const pad = 0;
    // The type gets magnified inside the cell, so it needs more resolution than the screen has.
    const scale = Math.min(2, 4096 / rootRect.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil((rootRect.width + pad * 2) * scale);
    canvas.height = Math.ceil((rootRect.height + pad * 2) * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";

    plate.el.querySelectorAll<HTMLElement>("[data-ink]").forEach((node) => {
      const cs = getComputedStyle(node);
      const size = parseFloat(cs.fontSize);
      const lineHeight = parseFloat(cs.lineHeight) || size;
      ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
      if ("letterSpacing" in ctx) {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
      }
      const metrics = ctx.measureText("Hg");
      const ascent = metrics.fontBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent;
      const rect = node.getBoundingClientRect();
      const baseline = rect.top - rootRect.top + (lineHeight - (ascent + descent)) / 2 + ascent;
      ctx.fillText(node.textContent ?? "", rect.left - rootRect.left + pad, baseline + pad);
    });

    plate.texture?.dispose();
    const texture = new CanvasTexture(canvas);
    texture.flipY = false;
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    plate.texture = texture;
    plate.w = rootRect.width;
    plate.h = rootRect.height;
  }

  private buildTree() {
    this.colony = buildColony({
      W: this.W,
      H: this.H,
      gens: this.gens,
      family: this.family,
      word: this.word,
    });
    const { data, texW, texH } = this.colony;
    this.treeTex?.dispose();
    this.treeTex = new DataTexture(data, texW, texH, RGBAFormat, FloatType);
    this.treeTex.minFilter = NearestFilter;
    this.treeTex.magFilter = NearestFilter;
    this.treeTex.generateMipmaps = false;
    this.treeTex.needsUpdate = true;
    const u = this.fieldMat.uniforms;
    u.uTree.value = this.treeTex;
    u.uTreeW.value = texW;
  }

  /** Re-read the viewport. `force` also rebuilds the colony for the new shape. */
  resize(force = false) {
    const W = window.innerWidth;
    const lvh = document.querySelector<HTMLElement>("[data-lvh]")?.offsetHeight;
    const H = lvh || window.innerHeight;
    const shapeChanged = W !== this.W || H !== this.H;
    if (!shapeChanged && !force) return;
    this.W = W;
    this.H = H;
    this.portrait = H > W * 1.05;

    const dpr = this.pixelRatio * this.dprScale;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(W, H, false);

    const fieldScale = Math.max(0.6, Math.min(1, dpr * 0.5));
    const fw = Math.max(2, Math.round(W * fieldScale));
    const fh = Math.max(2, Math.round(H * fieldScale));
    if (!this.field) {
      this.field = new WebGLRenderTarget(fw, fh, {
        type: HalfFloatType,
        format: RGBAFormat,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      });
    } else {
      this.field.setSize(fw, fh);
    }

    const cu = this.compMat.uniforms;
    cu.tField.value = this.field.texture;
    (cu.uRes.value as Vector2).set(W, H);
    (this.fieldMat.uniforms.uRes.value as Vector2).set(W, H);
    this.fieldMat.uniforms.uPortrait.value = this.portrait ? 1 : 0;

    this.buildTree();
    for (const name of this.plates.keys()) this.rasterizePlate(name);
  }

  /** Fonts arriving or a major layout change: redraw every derived texture. */
  refresh() {
    this.buildTree();
    for (const name of this.plates.keys()) this.rasterizePlate(name);
  }

  frame(time: number, dtMs: number) {
    const s = this.state;
    const fu = this.fieldMat.uniforms;
    const cu = this.compMat.uniforms;

    // Colours ease on their own so a change of medium washes through the cells.
    const k = 1 - Math.pow(0.002, dtMs / 900);
    for (const key of PALETTE_KEYS) {
      const now = this.paletteNow[key];
      const to = this.paletteTo[key];
      for (let i = 0; i < 3; i++) now[i] += (to[i] - now[i]) * k;
      (cu[key].value as Vector3).set(now[0], now[1], now[2]);
    }
    this.sheenNow += (this.sheenTo - this.sheenNow) * k;

    const C = Math.ceil(Math.max(0, s.gen));
    const clampedGen = Math.min(s.gen, this.gens);
    this.geo.instanceCount = (1 << Math.min(C, this.gens)) + 1;

    fu.uGen.value = clampedGen;
    fu.uTime.value = time;
    fu.uR0.value = s.r0;
    (fu.uCenter.value as Vector2).set(s.cx, s.cy);
    fu.uWordMix.value = s.wordMix;
    fu.uZoom.value = s.zoom;
    (fu.uFocus.value as Vector2).set(s.fx, s.fy);
    (fu.uPointer.value as Vector3).set(s.pointerX, s.pointerY, s.pointerR);
    fu.uPush.value = s.push;
    (fu.uBead.value as Vector3).set(s.beadX, s.beadY, s.beadR);
    (fu.uVel.value as Vector2).set(s.velX, s.velY);

    cu.uTime.value = time;
    cu.uWarp.value = s.warp;
    cu.uFlat.value = s.flat;
    cu.uOpacity.value = s.opacity;
    cu.uIris.value = this.sheenNow;
    // Every cell in a generation has about the same radius, so one number describes them all.
    cu.uCellR.value = s.r0 * Math.pow(2, -0.5 * Math.max(clampedGen, 0)) * s.zoom;

    const plate = this.activePlate;
    if (plate?.texture && s.plateOn > 0.001) {
      const r = plate.el.getBoundingClientRect();
      (cu.uPlateRect.value as Vector4).set(r.left, r.top, plate.w || r.width, plate.h || r.height);
      cu.tPlate.value = plate.texture;
      cu.uPlateOn.value = s.plateOn;
    } else {
      cu.uPlateOn.value = 0;
    }

    const renderer = this.renderer;
    renderer.setRenderTarget(this.field);
    renderer.clear();
    renderer.render(this.fieldScene, this.camera);
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(this.compScene, this.camera);

    this.govern(dtMs);
  }

  /** Clear the canvas so an idle stage costs nothing and shows nothing. */
  blank_() {
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
  }

  /** If frames stay slow, trade pixels for smoothness. Never trades back, to avoid oscillating. */
  private govern(dtMs: number) {
    if (dtMs <= 0 || dtMs > 250) return;
    this.frameTimes += dtMs;
    this.frameCount += 1;
    if (this.frameCount < 45) return;
    const avg = this.frameTimes / this.frameCount;
    this.frameTimes = 0;
    this.frameCount = 0;
    if (avg > 24 && this.dprScale > 0.5) {
      this.dprScale = Math.max(0.5, this.dprScale * 0.8);
      const dpr = this.pixelRatio * this.dprScale;
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(this.W, this.H, false);
    }
  }

  dispose() {
    this.field?.dispose();
    this.treeTex?.dispose();
    this.blank.dispose();
    for (const plate of this.plates.values()) plate.texture?.dispose();
    this.geo.dispose();
    this.fieldMat.dispose();
    this.compMat.dispose();
    this.renderer.dispose();
  }
}
