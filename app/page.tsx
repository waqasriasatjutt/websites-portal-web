import { headers } from 'next/headers';
import { getPage, getPosts } from '@/lib/odoo';
import BlockRenderer from '@/components/BlockRenderer';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';

export const runtime = 'edge';
export const revalidate = 300;

function themeStyle(theme: any): React.CSSProperties {
  if (!theme) return {};
  return {
    ['--primary' as any]: theme.colors?.primary || '#00d4ff',
    ['--accent' as any]: theme.colors?.accent || '#9eff00',
    ['--bg' as any]: theme.colors?.bg || '#0a0e27',
    ['--text' as any]: theme.colors?.text || '#f8fafc',
    ['--muted' as any]: theme.colors?.muted || '#94a3b8',
    ['--font-body' as any]: `'${theme.fonts?.body || 'Inter'}', system-ui, sans-serif`,
    ['--font-display' as any]: `'${theme.fonts?.display || 'Space Grotesk'}', Inter, system-ui, sans-serif`,
  };
}

export default async function HomePage() {
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();

  const data = await getPage(host, { home: true });
  if (!data) {
    return (
      <div className="wp-container py-20">
        <h1 className="text-3xl font-bold">Site not found</h1>
        <p className="mt-4">No website configured for host <code>{host}</code>. Create it in Odoo → Websites Portal → Sites.</p>
      </div>
    );
  }
  const { site, page } = data;

  // Auto-inject latest posts into any post_list block(s) on the page.
  // Editors leave `props.posts` empty in Odoo; we populate it at render time
  // so the block always shows fresh content without the editor maintaining it.
  const needsPosts = page.blocks.some(b => b.type === 'post_list');
  let latestPosts: any[] = [];
  if (needsPosts) {
    const r = await getPosts(host, { limit: 6 });
    latestPosts = r?.posts || [];
  }
  const hydratedBlocks = page.blocks.map(b =>
    b.type === 'post_list'
      ? { ...b, props: { ...(b.props || {}), posts: latestPosts } }
      : b
  );

  return (
    <div style={themeStyle(site.theme)}>
      <SiteHeader site={site} />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
        <BlockRenderer blocks={hydratedBlocks} />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}

export async function generateMetadata() {
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();
  const data = await getPage(host, { home: true });
  if (!data) return { title: 'Site not found' };
  return {
    title: data.page.meta.title || data.site.title,
    description: data.page.meta.description || data.site.description,
  };
}
