import { Fragment } from "react";
import { notes } from "@/content/site";

export default function Notes() {
  return (
    <section className="notes section-z" data-medium="chocolate" data-notes aria-label={notes.label}>
      <p className="label notes__label">{notes.label}</p>
      {notes.rows.map((row, r) => (
        <div className="notes__row" key={r} data-note-row={r % 2 ? "right" : "left"}>
          <p className="notes__track">
            {/* Repeated so the line can run past the edges; only the first pass is announced. */}
            {[0, 1, 2].map((pass) => (
              <span key={pass} aria-hidden={pass > 0 ? true : undefined}>
                {row.map((line) => (
                  <Fragment key={line}>
                    {line}
                    <i className="notes__cell" aria-hidden="true" />
                  </Fragment>
                ))}
              </span>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}
