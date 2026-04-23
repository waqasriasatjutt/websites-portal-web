import { headers } from 'next/headers';
import { getSite, getPosts } from '@/lib/odoo';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';

export const runtime = 'edge';

function themeStyle(theme: any): React.CSSProperties {
  if (!theme) return {};
  return {
    ['--primary' as any]: theme.colors?.primary || '#00d4ff',
    ['--accent' as any]: theme.colors?.accent || '#9eff00',
    ['--bg' as any]: theme.colors?.bg || '#0a0e27',
    ['--text' as any]: theme.colors?.text || '#f8fafc',
    ['--muted' as any]: theme.colors?.muted || '#94a3b8',
  };
}

export default async function BlogIndex() {
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();

  const site = await getSite(host);
  if (!site) {
    return <div className="wp-container wp-section"><h1>Site not found</h1></div>;
  }
  const list = await getPosts(host, { limit: 24 });
  const posts = list?.posts || [];

  return (
    <div style={themeStyle(site.theme)}>
      <SiteHeader site={site} />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '80vh' }}>
        <section className="wp-section relative overflow-hidden">
          <div className="absolute inset-0 wp-grid-bg opacity-30"></div>
          <div className="wp-container relative">
            <div className="max-w-3xl">
              <div className="wp-eyebrow mb-5">Blog</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Latest <span className="wp-grad-text">insights</span>
              </h1>
              {site.tagline && (
                <p className="mt-6 text-lg sm:text-xl" style={{ color: 'var(--muted)' }}>
                  {site.tagline}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="wp-container">
            {posts.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No posts yet.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(p => (
                  <a key={p.id} href={`/blog/${p.slug}`} className="wp-card block">
                    {p.cover_url && (
                      <div className="aspect-video -mx-7 -mt-7 mb-5 overflow-hidden rounded-t-2xl"
                           style={{ background: 'var(--bg-elevated)' }}>
                        <img src={p.cover_url} alt={p.cover_alt || p.title}
                             className="w-full h-full object-cover" />
                      </div>
                    )}
                    {p.category && <span className="wp-chip">{p.category}</span>}
                    <h2 className="mt-4 text-xl font-semibold leading-snug">{p.title}</h2>
                    {p.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed line-clamp-3"
                         style={{ color: 'var(--muted)' }}>
                        {p.excerpt}
                      </p>
                    )}
                    <div className="mt-5 pt-5 border-t flex items-center justify-between text-xs"
                         style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                      <span>{p.author}</span>
                      <span>{p.read_time_min} min read</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter site={site} />
    </div>
  );
}

export async function generateMetadata() {
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();
  const site = await getSite(host);
  return {
    title: site ? `Blog — ${site.title}` : 'Blog',
    description: site?.description || '',
  };
}
