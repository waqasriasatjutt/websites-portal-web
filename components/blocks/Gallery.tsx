import type { PropsOf } from '@/types/blocks';

export default function Gallery({ props }: { props: PropsOf<'gallery'> }) {
  const layout = props.layout || 'grid_3';
  const items = props.items || [];

  const gridClass =
    layout === 'grid_4' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4' :
    layout === 'masonry' ? 'columns-2 md:columns-3 gap-4' :
    layout === 'carousel' ? 'flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4' :
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';

  return (
    <section className="wp-section">
      <div className="wp-container">
        {(props.eyebrow || props.heading) && (
          <div className="mb-8">
            {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
            {props.heading && <h2 className="wp-heading mt-2">{props.heading}</h2>}
          </div>
        )}
        <div className={gridClass}>
          {items.map((it, i) => {
            const inner = (
              <figure className={layout === 'masonry' ? 'mb-4 break-inside-avoid' : (layout === 'carousel' ? 'snap-start shrink-0 w-72 sm:w-96' : '')}>
                <div className="relative overflow-hidden rounded-lg" style={{ background: 'var(--bg-elevated)', aspectRatio: layout === 'masonry' ? 'auto' : '4/3' }}>
                  {it.image && (
                    <img
                      src={it.image}
                      alt={it.caption || ''}
                      loading="lazy"
                      className={'w-full ' + (layout === 'masonry' ? 'h-auto' : 'h-full object-cover')}
                    />
                  )}
                </div>
                {it.caption && (
                  <figcaption className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{it.caption}</figcaption>
                )}
              </figure>
            );
            return (
              <div key={i}>
                {it.href ? <a href={it.href} target="_blank" rel="noopener noreferrer">{inner}</a> : inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
