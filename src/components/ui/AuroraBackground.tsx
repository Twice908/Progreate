"use client";

import { useEffect, useRef } from "react";
import type { AuroraBackground as AuroraCore } from "@/lib/aurora";

/**
 * Thin React wrapper around the WebGL core in `lib/aurora.ts`. The core owns a fixed, full-viewport
 * canvas, so this takes no space in the layout. Three.js is loaded on mount to keep it off first load.
 */
export default function AuroraBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let aurora: AuroraCore | undefined;
    let unmounted = false;

    import("@/lib/aurora").then(({ AuroraBackground: Core }) => {
      if (!unmounted && hostRef.current) aurora = new Core(hostRef.current);
    });

    return () => {
      unmounted = true;
      aurora?.dispose();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="contents" />;
}
