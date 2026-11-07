import { nav, site } from "@/content/site";
import { mediums } from "@/lib/mediums";

export default function Hud() {
  return (
    <>
      {/* The opening sequence: one cell, doubling. */}
      <div className="intro" data-intro aria-hidden="true">
        <span className="intro__dot" data-intro-dot />
        <span className="intro__label">Inoculating</span>
        <span className="intro__count" data-intro-count>
          1
        </span>
      </div>

      <header className="bar" data-bar>
        <a className="logo" href="#top" aria-label={`${site.name}, back to top`}>
          <span className="logo__mark" aria-hidden="true">
            <i />
            <i />
          </span>
          {site.name}
        </a>

        <nav className="bar__nav" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="bar__link">
              <span data-text={item.label}>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="bar__end">
          <button
            type="button"
            className="sound"
            data-sound
            aria-pressed="false"
            aria-label="Sound"
          >
            <span className="sound__label" aria-hidden="true">
              Sound
            </span>
            <span className="sound__bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </button>
          <button
            type="button"
            className="menu-btn"
            data-menu-toggle
            aria-expanded="false"
            aria-controls="menu"
          >
            <span data-menu-label>Menu</span>
          </button>
        </div>
      </header>

      {/* Full-screen menu, small screens only. */}
      <div className="menu" id="menu" data-menu hidden>
        <nav aria-label="Menu">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href}>
                <a href={item.href} data-menu-link>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="menu__mail" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>

      {/* Incubator readout. Decorative, and hidden from assistive tech. */}
      <div className="readout" data-readout aria-hidden="true">
        <span className="readout__chip" data-gen>
          Gen 00 · 1 cell
        </span>
        <span className="readout__chip readout__cue" data-scroll-cue>
          Scroll ↓
        </span>
        <span className="readout__chip readout__chip--medium">
          <span data-medium-name>{mediums.tcbs.name}</span>
          <span className="readout__temp" data-temp>
            37.0 °C
          </span>
        </span>
      </div>

      <div className="cursor" data-cursor aria-hidden="true">
        <span className="cursor__dot" />
        <span className="cursor__label" data-cursor-label />
      </div>
    </>
  );
}
