import type { Work } from "@/lib/data";
import Media from "@/components/ui/Media";
import { Eye, PlatformBadge, Verified } from "@/components/ui/Icons";

/** Small round "brand" avatar used next to usernames. */
export function Avatar({ className = "" }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-[#d3e9cb] ${className}`} aria-hidden>
      <svg viewBox="0 0 24 24" className="size-[58%]" fill="none" stroke="#2f5d3a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8c2-2 6-2 8 0M16 16c-2 2-6 2-8 0M7 12h10" />
      </svg>
    </span>
  );
}

export function Author({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[14px] leading-[19.6px] tracking-[-0.04em] text-white ${className}`}>
      <Avatar className="size-7" />
      {name}
      <Verified className="size-3.5" />
    </span>
  );
}

export function ViewsPill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 py-1 pl-2 pr-3 text-[14px] leading-[19.6px] tracking-[-0.04em] text-white/90 backdrop-blur-[6px]">
      <Eye className="size-4" />
      {children}
    </span>
  );
}

/** Tall vertical-video tile: platform + view count on top, story overlay at the bottom. */
export default function VideoCard({ work, hue, className = "" }: { work: Work; hue: number; className?: string }) {
  return (
    <article className={`group relative isolate aspect-[430/620] overflow-hidden rounded-2xl border border-white/10 bg-surface ${className}`}>
      <Media kind="portrait" hue={hue} className="absolute inset-0 -z-10 size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt={`${work.title} — ${work.author}`} />
      <div className="flex items-start justify-between p-4">
        <PlatformBadge platform={work.platform} className="size-9" />
        <ViewsPill>{work.views}</ViewsPill>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-5 pt-24">
        <h3 className="text-[20px] font-normal leading-[28px] tracking-[-0.04em] text-white">{work.title}</h3>
        <p className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/70">{work.description}</p>
        <Author name={work.author} className="mt-1" />
      </div>
    </article>
  );
}
