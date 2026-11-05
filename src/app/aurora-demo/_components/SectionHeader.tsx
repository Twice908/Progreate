import type { ReactNode } from "react";

/** "— Label —" pill used above every section title. */
export function SectionBadge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      data-reveal
      className={`inline-flex rounded-full border border-white/10 bg-black/40 p-px backdrop-blur-md ${className}`}
    >
      <span className="flex items-center gap-2 rounded-full px-5 py-[11px] text-[16px] leading-[22px] tracking-[-0.02em] text-white/80">
        <span aria-hidden className="h-px w-2.5 bg-aurora" />
        {children}
        <span aria-hidden className="h-px w-2.5 bg-aurora" />
      </span>
    </span>
  );
}

/** Join title lines with <br/> so explicit breaks survive word-splitting. */
export function Lines({ lines }: { lines: string | string[] }) {
  const arr = Array.isArray(lines) ? lines : [lines];
  return (
    <>
      {arr.map((l, i) => (
        <span key={i}>
          {l}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  titleClass = "",
  descClass = "",
  children,
}: {
  badge: string;
  title: string | string[];
  description?: string;
  align?: "center" | "left";
  titleClass?: string;
  descClass?: string;
  children?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`flex flex-col gap-5 ${center ? "items-center text-center" : "items-start text-left"}`}>
      <SectionBadge>{badge}</SectionBadge>
      <h2 data-split className={`t-h2 text-balance ${titleClass}`}>
        <Lines lines={title} />
      </h2>
      {description && (
        <p data-reveal className={`t-lead text-pretty ${descClass}`}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
