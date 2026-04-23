import { headers } from 'next/headers';
import { getPage } from '@/lib/odoo';
import BlockRenderer from '@/components/BlockRenderer';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';

export const runtime = 'edge';
export const revalidate = 300;

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(':')[0].toLowerCase();

  const data = await getPage(host, { slug });
  if (!data) {
    return <div className="wp-container py-20"><h1>Page not found</h1></div>;
  }
  const { site, page } = data;

  const style: React.CSSProperties = {
    ['--primary' as any]: site.theme?.colors?.primary || '#00d4ff',
    ['--accent' as any]: site.theme?.colors?.accent || '#9eff00',
    ['--bg' as any]: site.theme?.colors?.bg || '#0a0e27',
    ['--text' as any]: site.theme?.colors?.text || '#f8fafc',
    ['--muted' as any]: site.theme?.colors?.muted || '#94a3b8',
  };

  return (
    <div style={style}>
      <SiteHeader site={site} />
      <main><BlockRenderer blocks={page.blocks} /></main>
      <SiteFooter site={site} />
    </div>
  );
}
