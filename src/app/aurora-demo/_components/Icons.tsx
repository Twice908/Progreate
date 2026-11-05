import type { SVGProps } from "react";
import type { PlatformKey } from "@/components/ui/Icons";

export * from "@/components/ui/Icons";

type P = SVGProps<SVGSVGElement>;

// Lime versions of the live icons that are orange. Local exports win over the `export *` above.

export function Sparkle(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#c8ff2e" d="m12 2 1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2Z" />
      <path fill="#a4dc14" d="m18.5 14 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" />
      <path fill="#efffb0" d="m5.5 15 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
    </svg>
  );
}

export function CheckBadge(props: P) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden {...props}>
      <circle cx="8" cy="8" r="8" fill="#c8ff2e" />
      <path d="m4.6 8.3 2.3 2.3 4.5-4.7" fill="none" stroke="#0a0f03" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Star(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#c8ff2e" d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
    </svg>
  );
}

/** Glass-style 3D platform marks used on the service cards. */
export function GlassPlatform({ platform, className = "" }: { platform: PlatformKey; className?: string }) {
  // Prefixed: the live site's copy keeps its ids in the DOM while its page is hidden by Activity.
  const id = `aurora-gp-${platform}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efffb0" />
          <stop offset=".45" stopColor="#26380c" />
          <stop offset="1" stopColor="#c8ff2e" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2610" />
          <stop offset="1" stopColor="#060a04" />
        </linearGradient>
        <radialGradient id={`${id}-play`} cx=".5" cy=".4" r=".7">
          <stop offset="0" stopColor="#e0ff7a" />
          <stop offset="1" stopColor="#a4dc14" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <ellipse cx="100" cy="180" rx="62" ry="9" fill="#c8ff2e" opacity=".25" filter={`url(#${id}-glow)`} />
      {platform === "shorts" && (
        <g>
          <path d="M100 18c18-9 40-2 50 15l3 5c9 17 3 38-14 48l-6 3 11 1c19 2 33 18 32 37-1 13-9 24-21 30l-62 33c-18 9-40 3-50-14l-3-6c-9-17-3-38 14-48l6-3-11-1c-19-2-33-18-32-37 1-13 9-24 21-30l62-33Z" fill={`url(#${id}-body)`} stroke={`url(#${id}-rim)`} strokeWidth="5" transform="scale(.82) translate(22 20)" />
          <path d="m82 78 46 28-46 28V78Z" fill={`url(#${id}-play)`} />
        </g>
      )}
      {platform === "reels" && (
        <g>
          <rect x="34" y="34" width="132" height="132" rx="38" fill={`url(#${id}-body)`} stroke={`url(#${id}-rim)`} strokeWidth="5" />
          <path d="M36 74h128M80 36l24 38M124 36l24 38" stroke={`url(#${id}-rim)`} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="m88 96 40 24-40 24V96Z" fill="#0f1a06" stroke="#efffb0" strokeOpacity=".5" strokeWidth="3" strokeLinejoin="round" />
        </g>
      )}
      {platform === "tiktok" && (
        <g transform="translate(22 14) scale(.78)">
          <path d="M118 18c4 22 18 36 40 38v32c-14 0-28-4-40-12v62c0 32-26 58-58 58S2 170 2 138s26-58 58-58c3 0 6 0 10 1v34c-3-1-6-2-10-2-13 0-24 11-24 25s11 25 24 25 25-11 25-25V18h33Z" fill={`url(#${id}-body)`} stroke={`url(#${id}-rim)`} strokeWidth="6" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}
