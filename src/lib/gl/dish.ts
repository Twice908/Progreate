import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  ClampToEdgeWrapping,
  ColorManagement,
  GLSL3,
  HalfFloatType,
  LinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  NoBlending,
  RawShaderMaterial,
  RGBAFormat,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { DISH_FRAG, FULLSCREEN_VERT, SEED_FRAG, SIM_FRAG } from "./shaders";
import { hexToRgb } from "./stage";

ColorManagement.enabled = false;

export type Strain = {
  feed: number;
  kill: number;
  agar: string;
  colony: string;
  colonyEdge: string;
  shadow: string;
};

export type DishOptions = {
  canvas: HTMLCanvasElement;
  simSize: number;
  stepsPerFrame: number;
  dprCap: number;
};

/**
 * A petri dish running Gray-Scott reaction-diffusion on the GPU. Swapping strains changes the
 * chemistry, and the new growth form spreads out from the centre of the dish through what is
 * already there, so the portfolio morphs instead of cutting between images.
 */
export class Dish {
  readonly canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private camera = new Camera();
  private simScene = new Scene();
  private dishScene = new Scene();
  private seedScene = new Scene();
  private simMat: RawShaderMaterial;
  private dishMat: RawShaderMaterial;
  private seedMat: RawShaderMaterial;
  private a: WebGLRenderTarget;
  private b: WebGLRenderTarget;
  private simSize: number;
  private stepsPerFrame: number;
  private dprCap: number;
  private front = 2;
  private frontSpeed = 0.6;
  private feedPoint: [number, number] | null = null;
  private feedDecay = 0;
  private dprScale = 1;
  private frameTimes = 0;
  private frameCount = 0;
  private cx = 0;
  private cy = 0;
  private radius = 0;
  W = 1;
  H = 1;

  constructor(opts: DishOptions) {
    const { canvas, simSize, stepsPerFrame, dprCap } = opts;
    this.canvas = canvas;
    this.simSize = simSize;
    this.stepsPerFrame = stepsPerFrame;
    this.dprCap = dprCap;

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
    this.renderer.sortObjects = false;
    this.renderer.setClearColor(0x000000, 0);

    const makeTarget = () =>
      new WebGLRenderTarget(simSize, simSize, {
        type: HalfFloatType,
        format: RGBAFormat,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        wrapS: ClampToEdgeWrapping,
        wrapT: ClampToEdgeWrapping,
        depthBuffer: false,
        stencilBuffer: false,
      });
    this.a = makeTarget();
    this.b = makeTarget();

    // Reaction-diffusion needs float precision; there is no acceptable 8-bit version of this.
    this.renderer.setRenderTarget(this.a);
    const gl = this.renderer.getContext();
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      this.renderer.setRenderTarget(null);
      throw new Error("Float render targets unavailable");
    }
    this.renderer.setRenderTarget(null);

    const tri = new BufferGeometry();
    tri.setAttribute("position", new BufferAttribute(new Float32Array([-1, -1, 3, -1, -1, 3]), 2));
    const base = {
      glslVersion: GLSL3,
      vertexShader: FULLSCREEN_VERT,
      depthTest: false,
      depthWrite: false,
      blending: NoBlending,
    } as const;

    this.simMat = new RawShaderMaterial({
      ...base,
      fragmentShader: SIM_FRAG,
      uniforms: {
        tState: { value: null },
        uTexel: { value: new Vector2(1 / simSize, 1 / simSize) },
        uFkFrom: { value: new Vector2(0.0545, 0.062) },
        uFkTo: { value: new Vector2(0.0545, 0.062) },
        uFront: { value: 2 },
        uSeed: { value: new Vector3() },
        // Colonies per dish width: scaled so the natural spacing of the pattern stays the same.
        uGrid: { value: simSize / 21 },
      },
    });
    this.seedMat = new RawShaderMaterial({ ...base, fragmentShader: SEED_FRAG });
    this.dishMat = new RawShaderMaterial({
      ...base,
      fragmentShader: DISH_FRAG,
      uniforms: {
        tState: { value: null },
        uRes: { value: new Vector2(1, 1) },
        uCenter: { value: new Vector2() },
        uRadius: { value: 1 },
        uSimTexel: { value: new Vector2(1.5 / simSize, 1.5 / simSize) },
        uFront: { value: 2 },
        uTime: { value: 0 },
        uDpr: { value: 1 },
        cAgarFrom: { value: new Vector3() },
        cAgarTo: { value: new Vector3() },
        cColFrom: { value: new Vector3() },
        cColTo: { value: new Vector3() },
        cEdgeFrom: { value: new Vector3() },
        cEdgeTo: { value: new Vector3() },
        cShadow: { value: new Vector3() },
      },
    });

    const addTri = (scene: Scene, mat: RawShaderMaterial) => {
      const mesh = new Mesh(tri, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);
    };
    addTri(this.simScene, this.simMat);
    addTri(this.seedScene, this.seedMat);
    addTri(this.dishScene, this.dishMat);

