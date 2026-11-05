"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { faq } from "@/lib/data";
import { SectionBadge, Lines } from "./SectionHeader";
import { Minus, Plus } from "./Icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const list = useRef<HTMLUListElement>(null);
  const first = useRef(true);
  const uid = useId();

  // Animate panel heights with GSAP. Initial render is already correct (no animation on mount).
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-faq-body]", list.current!);
      items.forEach((el, i) => {
        const shouldOpen = open === i;
        if (first.current) {
          gsap.set(el, { height: shouldOpen ? "auto" : 0, opacity: shouldOpen ? 1 : 0 });
          return;
        }
        gsap.to(el, {
          height: shouldOpen ? "auto" : 0,
          opacity: shouldOpen ? 1 : 0,
          duration: 0.45,
          ease: "power3.inOut",
          overwrite: true,
        });
      });
      first.current = false;
    },
    { dependencies: [open], scope: list },
  );

  return (
    <section className="py-20 md:py-[120px]" aria-labelledby="faq-title">
      <div className="container-x">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex max-w-[556px] flex-col items-start gap-5 lg:pt-6">
            <SectionBadge>{faq.badge}</SectionBadge>
            <h2 id="faq-title" data-split className="t-h2 text-balance">
              <Lines lines={faq.title} />
            </h2>
            <p data-reveal className="t-lead max-w-[420px] text-pretty">
              {faq.description}
            </p>
          </div>

          <ul ref={list} className="flex w-full flex-col gap-3 lg:max-w-[642px]">
            {faq.items.map((item, i) => {
              const expandable = Boolean(item.answer);
              const isOpen = open === i && expandable;
              const bodyId = `${uid}-body-${i}`;
              return (
                <li
                  key={item.question}
                  data-reveal
                  className={`glass rounded-[14px] transition-colors duration-300 ${isOpen ? "border-aurora/40" : "hover:bg-white/[0.04]"}`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-6 py-[30px] text-left disabled:cursor-default md:px-8"
                    aria-expanded={isOpen}
                    aria-controls={bodyId}
                    disabled={!expandable}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="font-display text-[20px] font-normal leading-6 tracking-[-0.02em] text-white/80 md:text-[24px]">{item.question}</span>
                    <span className="shrink-0 text-white/60">{isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}</span>
                  </button>
                  {expandable && (
                    <div id={bodyId} data-faq-body className={`overflow-hidden ${isOpen ? "" : "h-0 opacity-0"}`} role="region">
                      <p className="px-6 pb-[30px] text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60 md:px-8">{item.answer}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
