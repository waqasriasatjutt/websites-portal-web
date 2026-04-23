import type { SiteConfig } from '@/lib/odoo';

export function SiteHeader({ site }: { site: SiteConfig }) {
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

        <div className="flex items-center gap-2">
          <a href="/contact" className="wp-btn wp-btn-primary text-sm py-2.5 px-4">
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ site }: { site: SiteConfig }) {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
    >
      <div className="wp-container py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
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
            </div>
            {site.description && (
              <p className="text-sm max-w-md leading-relaxed" style={{ color: 'var(--muted)' }}>
                {site.description}
              </p>
            )}
          </div>
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
              <li>
                <a href="/blog" className="hover:text-[var(--text)]">Blog</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[var(--text)]">Contact</a>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-[var(--text)]">Sitemap</a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <p>© {year} {site.title || site.name}. All rights reserved.</p>
          <p>Built with Websites Portal · Hosted on Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}
