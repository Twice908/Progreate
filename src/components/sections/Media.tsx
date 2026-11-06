import type { CSSProperties } from "react";
import { media } from "@/content/site";
import { mediums } from "@/lib/mediums";

export default function Media() {
  return (
    <section className="media section-z" id="media" data-medium="nutrient" aria-labelledby="media-title">
      <header className="media__head">
        <p className="label" data-rise-in>
          {media.label}
        </p>
        <h2 className="media__title" id="media-title" data-lines>
          {media.title}
        </h2>
        <p className="media__sub" data-rise-in>
          {media.sub}
        </p>
      </header>

      <ol className="media__list" data-media>
        {media.items.map((item, i) => {
          const tint = mediums[item.medium];
          return (
            <li
              key={item.name}
              className="media__item"
              data-media-item
              style={{ "--tint-bg": tint.bg, "--tint-ink": tint.ink } as CSSProperties}
            >
              <h3>
                <button
                  type="button"
                  className="media__row"
                  id={`media-row-${i}`}
                  aria-expanded="false"
                  aria-controls={`media-panel-${i}`}
                  data-media-row
                >
                  <span className="media__no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="media__name">{item.name}</span>
                  <span className="media__role">{item.role}</span>
                  <span className="media__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="media__panel" id={`media-panel-${i}`} role="region" aria-labelledby={`media-row-${i}`} data-media-panel>
                <div className="media__inner">
                  <p>{item.text}</p>
                  <ul>
                    {item.list.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
