import PageMotion from "@/components/motion/PageMotion";
import Button from "@/components/ui/Button";
import Stars from "@/components/ui/Stars";
import { notFound } from "@/lib/data";

export default function NotFound() {
  return (
    <PageMotion>
      <section className="relative isolate flex min-h-[92vh] items-center justify-center overflow-hidden px-5 pb-10 pt-[140px]">
        <div aria-hidden className="absolute inset-0 -z-10 [background:radial-gradient(60%_55%_at_50%_45%,rgb(130_50_18/0.55),transparent_75%)]" />
        <Stars count={30} seed={77} className="-z-10" />

        <div className="flex flex-col items-center text-center">
          <div data-reveal className="flex gap-2.5 md:gap-3" aria-label="404">
            {notFound.digits.map((d, i) => (
              <span
                key={i}
                aria-hidden
                className="grid h-[104px] w-[78px] place-items-center rounded-2xl border border-white/[0.09] font-display text-[76px] font-medium leading-none tracking-[-0.04em] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] md:h-[170px] md:w-[130px] md:text-[128px]"
                style={{ background: "linear-gradient(180deg, rgb(70 34 18 / 0.75) 0%, rgb(26 13 7 / 0.9) 100%)" }}
              >
                <span className="[background-image:linear-gradient(180deg,#ffd9c2_0%,#ff7a3a_55%,#c8501f_100%)] [-webkit-background-clip:text] [background-clip:text] [color:transparent]">{d}</span>
              </span>
            ))}
          </div>
          <h1 data-split className="mt-10 font-display text-[24px] font-medium leading-[28px] tracking-[-0.03em] text-cream md:mt-12 md:text-[28px]">
            {notFound.title}
          </h1>
          <p data-reveal className="mt-3 max-w-[440px] text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60">
            {notFound.description}
          </p>
          <div data-reveal className="mt-7">
            <Button href={notFound.cta.href} variant="ember">
              {notFound.cta.label}
            </Button>
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
