import { results } from "@/lib/data";
import Button from "./Button";
import Media from "@/components/ui/Media";
import { SectionBadge } from "./SectionHeader";
import { Author } from "@/components/ui/VideoCard";

const hues = [78, 92, 70, 104, 84];

export default function Results() {
  const [top, bottom] = [results.cards.slice(0, 2), results.cards.slice(2)];

  const Card = ({ c, i, big }: { c: (typeof results.cards)[number]; i: number; big?: boolean }) => (
    <article data-reveal className="glass flex flex-col gap-4 p-2">
      <div className={`relative overflow-hidden rounded-[10px] ${big ? "h-[260px] md:h-[390px]" : "h-[240px] md:h-[250px]"}`}>
        <Media kind="scene" hue={hues[i]} className="size-full" alt={`${c.author} result`} />
        <Author name={c.author} className="absolute bottom-3 left-3 rounded-full bg-black/35 py-1 pl-1 pr-3 backdrop-blur-sm" />
      </div>
      <div className="flex flex-col gap-3 px-3 pb-4">
        <h3 className="font-display text-[24px] font-medium leading-[26.4px] tracking-[-0.03em] text-cream">
          {c.lead}
          <span className="text-aurora">{c.accent}</span>
        </h3>
        <p className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60">{c.description}</p>
      </div>
    </article>
  );

  return (
    <section className="py-20 md:py-[120px]" aria-labelledby="results-title">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex max-w-[730px] flex-col items-start gap-5">
            <SectionBadge>{results.badge}</SectionBadge>
            <h2 id="results-title" data-split className="t-h2 text-balance">
              {results.title}
            </h2>
            <p data-reveal className="t-lead max-w-[560px] text-pretty">
              {results.description}
            </p>
          </div>
          <div data-reveal className="md:pb-1">
            <Button href={results.cta.href} variant="lime" className="w-full md:w-auto">
              {results.cta.label}
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2.5 md:mt-[60px]">
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {top.map((c, i) => (
              <Card key={c.author} c={c} i={i} big />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
            {bottom.map((c, i) => (
              <Card key={c.author} c={c} i={i + 2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
