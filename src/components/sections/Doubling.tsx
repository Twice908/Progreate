import { doubling } from "@/content/site";

export default function Doubling() {
  return (
    <section className="dbl section-z" id="doubling" data-medium="emb" data-dbl>
      <div className="dbl__pin">
        <div className="dbl__top">
          <p className="label">{doubling.label}</p>
          <h2 className="dbl__title">{doubling.title}</h2>
          <p className="dbl__aside">{doubling.aside}</p>
        </div>

        <div className="dbl__bottom">
          <ul className="dbl__beats">
            {doubling.beats.map((beat) => (
              <li key={beat.at} data-beat={beat.at}>
                <span className="dbl__beat-num">{(2 ** beat.at).toLocaleString("en-US")}</span>
                {beat.text}
              </li>
            ))}
          </ul>
          <p className="dbl__num" aria-hidden="true">
            <span data-dbl-num>{(2 ** doubling.total).toLocaleString("en-US")}</span>
          </p>
          <p className="dbl__gen label" aria-hidden="true">
            Generation <b data-dbl-gen>{doubling.total}</b> of {doubling.total}
          </p>
        </div>
      </div>
    </section>
  );
}
