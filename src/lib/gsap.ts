import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

declare global {
  interface Window {
    /** Set once GSAP-driven motion has taken over (disarms the layout.tsx failsafe). */
    __motionReady?: boolean;
    /** Set by the failsafe when hydration was too late; motion code should stay out of the way. */
    __motionSkipped?: boolean;
    __motionTimer?: number;
  }
}

/**
 * Call at the start of any motion setup. Returns false when the failsafe already revealed the page
 * (so we must not re-hide content to animate it); otherwise claims motion and disarms the failsafe.
 */
export function claimMotion(): boolean {
  if (typeof window === "undefined" || window.__motionSkipped) return false;
  window.__motionReady = true;
  return true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
