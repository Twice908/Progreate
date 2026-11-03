/**
 * Deterministic starfield (seeded PRNG — safe for SSR/prerender, no hydration mismatch).
 * Mix of tiny dots and thin four-point "plus" sparkles, like the template's particle layer.
 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Stars({
  count = 50,
  seed = 7,
  className = "",
  fadeBottom = false,
}: {
  count?: number;
  seed?: number;
  className?: string;
  fadeBottom?: boolean;
}) {
  const rand = mulberry32(seed);
  const stars = Array.from({ length: count }, () => {
    const plus = rand() > 0.82;
    return {
      x: rand() * 100,
      y: rand() * 100,
      size: plus ? 7 + rand() * 6 : 1 + rand() * 1.6,
      min: 0.15 + rand() * 0.25,
      max: 0.55 + rand() * 0.45,
      delay: rand() * 4,
      dur: 3 + rand() * 4,
      plus,
    };
  });

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={fadeBottom ? { maskImage: "linear-gradient(180deg, #000 55%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, #000 55%, transparent 100%)" } : undefined}
    >
      {stars.map((s, i) =>
        s.plus ? (
          <span
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              ["--star-min" as string]: s.min,
              ["--star-max" as string]: s.max,
            }}
          >
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/80" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/80" />
          </span>
        ) : (
          <span
            key={i}
            className="absolute animate-twinkle rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              ["--star-min" as string]: s.min,
              ["--star-max" as string]: s.max,
            }}
          />
        ),
      )}
    </div>
  );
}
