# Progreate

The landing page for Progreate, a marketing agency. Next.js, GSAP, Three.js and Lenis.

The idea: *culture* means two things. The page treats a marketing agency as a growth lab. A single
living cell divides as you scroll, doubles its way to a million people and spells a word, and the
portfolio is a set of live petri dishes.

```bash
npm install
npm run dev
```

## Before launch

- **Case studies are placeholders.** The brands and every figure in `work.plates` in
  `src/content/site.ts` are invented to show the format. Replace them with real ones, then set
  `work.illustrative` to `false` to remove the on-page note saying so.
- **The contact form doesn't deliver anywhere yet.** `src/app/api/brief/route.ts` validates each
  submission and logs it on the server. Connect it to your email service or CRM.
- **Check the address.** `site.email` in `src/content/site.ts` is used throughout the page.

## Where things are

| Path | What it is |
| --- | --- |
| `src/content/site.ts` | All the copy. |
| `src/lib/mediums.ts` | The palette. Every colour is named after a real microbiology growth medium. |
| `src/components/` | The page's markup. Almost entirely server components, so the HTML works before any JS runs. |
| `src/styles/` | Tokens and base (`base.css`), floating UI (`chrome.css`), page sections (`sections.css`). |
| `src/lib/motion/boot.ts` | Entry point for all motion. Loaded after hydration. |
| `src/lib/motion/choreography.ts` | Drives the cell stage. A pure function of scroll position, plus pointer input. |
| `src/lib/motion/sections.ts` | Text reveals, the portfolio, the curve, the accordion, the running lines. |
| `src/lib/gl/stage.ts`, `colony.ts` | GPU metaball renderer, and the family tree that lets one cell become a word. |
| `src/lib/gl/dish.ts` | Gray-Scott reaction-diffusion. Each brand's pattern comes from its `feed` and `kill` values. |
| `src/lib/gl/shaders.ts` | All GLSL. |

## How it degrades

- **Slower devices** get fewer cells and a smaller simulation (`src/lib/motion/env.ts`). Both WebGL
  renderers also lower their own quality if frames stay slow.
- **Reduced motion:** no smooth scroll, pins or loops. The cell and dishes become still images, and
  the pinned scenes become ordinary readable content.
- **No WebGL:** CSS stand-ins for the cell and the dish.
- **No JavaScript:** every word of the page is still there, in the HTML.
