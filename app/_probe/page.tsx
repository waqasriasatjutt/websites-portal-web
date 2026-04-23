import { headers } from 'next/headers';

export const runtime = 'edge';

export default async function ProbePage() {
  const h = await headers();
  const host = (h.get('host') || '').split(':')[0].toLowerCase();

  let fetchOk = false;
  let fetchStatus: number | null = null;
  let fetchBody = '';
  let fetchError: string | null = null;
  const odooUrl = process.env.ODOO_URL || '';

  try {
    const res = await fetch(`${odooUrl}/wp/api/site?host=${encodeURIComponent(host)}`, { cache: 'no-store' });
    fetchStatus = res.status;
    fetchOk = res.ok;
    fetchBody = (await res.text()).slice(0, 400);
  } catch (err: any) {
    fetchError = err?.message || String(err);
  }

  return (
    <pre style={{ padding: 24, fontFamily: 'monospace', background: '#fff', color: '#000' }}>
      {JSON.stringify({ host, ODOO_URL: odooUrl, fetchOk, fetchStatus, fetchError, fetchBody }, null, 2)}
    </pre>
  );
}
