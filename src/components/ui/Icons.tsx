import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** Brand mark: rounded block with a four-point sparkle cut-out and a dot. */
export function Logo(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M6.5 5h8.2c.5 0 .9.4.9.9v.5c0 1 .8 1.8 1.8 1.8h.5c.5 0 .9.4.9.9v8.4A3.5 3.5 0 0 1 15.3 21H6.5A3.5 3.5 0 0 1 3 17.5v-9A3.5 3.5 0 0 1 6.5 5Zm5.6 4.2-.9 2.3c-.2.5-.6.9-1.1 1.1l-2.3.9 2.3.9c.5.2.9.6 1.1 1.1l.9 2.3.9-2.3c.2-.5.6-.9 1.1-1.1l2.3-.9-2.3-.9c-.5-.2-.9-.6-1.1-1.1l-.9-2.3Z"
      />
      <circle cx="20.2" cy="3.8" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Arrow(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function Sparkle(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#ffc83d" d="m12 2 1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2Z" />
      <path fill="#ff8a3d" d="m18.5 14 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" />
      <path fill="#ffe28a" d="m5.5 15 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
    </svg>
  );
}

export function Eye(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function CheckBadge(props: P) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden {...props}>
      <circle cx="8" cy="8" r="8" fill="#c85a2c" />
      <path d="m4.6 8.3 2.3 2.3 4.5-4.7" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Verified(props: P) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden {...props}>
      <path fill="#3b82f6" d="M8 .8 9.7 2l2.1-.1.7 2 1.8 1.1-.6 2 .6 2-1.8 1.1-.7 2-2.1-.1L8 15.2 6.3 14l-2.1.1-.7-2-1.8-1.1.6-2-.6-2 1.8-1.1.7-2L6.3 2 8 .8Z" />
      <path d="m5.4 8.1 1.8 1.8 3.4-3.5" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Plus(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Minus(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function MenuIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function Mail(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 6 8-6" />
    </svg>
  );
}

export function Phone(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export function Star(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#fbbf24" d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
    </svg>
  );
}

export function TrendUp(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="m3 17 6-6 4 4 7-8" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

export function Play(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.9l10.6-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

export type PlatformKey = "shorts" | "reels" | "tiktok";

/** Small square platform badge used on video cards. */
export function PlatformBadge({ platform, className = "" }: { platform: PlatformKey; className?: string }) {
  if (platform === "shorts")
    return (
      <span className={`grid place-items-center rounded-lg bg-gradient-to-b from-[#ff6a3a] to-[#e3320d] shadow-[inset_0_-2px_2px_rgb(255_255_255/0.35)] ${className}`}>
        <svg viewBox="0 0 24 24" className="size-[58%]" aria-hidden>
          <path fill="#fff" d="M9.2 3.4c1.5-.8 3.4-.2 4.2 1.3l.2.4c.8 1.5.3 3.3-1.1 4.2l-.6.4 1.3.1c1.7.1 3 1.6 2.9 3.3-.1 1.2-.8 2.2-1.8 2.7l-6.4 3.4c-1.5.8-3.4.2-4.2-1.3s-.3-3.3 1.1-4.2l.6-.4-1.3-.1c-1.7-.1-3-1.6-2.9-3.3.1-1.2.8-2.2 1.8-2.7l6.4-3.4h-.2Z" opacity=".95" />
          <path fill="#e3320d" d="m10 9.4 4 2.6-4 2.6V9.4Z" />
        </svg>
      </span>
    );
  if (platform === "reels")
    return (
      <span className={`grid place-items-center rounded-lg bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] ${className}`}>
        <svg viewBox="0 0 24 24" className="size-[62%]" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <path d="M3.8 9h16.4M9 3.6l3 5.4M14.5 3.6l3 5.4" />
          <path fill="#fff" stroke="none" d="m10.5 12.2 4 2.3-4 2.3v-4.6Z" />
        </svg>
      </span>
    );
  return (
    <span className={`grid place-items-center rounded-lg bg-black ring-1 ring-white/15 ${className}`}>
      <svg viewBox="0 0 24 24" className="size-[62%]" aria-hidden>
        <path fill="#25f4ee" d="M16.6 5.4c-.7-.8-1.1-1.8-1.1-2.9h-2.9v12.1a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.2a5.4 5.4 0 1 0 4.6 5.4V9.1a6.9 6.9 0 0 0 4 1.3V7.5c-1 0-2-.4-2.9-2.1Z" transform="translate(-.8 -.6)" />
        <path fill="#fe2c55" d="M16.6 5.4c-.7-.8-1.1-1.8-1.1-2.9h-2.9v12.1a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.2a5.4 5.4 0 1 0 4.6 5.4V9.1a6.9 6.9 0 0 0 4 1.3V7.5c-1 0-2-.4-2.9-2.1Z" transform="translate(.8 .6)" />
        <path fill="#fff" d="M16.6 5.4c-.7-.8-1.1-1.8-1.1-2.9h-2.9v12.1a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.2a5.4 5.4 0 1 0 4.6 5.4V9.1a6.9 6.9 0 0 0 4 1.3V7.5c-1 0-2-.4-2.9-2.1Z" />
      </svg>
    </span>
  );
}

/** Glass-style 3D platform marks used on the service cards. */
export function GlassPlatform({ platform, className = "" }: { platform: PlatformKey; className?: string }) {
  const id = `gp-${platform}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb27a" />
          <stop offset=".45" stopColor="#3a2418" />
          <stop offset="1" stopColor="#ff6a1a" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1c14" />
          <stop offset="1" stopColor="#0c0705" />
        </linearGradient>
        <radialGradient id={`${id}-play`} cx=".5" cy=".4" r=".7">
          <stop offset="0" stopColor="#ff9a55" />
          <stop offset="1" stopColor="#e2501a" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <ellipse cx="100" cy="180" rx="62" ry="9" fill="#fa6114" opacity=".25" filter={`url(#${id}-glow)`} />
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
          <path d="m88 96 40 24-40 24V96Z" fill="#1b110c" stroke="#ffb27a" strokeOpacity=".5" strokeWidth="3" strokeLinejoin="round" />
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
