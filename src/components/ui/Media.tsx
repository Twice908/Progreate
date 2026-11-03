import type { CSSProperties } from "react";

/**
 * Neutral placeholder for template photos/videos.
 * Pass `src` to render a real asset instead — nothing else needs to change.
 */
export default function Media({
  kind = "portrait",
  hue = 24,
  src,
  alt = "",
  className = "",
  style,
}: {
  kind?: "portrait" | "scene" | "avatar";
  hue?: number;
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`object-cover ${className}`} style={style} loading="lazy" />;
  }

  const bg = `radial-gradient(120% 80% at 50% 8%, hsl(${hue} 38% 30% / .85) 0%, transparent 60%), linear-gradient(165deg, hsl(${hue} 28% 17%) 0%, hsl(${(hue + 18) % 360} 30% 7%) 100%)`;

  return (
    <div role="img" aria-label={alt || "Placeholder media"} className={`relative overflow-hidden ${className}`} style={{ background: bg, ...style }}>
      {kind === "portrait" && (
        <svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden>
          <circle cx="50" cy="62" r="17" fill={`hsl(${hue} 22% 38%)`} opacity=".55" />
          <path d="M8 170c0-34 18-58 42-58s42 24 42 58H8Z" fill={`hsl(${hue} 22% 34%)`} opacity=".5" />
        </svg>
      )}
      {kind === "scene" && (
        <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
          <rect x="0" y="48" width="100" height="22" fill={`hsl(${hue} 25% 10%)`} opacity=".7" />
          <circle cx="68" cy="22" r="8" fill={`hsl(${hue} 60% 55%)`} opacity=".25" />
          <path d="M0 52 28 30l18 16 14-10 40 24v10H0V52Z" fill={`hsl(${hue} 22% 20%)`} opacity=".8" />
        </svg>
      )}
      {kind === "avatar" && (
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full" aria-hidden>
          <circle cx="20" cy="15" r="7" fill={`hsl(${hue} 22% 46%)`} opacity=".8" />
          <path d="M5 40c0-9 7-15 15-15s15 6 15 15H5Z" fill={`hsl(${hue} 22% 40%)`} opacity=".8" />
        </svg>
      )}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(0_0_0/0.35)_100%)]" />
    </div>
  );
}
