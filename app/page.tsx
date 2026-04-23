import { headers } from 'next/headers';
import { getPage } from '@/lib/odoo';

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

  let data: Awaited<ReturnType<typeof getPage>> = null;
  let debugError: string | null = null;
  try {
    data = await getPage(host, { home: true });
  } catch (err: any) {
    debugError = `Fetch error for host=${host}: ${err?.message || String(err)}`;
  }

  if (!data) {
    return (
      <div className="wp-container py-20">
        <h1 className="text-3xl font-bold">Site not found</h1>
        <p className="mt-4">No website for host <code>{host}</code>.</p>
        {debugError && <pre className="mt-4 text-xs">{debugError}</pre>}
      </div>
    );
  }

  // DEBUG: minimal render — prove the fetch data structure is valid.
  // If THIS renders, the problem is in BlockRenderer / SiteChrome / themeStyle.
  // If THIS still 500s, the problem is in how the returned data is shaped.
  const { site, page } = data;
  return (
    <div className="wp-container py-20" style={themeStyle(site.theme)}>
      <h1 className="text-3xl font-bold">{site.title}</h1>
      <p style={{ color: 'var(--muted)' }}>{site.tagline}</p>
      <p className="mt-6">Blocks loaded: {page.blocks.length}</p>
      <ul className="mt-3 list-disc pl-6">
        {page.blocks.map(b => <li key={b.id}>{b.type} ({Object.keys(b.props || {}).length} props)</li>)}
      </ul>
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
