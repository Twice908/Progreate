const BASE = "/aurora-demo";

/** Keeps the demo's internal links inside the demo. External links pass through untouched. */
export function demoHref(href: string) {
  if (!href.startsWith("/")) return href;
  return href === "/" ? BASE : `${BASE}${href.replace(/^\/(?=#)/, "")}`;
}
