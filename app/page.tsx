import { headers } from 'next/headers';
import { getPage, getPosts, buildMetadata, buildJsonLd } from '@/lib/odoo';
import { substituteDeep, substituteString } from '@/lib/tokens';
import BlockRenderer from '@/components/blocks';
import type { AnyBlock } from '@/types/blocks';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import SiteScripts from '@/components/SiteScripts';
import {
  ThemeHeadCss, ThemeBodyEnd,
  CustomHeadCss, CustomBodyStart, CustomBodyEnd,
} from '@/components/CustomCodeInject';

export const runtime = 'edge';
export const revalidate = 300;

function themeStyle(theme: any): React.CSSProperties {
  const c = theme?.colors || {};
  const f = theme?.fonts || {};
  const primary = c.primary || '#00d4ff';
  const accent = c.accent || '#9eff00';
  const bg = c.bg || '#0a0e27';
  const text = c.text || '#f8fafc';
  const muted = c.muted || '#94a3b8';
  const fontBody = `'${f.body || 'Inter'}', system-ui, sans-serif`;
  const fontDisplay = `'${f.display || 'Space Grotesk'}', Inter, system-ui, sans-serif`;
  return {
    ['--primary' as any]: primary, ['--wp-primary' as any]: primary,
    ['--accent' as any]: accent, ['--wp-accent' as any]: accent,
    ['--bg' as any]: bg, ['--wp-bg' as any]: bg,
    ['--text' as any]: text, ['--wp-text' as any]: text,
    ['--muted' as any]: muted, ['--wp-muted' as any]: muted,
    ['--font-body' as any]: fontBody, ['--wp-font-body' as any]: fontBody,
    ['--font-display' as any]: fontDisplay, ['--wp-font-display' as any]: fontDisplay,
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
  const tokens = { ...(site.tokens || {}) } as any;

  const isVisual = page.editor_mode === 'visual' && (page.html_body || '').trim().length > 0;

  // Auto-inject latest posts into any post_list block(s) on the page (blocks mode only).
  const needsPosts = !isVisual && page.blocks.some(b => b.type === 'post_list');
  let latestPosts: any[] = [];
  if (needsPosts) {
    const r = await getPosts(host, { limit: 6 });
    latestPosts = r?.posts || [];
  }
  const hydratedBlocks: AnyBlock[] = isVisual ? [] : page.blocks.map(b => {
    const withPosts = b.type === 'post_list'
      ? { ...b, props: { ...(b.props || {}), posts: latestPosts } }
      : b;
    return { ...withPosts, props: substituteDeep(withPosts.props || {}, tokens) } as AnyBlock;
  });

  const siteWithTokens = {
    ...site,
    title: substituteString(site.title || '', tokens) || site.title,
    tagline: substituteString(site.tagline || '', tokens),
    description: substituteString(site.description || '', tokens),
    menu: (site.menu || []).map(m => ({
      label: substituteString(m.label, tokens),
      href: substituteString(m.href, tokens),
    })),
    footer: site.footer ? {
      ...site.footer,
      about: substituteString(site.footer.about || '', tokens),
      copyright: substituteString(site.footer.copyright || '', tokens),
      credit: substituteString(site.footer.credit || '', tokens),
      columns: (site.footer.columns || []).map(c => ({
        title: substituteString(c.title, tokens),
        links: (c.links || []).map(l => ({
          label: substituteString(l.label, tokens),
          href: substituteString(l.href, tokens),
        })),
      })),
    } : undefined,
    header_cta: site.header_cta ? {
      label: substituteString(site.header_cta.label || '', tokens),
      href: substituteString(site.header_cta.href || '', tokens),
    } : undefined,
  };

  const autoSchema = buildJsonLd(site, page, host, '/');
  const pageSchema = page.schema || null;
  const schemas = [autoSchema, pageSchema].filter(Boolean);

  return (
    <div lang={site.lang || 'en'} style={themeStyle(site.theme)}>
      <ThemeHeadCss site={site} />
      <CustomHeadCss site={site} />
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <CustomBodyStart site={site} />
      {!isVisual && <SiteHeader site={siteWithTokens as any} />}
      {isVisual ? (
        <main style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
          {page.css_body && <style dangerouslySetInnerHTML={{ __html: page.css_body }} data-source="visual-page-css" />}
          <div dangerouslySetInnerHTML={{ __html: substituteString(page.html_body || '', tokens) }} />
        </main>
      ) : (
        <main style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
          <BlockRenderer blocks={hydratedBlocks} />
        </main>
      )}
      {!isVisual && <SiteFooter site={siteWithTokens as any} />}
      <SiteScripts site={site} />
      <ThemeBodyEnd site={site} />
      <CustomBodyEnd site={site} />
    </div>
  );
}

export async function generateMetadata() {
  const host = await resolveHost();
  const data = await getPage(host, { home: true });
  if (!data) return { title: 'Site not found' };
  const t = (data.site.tokens || {}) as any;
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
