"use client";

import { useEffect } from "react";

/**
 * Every section is plain server-rendered HTML. This is the only thing that wakes the page up, and it
 * loads the motion code after hydration so type and layout paint first.
 */
export default function Experience() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let dead = false;
    import("@/lib/motion/boot")
      .then(({ boot }) => {
        if (!dead) stop = boot();
      })
      .catch(() => {
        const html = document.documentElement;
        html.classList.remove("booting");
        html.classList.add("booted", "no-gl");
      });
    return () => {
      dead = true;
      stop?.();
    };
  }, []);

  return null;
}
