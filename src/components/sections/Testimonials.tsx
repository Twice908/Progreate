import { testimonials as t } from "@/lib/data";
import Media from "@/components/ui/Media";
import { SectionBadge, Lines } from "@/components/ui/SectionHeader";
import { Author } from "@/components/ui/VideoCard";
import { Eye, Star, TrendUp } from "@/components/ui/Icons";

export default function Testimonials() {
  const [first, ...rest] = t.name.split(" ");
  return (
    <section className="py-20 md:py-[120px]" aria-labelledby="testimonials-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="flex max-w-[643px] flex-col items-start gap-5">
            <SectionBadge>{t.badge}</SectionBadge>
            <h2 id="testimonials-title" data-split className="t-h2 text-balance">
              <Lines lines={t.title} />
            </h2>
            <p data-reveal className="t-lead max-w-[460px] text-pretty">
              {t.description}
            </p>
          </div>
          <div data-reveal className="flex -space-x-0 gap-2" aria-hidden>
            {[24, 200, 220].map((h, i) => (
              <Media key={i} kind="avatar" hue={h} className={`size-[60px] rounded-full md:size-20 ${i ? "grayscale" : ""}`} />
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-2.5 md:mt-[60px] md:grid-cols-3">
          {/* Stats */}
          <article data-reveal className="card-glass flex flex-col gap-3 p-3 md:p-3.5">
            {t.stats.map((s) => (
              <div key={s.label + s.value} className="relative flex flex-1 items-center justify-between rounded-lg bg-white/5 p-6 md:p-9">
                <div>
                  <p className="font-display text-[56px] font-medium leading-[64px] tracking-[-0.02em] text-cream md:text-[60px] md:leading-[72px]">
                    <span data-count={s.value}>{s.value}</span>
                    <span className="text-ember-soft">{s.suffix}</span>
                  </p>
                  <p className="mt-1 text-[14px] leading-[19.6px] tracking-[-0.04em] text-white/80">{s.label}</p>
                </div>
                <span className="grid size-12 place-items-center rounded-full bg-bg/70 text-white/80">
                  {s.icon === "eye" ? <Eye className="size-5" /> : <TrendUp className="size-5" />}
                </span>
              </div>
            ))}
          </article>

          {/* Portrait */}
          <article data-reveal className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10">
            <Media kind="portrait" hue={16} className="absolute inset-0 size-full" alt={`${t.author} testimonial`} />
            <Author name={t.author} className="absolute bottom-4 left-4 rounded-full bg-black/35 py-1 pl-1 pr-3 backdrop-blur-sm" />
          </article>

          {/* Quote */}
          <article data-reveal className="card-glass glow-bottom flex min-h-[380px] flex-col justify-between p-6 md:p-6">
            <div>
              <div className="flex gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-5" />
                ))}
              </div>
              <blockquote className="mt-5 text-[20px] font-normal leading-[28px] tracking-[-0.04em] text-white">{t.quote}</blockquote>
            </div>
            <div>
              <p className="font-display text-[24px] font-medium leading-[26.4px] tracking-[-0.03em] text-cream">
                {first} <span className="text-clay">{rest.join(" ")}</span>
              </p>
              <p className="mt-2 text-[14px] leading-[19.6px] tracking-[-0.04em] text-white/60">{t.role}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
