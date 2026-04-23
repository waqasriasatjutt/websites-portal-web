import type { SiteConfig } from '@/lib/odoo';

export function SiteHeader({ site }: { site: SiteConfig }) {
  return (
    <header className="border-b sticky top-0 z-40 backdrop-blur" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(10,14,39,0.85)' }}>
      <div className="wp-container flex h-16 items-center justify-between">
        <a href="/" className="font-bold text-lg tracking-tight">{site.title}</a>
        <nav className="flex items-center gap-5 text-sm">
          {(site.menu || []).map((m, i) => (
            <a key={i} href={m.href} className="hover:text-[var(--primary)]">{m.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ site }: { site: SiteConfig }) {
  return (
    <footer className="border-t mt-20" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="wp-container py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm" style={{ color: 'var(--muted)' }}>
        <span>© {new Date().getFullYear()} {site.title}</span>
        <span>Built with Websites Portal · Powered by Odoo + Cloudflare</span>
      </div>
    </footer>
  );
}
