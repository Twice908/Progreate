import { hero } from "@/content/site";

export default function Hero() {
  return (
    <section className="hero" id="top" data-medium="tcbs" data-cursor-text="Divide" data-hero>
      {/* Sits underneath the WebGL canvas: the cell refracts this exact type. */}
      <h1 className="hero__title" data-plate="hero">
        <span className="word" data-ink>
          <span data-rise>We</span>
        </span>{" "}
        <span className="word" data-ink>
          <span data-rise>grow</span>
        </span>{" "}
        <span className="word word--break" data-ink>
          <span data-rise>culture.</span>
        </span>
      </h1>

      <div className="hero__intro">
        <p className="hero__lede" data-hero-in>
          {hero.lede}
        </p>
        <div className="hero__actions" data-hero-in>
          <a className="btn" href={hero.primary.href} data-magnetic>
            <span>{hero.primary.label}</span>
          </a>
          <a className="btn btn--ghost" href={hero.secondary.href} data-magnetic>
            <span>{hero.secondary.label}</span>
          </a>
        </div>
      </div>

      <p
        className="hero__hint"
        data-hint
        data-hint-mouse={hero.hint.mouse}
        data-hint-touch={hero.hint.touch}
        data-hint-steps={JSON.stringify(hero.hintSteps)}
        aria-hidden="true"
      >
        {hero.hint.mouse}
      </p>
    </section>
  );
}
