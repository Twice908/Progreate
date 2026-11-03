import { process as data } from "@/lib/data";
import SectionHeader from "@/components/ui/SectionHeader";
import Media from "@/components/ui/Media";
import { Verified, PlatformBadge } from "@/components/ui/Icons";
import BeforeAfter from "./BeforeAfter";

/* Step 1 — upload */
function UploadVisual() {
  return (
    <div className="relative grid size-full place-items-center rounded-lg bg-surface p-3">
      <div className="absolute inset-3 rounded-md border border-dashed border-white/20" aria-hidden />
      <div className="relative -mt-3 grid size-[84px] place-items-center rounded-[18px] border border-dashed border-ember/70 bg-[rgb(60_24_12/0.85)] shadow-[0_0_40px_-6px_rgb(250_97_20/0.5)]">
        <svg viewBox="0 0 32 32" className="size-9" fill="none" aria-hidden>
          <path d="M9 4h10l6 6v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="#ff7a45" />
          <path d="M19 4v6h6" fill="#ffb08a" />
          <path d="M16 23v-8m-3 3 3-3 3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 flex">
        <Media kind="scene" hue={30} className="h-[58px] w-[84px] rounded-md border border-white/15 shadow-lg" alt="Uploaded clip" />
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-[#16a140] text-[10px] font-medium text-white">+</span>
      </div>
    </div>
  );
}

/* Step 3 — published */
function PublishedRow({ item, hues }: { item: (typeof data.published)[number]; hues: [number, number] }) {
  return (
    <div className="grid grid-cols-[1fr_1.4fr_1fr] items-center gap-2.5">
      <Media kind="portrait" hue={hues[0]} className="aspect-[3/4] rounded-md" alt="Published video" />
      <div className="flex flex-col items-center gap-1.5 text-center">
        <PlatformBadge platform={item.platform as "shorts" | "tiktok"} className="size-8 rounded-md" />
        <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(22_161_64/0.15)] px-2 py-0.5 text-[13px] font-medium leading-none tracking-[-0.03em] text-[#16a140]">
          {item.views}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] tracking-[-0.02em] text-white/80">
          {item.author}
          <Verified className="size-3" />
        </span>
      </div>
      <Media kind="portrait" hue={hues[1]} className="aspect-[3/4] rounded-md" alt="Published video" />
    </div>
  );
}

function PublishedVisual() {
  const [a, b] = data.published;
  return (
    <div className="flex size-full flex-col justify-center gap-3 rounded-lg bg-surface p-3">
      <PublishedRow item={a} hues={[28, 20]} />
      <PublishedRow item={b} hues={[210, 8]} />
    </div>
  );
}

export default function Process() {
  const visuals = [<UploadVisual key="u" />, <BeforeAfter key="b" />, <PublishedVisual key="p" />];
  return (
    <section className="py-20 md:py-[120px]" aria-labelledby="process-title">
      <div className="container-x">
        <div className="mx-auto max-w-[988px]">
          <SectionHeader badge={data.badge} title={data.title} description={data.description} descClass="max-w-[514px]" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-2.5 md:mt-[60px] md:grid-cols-2 lg:grid-cols-3">
          {data.steps.map((s, i) => (
            <article key={s.title} data-reveal className="card-dark relative isolate flex flex-col gap-7 overflow-hidden bg-bg p-5 md:p-8">
              <div aria-hidden className="pointer-events-none absolute -top-14 left-1/2 -z-10 h-[109px] w-[84%] -translate-x-1/2 rounded-full bg-ember/35 blur-[70px]" />
              <div aria-hidden className="pointer-events-none absolute -bottom-14 left-1/2 -z-10 h-[109px] w-[100%] -translate-x-1/2 rounded-full bg-ember/40 blur-[70px]" />
              <div className="h-[276px]">{visuals[i]}</div>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-[28px] font-medium leading-[28px] tracking-[-0.03em] text-cream">{s.title}</h3>
                <p className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60">{s.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