    this.renderer.setRenderTarget(this.a);
    this.renderer.render(this.seedScene, this.camera);
    this.renderer.setRenderTarget(null);

    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.W = Math.max(1, rect.width);
    this.H = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, this.dprCap) * this.dprScale;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.W, this.H, false);
    const u = this.dishMat.uniforms;
    (u.uRes.value as Vector2).set(this.W, this.H);
    u.uDpr.value = 1;
  }

  /** Place the dish, in CSS px relative to the canvas. */
  place(cx: number, cy: number, radius: number) {
    this.cx = cx;
    this.cy = cy;
    this.radius = Math.max(1, radius);
  }

  setStrain(strain: Strain, instant = false) {
    const su = this.simMat.uniforms;
    const du = this.dishMat.uniforms;
    const toVec = (hex: string) => {
      const [r, g, b] = hexToRgb(hex);
      return new Vector3(r, g, b);
    };

    // Whatever was arriving is now the base the next strain spreads over.
    (su.uFkFrom.value as Vector2).copy(su.uFkTo.value as Vector2);
    (du.cAgarFrom.value as Vector3).copy(du.cAgarTo.value as Vector3);
    (du.cColFrom.value as Vector3).copy(du.cColTo.value as Vector3);
    (du.cEdgeFrom.value as Vector3).copy(du.cEdgeTo.value as Vector3);

    (su.uFkTo.value as Vector2).set(strain.feed, strain.kill);
    (du.cAgarTo.value as Vector3).copy(toVec(strain.agar));
    (du.cColTo.value as Vector3).copy(toVec(strain.colony));
    (du.cEdgeTo.value as Vector3).copy(toVec(strain.colonyEdge));
    (du.cShadow.value as Vector3).copy(toVec(strain.shadow));

    if (instant) {
      (su.uFkFrom.value as Vector2).copy(su.uFkTo.value as Vector2);
      (du.cAgarFrom.value as Vector3).copy(du.cAgarTo.value as Vector3);
      (du.cColFrom.value as Vector3).copy(du.cColTo.value as Vector3);
      (du.cEdgeFrom.value as Vector3).copy(du.cEdgeTo.value as Vector3);
    }
    this.front = instant ? 2 : 0;
  }

  /** Send a growth front across the dish without changing strain. */
  sweep() {
    this.front = 0;
  }

  /** Feed the culture at a point given in client coordinates. Returns true if it landed in the dish. */
  feedAt(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const qx = (clientX - rect.left - this.cx) / this.radius;
    const qy = (clientY - rect.top - this.cy) / this.radius;
    if (qx * qx + qy * qy > 0.9) return false;
    this.feedPoint = [qx * 0.5 + 0.5, qy * 0.5 + 0.5];
    this.feedDecay = 4;
    return true;
  }

  private step() {
    this.simMat.uniforms.tState.value = this.a.texture;
    this.renderer.setRenderTarget(this.b);
    this.renderer.render(this.simScene, this.camera);
    const swap = this.a;
    this.a = this.b;
    this.b = swap;
  }

  /** Run the chemistry forward without drawing, so a dish is never empty when it first appears. */
  warm(steps: number) {
    for (let i = 0; i < steps; i++) this.step();
    this.renderer.setRenderTarget(null);
  }

  frame(time: number, dtMs: number) {
    const su = this.simMat.uniforms;
    const du = this.dishMat.uniforms;
    const dt = Math.min(dtMs, 50) / 1000;

    if (this.front < 2) this.front += dt * this.frontSpeed;
    su.uFront.value = this.front;
    du.uFront.value = this.front;

    const seed = su.uSeed.value as Vector3;
    if (this.feedPoint && this.feedDecay > 0) {
      seed.set(this.feedPoint[0], this.feedPoint[1], 0.024);
      this.feedDecay -= 1;
    } else {
      seed.set(0, 0, 0);
    }

    const steps = Math.max(1, Math.min(this.stepsPerFrame * 2, Math.round((this.stepsPerFrame * dtMs) / 16.67)));
    for (let i = 0; i < steps; i++) {
      this.step();
      if (i === 0) seed.set(0, 0, 0);
    }

    du.tState.value = this.a.texture;
    du.uTime.value = time;
    (du.uCenter.value as Vector2).set(this.cx, this.cy);
    du.uRadius.value = this.radius;

    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.dishScene, this.camera);

    this.govern(dtMs);
  }

  /** If frames stay slow, first let the culture grow more slowly, then trade away pixels. */
  private govern(dtMs: number) {
    if (dtMs <= 0 || dtMs > 250) return;
    this.frameTimes += dtMs;
    this.frameCount += 1;
    if (this.frameCount < 40) return;
    const average = this.frameTimes / this.frameCount;
    this.frameTimes = 0;
    this.frameCount = 0;
    if (average < 24) return;
    if (this.stepsPerFrame > 3) {
      this.stepsPerFrame = Math.max(3, Math.round(this.stepsPerFrame * 0.7));
    } else if (this.dprScale > 0.6) {
      this.dprScale = Math.max(0.6, this.dprScale * 0.8);
      this.resize();
    }
  }

  dispose() {
    this.a.dispose();
    this.b.dispose();
    this.simMat.dispose();
    this.dishMat.dispose();
    this.seedMat.dispose();
    this.renderer.dispose();
  }
}
