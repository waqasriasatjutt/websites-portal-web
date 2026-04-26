import { headers } from 'next/headers';
import { getPage, buildMetadata, buildJsonLd } from '@/lib/odoo';
import { substituteDeep, substituteString } from '@/lib/tokens';
import BlockRenderer from '@/components/blocks';
import type { AnyBlock } from '@/types/blocks';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import SiteScripts from '@/components/SiteScripts';
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
    ['--font-body' as any]: `'${theme.fonts?.body || 'Inter'}', system-ui, sans-serif`,
    ['--font-display' as any]: `'${theme.fonts?.display || 'Space Grotesk'}', Inter, system-ui, sans-serif`,
  };
}

async function resolveHost() {
  const h = await headers();
  return (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await resolveHost();
  const data = await getPage(host, { slug });
  if (!data) notFound();

  const { site, page } = data;
  const tokens = (site.tokens || {}) as any;
  const hydratedBlocks: AnyBlock[] = page.blocks.map(b => ({
    ...b,
    props: substituteDeep(b.props || {}, tokens),
  }) as AnyBlock);

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

  const autoSchema = buildJsonLd(site, page, host, `/${slug}`);
  const pageSchema = page.schema || null;
  const schemas = [autoSchema, pageSchema].filter(Boolean);

  return (
    <div lang={site.lang || 'en'} style={themeStyle(site.theme)}>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <SiteHeader site={siteWithTokens as any} />
      <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <BlockRenderer blocks={hydratedBlocks} />
      </main>
      <SiteFooter site={siteWithTokens as any} />
      <SiteScripts site={site} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await resolveHost();
  const data = await getPage(host, { slug });
  if (!data) return { title: 'Page not found' };
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
    `/${slug}`
  );
  return meta;
}
