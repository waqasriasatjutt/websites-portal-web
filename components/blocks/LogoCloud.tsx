import type { PropsOf } from '@/types/blocks';

export default function LogoCloud({ props }: { props: PropsOf<'logo_cloud'> }) {
  const items = props.items || [];
  const layout = props.layout || 'row';
  const grayscale = props.grayscale ?? true;

  const gridClass =
    layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center' :
    layout === 'marquee' ? 'flex overflow-hidden gap-12 items-center' :
    'flex flex-wrap items-center justify-center gap-x-10 gap-y-6';

  return (
    <section className="wp-section">
      <div className="wp-container">
        {props.heading && (
          <p className="text-center text-sm font-medium mb-6" style={{ color: 'var(--muted)' }}>{props.heading}</p>
        )}
        <div className={gridClass}>
          {items.map((it, i) => {
            const img = (
              <img
                src={it.image}
                alt={it.alt}
                loading="lazy"
                className={`h-8 w-auto ${grayscale ? 'opacity-70 hover:opacity-100 transition' : ''}`}
                style={grayscale ? { filter: 'grayscale(100%)' } : undefined}
              />
            );
            return (
              <div key={i} className="shrink-0">
                {it.href ? <a href={it.href} target="_blank" rel="noopener noreferrer">{img}</a> : img}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
