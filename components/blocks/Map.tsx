import type { PropsOf } from '@/types/blocks';

export default function MapBlock({ props }: { props: PropsOf<'map'> & { phone_label?: string; hours_label?: string } }) {
  const q = encodeURIComponent(props.map_query || '');
  const src = `https://www.google.com/maps?q=${q}&output=embed`;
  const height = parseInt(props.height_px || '400', 10) || 400;
  const phoneLabel = (props as any).phone_label || 'Phone';
  const hoursLabel = (props as any).hours_label || 'Hours';
  return (
    <section className="wp-section">
      <div className="wp-container">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6 lg:gap-10 items-stretch">
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            <iframe
              src={src}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: `${height}px`, border: 0 }}
              title={props.heading || 'Map'}
            />
          </div>
          <div
            className="rounded-2xl border p-6 flex flex-col"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
          >
            {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
            {props.heading && <h2 className="text-2xl font-bold mt-2">{props.heading}</h2>}
            {props.address_line && (
              <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>{props.address_line}</p>
            )}
            {props.phone && (
              <p className="mt-3 text-sm">
                <span style={{ color: 'var(--muted)' }}>{phoneLabel}: </span>
                <a href={`tel:${props.phone}`} className="hover:text-[var(--primary)]">{props.phone}</a>
              </p>
            )}
            {props.hours && (
              <div className="mt-3 text-sm whitespace-pre-line" style={{ color: 'var(--muted)' }}>
                <span style={{ color: 'var(--text)' }}>{hoursLabel}:</span>{'\n'}
                {props.hours}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
