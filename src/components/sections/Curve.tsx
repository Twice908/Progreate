import { curve } from "@/content/site";

export default function Curve() {
  return (
    <section className="curve section-z" id="curve" data-medium="mannitol" data-curve aria-labelledby="curve-title">
      <header className="curve__head">
        <p className="label" data-rise-in>
          {curve.label}
        </p>
        <h2 className="curve__title" id="curve-title" data-lines>
          {curve.title}
        </h2>
        <p className="curve__sub" data-rise-in>
          {curve.sub}
        </p>
      </header>

      <div className="curve__track" data-curve-track>
        <div className="curve__pin">
          <ol className="curve__phases">
            {curve.phases.map((phase, i) => (
              <li key={phase.name} className="phase" data-phase={i}>
                <p className="label phase__tag">
                  Phase {i + 1} of {curve.phases.length}
                </p>
                <h3 className="phase__name">{phase.name}</h3>
                <p className="phase__line">{phase.line}</p>
                <p className="phase__text">{phase.text}</p>
              </li>
            ))}
          </ol>

          <figure className="curve__plot">
            <canvas data-curve-canvas role="img" aria-label={curve.chart.alt} />
            <figcaption className="label">
              <span>↑ {curve.chart.y}</span>
              <span>{curve.chart.x} →</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
