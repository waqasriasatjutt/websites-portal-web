import { headers } from 'next/headers';
import { getPost, getPosts } from '@/lib/odoo';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { notFound } from 'next/navigation';

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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();

  const data = await getPost(host, slug);
  if (!data) notFound();

  const { site, post } = data;
  const related = await getPosts(host, { limit: 4 });
  const relatedPosts = (related?.posts || []).filter((p: any) => p.slug !== slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta?.description || post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.published_at || post.post_date,
    image: post.cover_url ? (site.domain.startsWith('http') ? '' : 'https://') + site.domain + post.cover_url : undefined,
    publisher: { '@type': 'Organization', name: site.title },
  };

  return (
    <div style={themeStyle(site.theme)}>
      <SiteHeader site={site} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <article>
          <header className="wp-section pb-10 relative overflow-hidden">
            <div className="absolute inset-0 wp-grid-bg opacity-20"></div>
            <div className="wp-container-narrow relative">
              <nav className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
                <a href="/" className="hover:text-[var(--primary)]">Home</a>
                <span className="mx-2">/</span>
                <a href="/blog" className="hover:text-[var(--primary)]">Blog</a>
              </nav>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.category && <span className="wp-chip">{post.category}</span>}
                {(post.tags || []).map((t: any) => (
                  <span key={t.slug} className="wp-chip" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                    {t.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{post.title}</h1>
              {post.subtitle && (
                <p className="mt-4 text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {post.subtitle}
                </p>
              )}
              <div className="mt-8 flex items-center gap-4 text-sm" style={{ color: 'var(--muted)' }}>
                <span>{post.author}</span>
                <span>·</span>
                <time>
                  {post.post_date
                    ? new Date(post.post_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </time>
                <span>·</span>
                <span>{post.read_time_min} min read</span>
              </div>
            </div>
          </header>

          {post.cover_url && (
            <div className="wp-container-narrow">
              <img
                src={post.cover_url}
                alt={post.cover_alt || post.title}
                className="w-full rounded-xl"
                style={{ maxHeight: 520, objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="wp-section pt-10">
            <div className="wp-container-narrow">
              <div className="wp-prose" dangerouslySetInnerHTML={{ __html: post.body_html || '' }} />
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section className="wp-section pt-0">
              <div className="wp-container">
                <h2 className="text-2xl font-bold mb-8">Keep reading</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((p: any) => (
                    <a key={p.id} href={`/blog/${p.slug}`} className="wp-card block">
                      {p.category && <span className="wp-chip">{p.category}</span>}
                      <h3 className="mt-4 font-semibold leading-snug">{p.title}</h3>
                      {p.excerpt && (
                        <p className="mt-3 text-sm line-clamp-2" style={{ color: 'var(--muted)' }}>
                          {p.excerpt}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </main>
      <SiteFooter site={site} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();
  const data = await getPost(host, slug);
  if (!data) return { title: 'Post not found' };
  return {
    title: data.post.meta?.title || data.post.title,
    description: data.post.meta?.description || data.post.excerpt,
  };
}
