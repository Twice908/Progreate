"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, brand } from "@/lib/data";
import { Logo, MenuIcon, CloseIcon } from "./Icons";
import Button from "./Button";
import { demoHref } from "./links";

const PHONE = "(max-width: 809px)";
const TABLET_UP = "(min-width: 810px)";

export default function Navbar() {
  const pathname = usePathname();
  // The menu is "open for" a specific path, so navigating anywhere closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  const shell = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Phone: ONE reversible timeline drives the dropdown. Toggling mid-animation just reverses it from
    // wherever it is, so open → close → open never jumps. Radius is constant (see className below).
    mm.add(PHONE, () => {
      const p = panel.current;
      const box = inner.current;
      if (!p || !box) return;
      const items = Array.from(p.querySelectorAll("[data-nav-item]"));
      const k = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.001 : 1;

      gsap.set(p, { height: 0, autoAlpha: 0 });
      const tl = gsap.timeline({ paused: true });
      tl.to(p, { height: () => box.offsetHeight, autoAlpha: 1, duration: 0.55 * k, ease: "power3.inOut" }, 0).fromTo(
        items,
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4 * k, ease: "power3.out", stagger: 0.05 * k },
        0.12 * k,
      );
      menuTl.current = tl;

      return () => {
        tl.kill();
        menuTl.current = null;
        gsap.set([p, ...items], { clearProps: "all" });
      };
    });

    // Tablet/desktop: the pill narrows from 1312px → 900px as you leave the top of the page.
    mm.add(`${TABLET_UP} and (prefers-reduced-motion: no-preference)`, () => {
      if (!shell.current) return;
      gsap.fromTo(
        shell.current,
        { maxWidth: 1312 },
        { maxWidth: 900, ease: "none", scrollTrigger: { start: 0, end: 160, scrub: 0.4 } },
      );
    });

    return () => mm.revert();
  });

  // Drive the timeline from state; lock smooth scroll while the menu is open.
  useEffect(() => {
    const tl = menuTl.current;
    if (open) {
      window.__lenis?.stop();
      tl?.timeScale(1).play();
    } else {
      window.__lenis?.start();
      tl?.timeScale(1.2).reverse();
    }
  }, [open]);
  useEffect(() => () => window.__lenis?.start(), []);

  // Close on Escape, and if the viewport grows past the phone layout (e.g. rotating a tablet).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    const mq = window.matchMedia(TABLET_UP);
    const onChange = () => mq.matches && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const close = () => setOpenFor(null);

  return (
    <header className="fixed inset-x-0 top-5 z-50 px-5 md:top-8 md:px-10 lg:px-[65px]">
      {/*
        Fixed 36px radius in every state: with a 72px-tall bar that is a perfect pill when closed, and the
        exact same corner stays on the taller card while opening, open, and closing — nothing to interpolate.
      */}
      <div
        ref={shell}
        className="relative isolate mx-auto w-full max-w-[1312px] overflow-hidden rounded-[36px] border border-white/10 backdrop-blur-md [transform:translateZ(0)]"
        style={{ backgroundColor: "rgb(0 0 0 / 0.4)" }}
      >
        <nav aria-label="Primary" className="relative flex h-[70px] items-center justify-between px-4">
          <Link href={demoHref("/")} className="flex items-center gap-2 text-white" aria-label={`${brand.name} home`} onClick={close}>
            <Logo className="size-6" />
            <span className="font-display text-[24px] leading-6 tracking-[-0.02em]">{brand.name}</span>
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
            {nav.links.map((l) => (
              <li key={l.label}>
                <Link href={demoHref(l.href)} className="text-[16px] leading-[22.4px] tracking-[-0.02em] text-white/60 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button href={nav.cta.href} variant="white">
              {nav.cta.label}
            </Button>
          </div>

          <button
            type="button"
            className="grid size-10 place-items-center text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </nav>

        {/* Closed state is plain CSS (so it's right before JS runs); GSAP takes over on phones. */}
        <div id="mobile-menu" ref={panel} inert={!open} className="invisible h-0 overflow-hidden opacity-0 md:hidden">
          <div ref={inner}>
            <ul className="flex flex-col items-center gap-5 px-4 pb-5 pt-3">
              {nav.links.map((l) => (
                <li key={l.label} data-nav-item>
                  <Link href={demoHref(l.href)} className="text-[18px] tracking-[-0.02em] text-white/60 transition-colors hover:text-white" onClick={close}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li data-nav-item className="mt-2 w-full">
                <Button href={nav.cta.href} variant="white" className="w-full" onClick={close}>
                  {nav.cta.label}
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
