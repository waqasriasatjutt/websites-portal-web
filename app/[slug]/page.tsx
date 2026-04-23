import { headers } from 'next/headers';
import { getPage } from '@/lib/odoo';
import BlockRenderer from '@/components/BlockRenderer';
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

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();

  const data = await getPage(host, { slug });
  if (!data) notFound();

  const { site, page } = data;
  return (
    <div style={themeStyle(site.theme)}>
      <SiteHeader site={site} />
      <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <BlockRenderer blocks={page.blocks} />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();
  const data = await getPage(host, { slug });
  if (!data) return { title: 'Page not found' };
  return {
    title: data.page.meta.title || data.site.title,
    description: data.page.meta.description || data.site.description,
  };
}
