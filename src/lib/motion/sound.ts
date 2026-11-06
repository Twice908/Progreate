/**
 * Synthesised sound, off by default. There are no audio files: a division is a short pitched "pop"
 * built from an oscillator, and it climbs with the generation.
 */
export type SoundControl = {
  pop: (generation: number) => void;
  tick: (generation: number) => void;
  dispose: () => void;
};

export function createSound(button: HTMLButtonElement | null): SoundControl {
  let ctx: AudioContext | null = null;
  let on = false;

  const toggle = () => {
    on = !on;
    button?.setAttribute("aria-pressed", String(on));
    if (on) {
      ctx ??= new AudioContext();
      void ctx.resume();
      blip(320, 110, 0.14, 0.09);
    }
  };
  button?.addEventListener("click", toggle);

  function blip(fromHz: number, toHz: number, duration: number, gain: number) {
    if (!on || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(fromHz, t);
    osc.frequency.exponentialRampToValueAtTime(toHz, t + duration);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  return {
    pop: (generation) => blip(240 + generation * 60, 90 + generation * 18, 0.2, 0.12),
    tick: (generation) => blip(180 * Math.pow(2, generation / 12), 90 * Math.pow(2, generation / 12), 0.09, 0.07),
    dispose() {
      button?.removeEventListener("click", toggle);
      void ctx?.close();
      ctx = null;
    },
  };
}
