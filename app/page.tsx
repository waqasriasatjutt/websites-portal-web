import { headers } from 'next/headers';
import { getPage, getPosts, buildMetadata, buildJsonLd } from '@/lib/odoo';
import { substituteDeep, substituteString } from '@/lib/tokens';
import BlockRenderer from '@/components/blocks';
import type { AnyBlock } from '@/types/blocks';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import SiteScripts from '@/components/SiteScripts';
import { CustomHeadCss, CustomBodyStart, CustomBodyEnd } from '@/components/CustomCodeInject';

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

async function resolveHost() {
  const h = await headers();
  return (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();
}

export default async function HomePage() {
  const host = await resolveHost();
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
  const tokens = { ...(site.tokens || {}) };

  // Auto-inject latest posts into any post_list block(s) on the page.
  const needsPosts = page.blocks.some(b => b.type === 'post_list');
  let latestPosts: any[] = [];
  if (needsPosts) {
    const r = await getPosts(host, { limit: 6 });
    latestPosts = r?.posts || [];
  }
  const hydratedBlocks: AnyBlock[] = page.blocks.map(b => {
    const withPosts = b.type === 'post_list'
      ? { ...b, props: { ...(b.props || {}), posts: latestPosts } }
      : b;
    return { ...withPosts, props: substituteDeep(withPosts.props || {}, tokens) } as AnyBlock;
  });

  // Substitute tokens in chrome content
  const siteWithTokens = {
    ...site,
    title: substituteString(site.title || '', tokens as any) || site.title,
    tagline: substituteString(site.tagline || '', tokens as any),
    description: substituteString(site.description || '', tokens as any),
    menu: (site.menu || []).map(m => ({
      label: substituteString(m.label, tokens as any),
      href: substituteString(m.href, tokens as any),
    })),
    footer: site.footer ? {
      ...site.footer,
      about: substituteString(site.footer.about || '', tokens as any),
      copyright: substituteString(site.footer.copyright || '', tokens as any),
      credit: substituteString(site.footer.credit || '', tokens as any),
      columns: (site.footer.columns || []).map(c => ({
        title: substituteString(c.title, tokens as any),
        links: (c.links || []).map(l => ({
          label: substituteString(l.label, tokens as any),
          href: substituteString(l.href, tokens as any),
        })),
      })),
    } : undefined,
    header_cta: site.header_cta ? {
      label: substituteString(site.header_cta.label || '', tokens as any),
      href: substituteString(site.header_cta.href || '', tokens as any),
    } : undefined,
  };

  // JSON-LD schema (auto + page-specific override merged)
  const autoSchema = buildJsonLd(site, page, host, '/');
  const pageSchema = page.schema || null;
  const schemas = [autoSchema, pageSchema].filter(Boolean);

  return (
    <div lang={site.lang || 'en'} style={themeStyle(site.theme)}>
      <CustomHeadCss site={site} />
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <CustomBodyStart site={site} />
      <SiteHeader site={siteWithTokens as any} />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
        <BlockRenderer blocks={hydratedBlocks} />
      </main>
      <SiteFooter site={siteWithTokens as any} />
      <SiteScripts site={site} />
      <CustomBodyEnd site={site} />
    </div>
  );
}

export async function generateMetadata() {
  const host = await resolveHost();
  const data = await getPage(host, { home: true });
  if (!data) return { title: 'Site not found' };
  const t = (data.site.tokens || {}) as any;
  // Substitute tokens before generating metadata
  const meta = buildMetadata(
    {
      ...data.site,
      title: substituteString(data.site.title || '', t) || data.site.title,
      description: substituteString(data.site.description || '', t) || data.site.description,
    },
    {
      ...data.page,
      meta: {
        ...data.page.meta,
        title: substituteString(data.page.meta?.title || data.page.title || '', t),
        description: substituteString(data.page.meta?.description || '', t),
      },
    },
    host,
    '/'
  );
  return meta;
}
