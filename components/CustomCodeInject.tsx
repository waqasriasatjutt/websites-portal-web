import type { SiteConfig } from '@/lib/odoo';

/**
 * Renders the site's custom_head_html + custom_css inside the page output.
 * Should be rendered at the top of the page tree so the styles + meta land
 * before content. Note: Next.js doesn't expose <head> directly in App Router
 * page components — but `dangerouslySetInnerHTML` of <style> + <script> at
 * the top of the <body> works fine for our use case (CSS overrides, third
 * party verifications via meta tags inserted into body are still parsed).
 */
export function CustomHeadCss({ site }: { site: SiteConfig }) {
  const code = site.custom_code;
  if (!code) return null;
  const css = code.css?.trim();
  const head = code.head_html?.trim();
  const extraMeta = code.extra_meta || [];

  return (
    <>
      {extraMeta.length > 0 && (
        <>
          {extraMeta.map((m, i) => (
            <meta
              key={i}
              {...(m.name ? { name: m.name } : {})}
              {...(m.property ? { property: m.property } : {})}
              content={m.content}
            />
          ))}
        </>
      )}
      {head && (
        <span dangerouslySetInnerHTML={{ __html: head }} suppressHydrationWarning />
      )}
      {css && (
        <style
          dangerouslySetInnerHTML={{ __html: css }}
          data-source="site-custom-css"
        />
      )}
    </>
  );
}

export function CustomBodyStart({ site }: { site: SiteConfig }) {
  const code = site.custom_code;
  if (!code?.body_start_html?.trim()) return null;
  return (
    <span
      dangerouslySetInnerHTML={{ __html: code.body_start_html }}
      suppressHydrationWarning
    />
  );
}

export function CustomBodyEnd({ site }: { site: SiteConfig }) {
  const code = site.custom_code;
  if (!code) return null;
  const body = code.body_end_html?.trim();
  const js = code.js?.trim();
  return (
    <>
      {body && (
        <span
          dangerouslySetInnerHTML={{ __html: body }}
          suppressHydrationWarning
        />
      )}
      {js && (
        <script
          dangerouslySetInnerHTML={{ __html: js }}
          data-source="site-custom-js"
        />
      )}
    </>
  );
}
