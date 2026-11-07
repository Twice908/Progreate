import { work } from "@/content/site";

export default function Work() {
  return (
    <section className="work section-z" id="work" data-work aria-labelledby="work-title">
      {/* Sticky: stays on screen while the case studies scroll past it. */}
      <div className="work__stage" data-dish-stage aria-hidden="true">
        <canvas className="work__canvas" data-dish />
        <div className="work__ringwrap">
          <div className="work__ring" data-dish-ring>
            <svg viewBox="0 0 1000 1000">
              <defs>
                <path id="dish-ring" d="M500,500 m-484,0 a484,484 0 1,1 968,0 a484,484 0 1,1 -968,0" />
              </defs>
              <text>
                <textPath href="#dish-ring" data-dish-ring-text>
                  Plate 01 · Zestwick · Growth form: Branching
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="work__flow">
        <header className="work__intro" data-medium="sheen" data-work-intro>
          <p className="label" data-rise-in>
            {work.label}
          </p>
          <h2 className="work__title" id="work-title" data-lines>
            {work.title}
          </h2>
          <div className="work__sub" data-rise-in>
            <p>{work.intro}</p>
            <p
              className="work__feed label"
              data-feed-hint
              data-hint-mouse={work.feedHint.mouse}
              data-hint-touch={work.feedHint.touch}
            >
              {work.feedHint.mouse}
            </p>
            {work.illustrative && <p className="work__note label">{work.illustrativeNote}</p>}
          </div>
        </header>

        {work.plates.map((plate, i) => (
          <article
            key={plate.brand}
            className="plate"
            data-plate-card={i}
            data-medium={plate.medium}
            data-feed={plate.growth.feed}
            data-kill={plate.growth.kill}
            data-agar={plate.dish.agar}
            data-colony={plate.dish.colony}
            data-colony-edge={plate.dish.colonyEdge}
            data-ring={`Plate ${String(i + 1).padStart(2, "0")} · ${plate.brand} · Growth form: ${plate.growth.name} · Feed ${plate.growth.feed} · Kill ${plate.growth.kill} · `}
          >
            <div className="plate__body">
              <p className="label plate__tag" data-rise-in>
                <span>Plate {String(i + 1).padStart(2, "0")}</span>
                <span>{plate.sector}</span>
              </p>
              <h3 className="plate__brand" data-lines>
                {plate.brand}
              </h3>
              <p className="plate__idea" data-rise-in>
                {plate.idea}
              </p>
              <p className="plate__text" data-rise-in>
                {plate.text}
              </p>
              <dl className="plate__stats">
                {plate.stats.map((stat) => (
                  <div key={stat.label} data-rise-in>
                    <dd>{stat.value}</dd>
                    <dt>{stat.label}</dt>
                  </div>
                ))}
              </dl>
              <ul className="plate__services" data-rise-in>
                {plate.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
