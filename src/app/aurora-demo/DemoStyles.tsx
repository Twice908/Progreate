"use client";

/**
 * The canvas sits at z-index -1, so the opaque body background has to go for it to show. The rest
 * hides the site's navbar and footer (both come from the root layout) to judge the background alone.
 *
 * Next keeps a left page in the DOM (hidden by Activity), so the sheet has to switch itself off then,
 * or these rules would leak onto whichever page the visitor went to.
 */
const demoStyles = `
  html { background: #040604; }
  html body { background: transparent; }
  body > header, body > main + * { display: none; }
`;

export default function DemoStyles() {
  return (
    <style
      ref={(style) => {
        if (style) style.media = "";
        return () => {
          if (style) style.media = "not all";
        };
      }}
      dangerouslySetInnerHTML={{ __html: demoStyles }}
    />
  );
}
