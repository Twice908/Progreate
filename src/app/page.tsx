import Experience from "@/components/Experience";
import Hud from "@/components/Hud";
import Hero from "@/components/sections/Hero";
import Premise from "@/components/sections/Premise";
import Doubling from "@/components/sections/Doubling";
import Work from "@/components/sections/Work";
import Curve from "@/components/sections/Curve";
import Media from "@/components/sections/Media";
import Notes from "@/components/sections/Notes";
import Brief from "@/components/sections/Brief";
import Footer from "@/components/sections/Footer";

/**
 * Holds the opening sequence closed until the motion code takes over. If that code never arrives
 * (blocked script, failed chunk), the page opens itself so nobody is left looking at a blank screen.
 */
const opening = `(function(d,w){var h=d.documentElement;if(h.classList.contains('calm'))return;h.classList.add('booting');w.__pgFailsafe=setTimeout(function(){h.classList.remove('booting');h.classList.add('booted')},7000)})(document,window);`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: opening }} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <span data-lvh aria-hidden="true" className="lvh-probe" />
      <div className="veil" data-veil aria-hidden="true" />
      <canvas className="stage" data-stage aria-hidden="true" />
      <div className="fallback-cell" aria-hidden="true" />
      <Hud />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Premise />
        <Doubling />
        <Work />
        <Curve />
        <Media />
        <Notes />
        <Brief />
      </main>
      <Footer />
      <Experience />
    </>
  );
}
