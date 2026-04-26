import type { SiteConfig, SocialLink } from '@/lib/odoo';

const SOCIAL_PATHS: Record<string, string> = {
  twitter: 'M22.46 5.94c-.77.34-1.6.57-2.46.67a4.27 4.27 0 0 0 1.88-2.36 8.4 8.4 0 0 1-2.7 1.04 4.26 4.26 0 0 0-7.27 3.88A12.1 12.1 0 0 1 3.1 4.65a4.26 4.26 0 0 0 1.32 5.7 4.21 4.21 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.42 4.18c-.4.11-.8.16-1.21.16-.3 0-.58-.03-.86-.08a4.28 4.28 0 0 0 3.99 2.97A8.55 8.55 0 0 1 2 18.85a12.06 12.06 0 0 0 6.53 1.91c7.83 0 12.11-6.49 12.11-12.11l-.01-.55a8.65 8.65 0 0 0 2.13-2.21l-.3-.05Z',
  facebook: 'M22 12a10 10 0 1 0-11.56 9.88v-7H7.9V12h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.88h-2.33v7A10 10 0 0 0 22 12Z',
  instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.52.01-4.76.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.83-.39.39-.63.76-.83 1.27-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.27.39.39.76.63 1.27.83.39.15.97.33 2.04.38 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.83.39-.39.63-.76.83-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.07-.23-1.65-.38-2.04a3.4 3.4 0 0 0-.83-1.27 3.4 3.4 0 0 0-1.27-.83c-.39-.15-.97-.33-2.04-.38-1.24-.06-1.61-.07-4.76-.07Zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92Zm0 1.62a3.84 3.84 0 1 0 0 7.68 3.84 3.84 0 0 0 0-7.68Zm5.65-2.13a1.27 1.27 0 1 1-2.55 0 1.27 1.27 0 0 1 2.55 0Z',
  linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V9.85H5.67v8.49h2.67Zm-1.34-9.7a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1ZM18.34 18.34v-4.65c0-2.49-1.33-3.65-3.1-3.65-1.43 0-2.07.79-2.43 1.34v-1.16h-2.67v8.49h2.67v-4.74c0-1.25.45-2.05 1.66-2.05 1.21 0 1.59.84 1.59 2.06v4.73h2.28Z',
  youtube: 'M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77A26.21 26.21 0 0 0 2 12c0 1.71.14 3.46.42 4.81a2.5 2.5 0 0 0 1.76 1.77c1.55.42 7.82.42 7.82.42s6.27 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77c.28-1.35.42-3.1.42-4.81 0-1.71-.14-3.46-.42-4.81ZM10 15.5v-7l5.7 3.5L10 15.5Z',
  github: 'M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36a3.06 3.06 0 0 0-1.27-1.69c-1.04-.71.08-.7.08-.7a2.4 2.4 0 0 1 1.76 1.18 2.46 2.46 0 0 0 3.36.96 2.43 2.43 0 0 1 .73-1.54c-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07a4.13 4.13 0 0 1 .11-3.02s.96-.31 3.16 1.18a10.93 10.93 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.5.23 2.6.11 3.02a4.42 4.42 0 0 1 1.18 3.07c0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.55A11.5 11.5 0 0 0 12 .5Z',
  tiktok: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-1.95V14.6a5.06 5.06 0 1 1-5.06-5.06h.05v3.04a2.07 2.07 0 1 0 2.07 2.07V0h2.94a4.84 4.84 0 0 0 .07.83 4.83 4.83 0 0 0 4.66 4.16v3.7Z',
};

function SocialIcon({ network }: { network: string }) {
  const path = SOCIAL_PATHS[network];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  );
}

export function SiteHeader({ site }: { site: SiteConfig }) {
  const cta = site.header_cta || { label: '', href: '' };
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-lg border-b"
      style={{
        borderColor: 'var(--border)',
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
      }}
    >
      <div className="wp-container flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 shrink-0">
          {site.logo_url ? (
            <img src={site.logo_url} alt={site.title} className="h-8 w-auto" />
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: 'var(--bg)',
                }}
              >
                {(site.title || site.name).slice(0, 1).toUpperCase()}
              </div>
              <span className="font-bold text-base tracking-tight">{site.title || site.name}</span>
            </div>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {(site.menu || []).map((m, i) => (
            <a
              key={i}
              href={m.href}
              className="transition hover:text-[var(--primary)]"
              style={{ color: 'var(--text)' }}
            >
              {m.label}
            </a>
          ))}
        </nav>

        {cta.label && cta.href ? (
          <div className="flex items-center gap-2">
            <a href={cta.href} className="wp-btn wp-btn-primary text-sm py-2.5 px-4">
              {cta.label}
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function SiteFooter({ site }: { site: SiteConfig }) {
  const year = new Date().getFullYear();
  const footer = site.footer;
  const aboutText = footer?.about || site.description || '';
  const columns = footer?.columns || [];
  const socials = footer?.socials || [];

  // Default copyright if not set
  const copyright = footer?.copyright || `© ${year} ${site.title || site.name}. All rights reserved.`;
  const credit = footer?.credit ?? '';

  // Detect if footer is configured from Odoo or fall back to legacy default
  const hasCustomColumns = columns.length > 0;

  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
    >
      <div className="wp-container py-14">
        <div className={`grid gap-8 ${hasCustomColumns ? `md:grid-cols-${Math.min(columns.length + 1, 5)}` : 'md:grid-cols-4'}`}>
          {/* Brand column — always first */}
          <div className={hasCustomColumns ? '' : 'md:col-span-2'}>
            <div className="flex items-center gap-2 mb-4">
              {site.logo_url ? (
                <img src={site.logo_url} alt={site.title} className="h-8 w-auto" />
              ) : (
                <>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      color: 'var(--bg)',
                    }}
                  >
                    {(site.title || site.name).slice(0, 1).toUpperCase()}
                  </div>
                  <span className="font-bold">{site.title || site.name}</span>
                </>
              )}
            </div>
            {aboutText && (
              <p className="text-sm max-w-md leading-relaxed" style={{ color: 'var(--muted)' }}>
                {aboutText}
              </p>
            )}
            {socials.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socials.map((s: SocialLink, i: number) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                     aria-label={s.network}
                     className="w-8 h-8 rounded-md grid place-items-center transition"
                     style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
                  >
                    <SocialIcon network={s.network} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Custom columns from Odoo */}
          {hasCustomColumns ? (
            columns.map((col, i) => (
              <div key={i}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--primary)' }}>
                  {col.title}
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                  {(col.links || []).map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="hover:text-[var(--text)]">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Legacy fallback when no Odoo footer config */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--primary)' }}>
                  Navigation
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                  {(site.menu || []).map((m, i) => (
                    <li key={i}>
                      <a href={m.href} className="hover:text-[var(--text)]">
                        {m.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--primary)' }}>
                  Resources
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                  <li><a href="/blog" className="hover:text-[var(--text)]">Blog</a></li>
                  <li><a href="/contact" className="hover:text-[var(--text)]">Contact</a></li>
                  <li><a href="/sitemap.xml" className="hover:text-[var(--text)]">Sitemap</a></li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <p>{copyright}</p>
          {credit ? <p>{credit}</p> : null}
        </div>
      </div>
    </footer>
  );
}
