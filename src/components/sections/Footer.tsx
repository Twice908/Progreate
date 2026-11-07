import { footer, nav, site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer" data-footer data-cursor-text="">
      <div className="footer__row">
        <a className="footer__mail" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <nav className="footer__nav" aria-label="Footer">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className="footer__legal">
          <span>© {site.year} {site.name}</span>
          <span>{footer.joke}</span>
        </p>
      </div>

      {/* Like the hero, this sits under the canvas so the cell can refract it. */}
      <p className="footer__mark" data-plate="footer" aria-hidden="true">
        <span className="word" data-ink>
          <span>{site.name}</span>
        </span>
      </p>
    </footer>
  );
}
