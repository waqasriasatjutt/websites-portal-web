import type { PropsOf } from '@/types/blocks';

/** Tiny deterministic hash → a CSS-safe id, so a block's CSS/JS can be scoped. */
function blockId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return 'wpc' + (h >>> 0).toString(36);
}

/**
 * Scope a stylesheet to a single block by prefixing each top-level selector with
 * `[data-wpc="<id>"]`. Naive but covers the common case (plain rule sets);
 * @-rules (@media, @keyframes, …) are left as-is — their inner rules won't be
 * scoped, which is the documented limitation.
 */
function scopeCss(css: string, id: string): string {
  const scope = `[data-wpc="${id}"]`;
  return css.replace(/(^|})\s*([^{}@]+)\{/g, (_m, brace, sel) => {
    const prefixed = sel
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .map((s: string) => `${scope} ${s}`)
      .join(', ');
    return `${brace} ${prefixed} {`;
  });
}

export default function CustomHTML({ props }: { props: PropsOf<'custom_html'> }) {
  const html = props.html || '';
  if (!html.trim()) return null;
  const css = (props.css || '').trim();
  const js = (props.js || '').trim();
  const id = blockId(html + '|' + css);
  const wrapperClass = (props.wrapper_class || '').trim();
  const fullWidth = !!props.full_width;

  const inner = (
    <>
      {css && (
        <style
          data-source="custom-html-block"
          dangerouslySetInnerHTML={{ __html: scopeCss(css, id) }}
        />
      )}
      <div data-wpc={id} dangerouslySetInnerHTML={{ __html: html }} />
      {js && (
        <script
          data-source="custom-html-block"
          dangerouslySetInnerHTML={{
            __html: `;(function(){try{var el=document.querySelector('[data-wpc="${id}"]');(function(el){${js}})(el);}catch(e){console.error('custom_html block JS:',e);}})();`,
          }}
        />
      )}
    </>
  );

  return (
    <section className={`wp-section${wrapperClass ? ' ' + wrapperClass : ''}`}>
      {fullWidth ? inner : <div className="wp-container">{inner}</div>}
    </section>
  );
}
