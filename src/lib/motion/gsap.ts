import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// The phone URL bar collapsing must not recalculate every trigger on the page.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, CustomEase, ScrollTrigger, SplitText };

export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 at or below a, 1 at or above b. */
export const range = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
