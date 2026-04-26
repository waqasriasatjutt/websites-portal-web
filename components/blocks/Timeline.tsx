import type { PropsOf } from '@/types/blocks';

export default function Timeline({ props }: { props: PropsOf<'timeline'> }) {
  const items = props.items || [];
  const horizontal = (props.layout || 'vertical') === 'horizontal';

  return (
    <section className="wp-section">
      <div className="wp-container">
        {(props.eyebrow || props.heading) && (
          <div className="text-center mb-12">
            {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
            {props.heading && <h2 className="wp-heading mt-2">{props.heading}</h2>}
          </div>
        )}
        {horizontal ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((it, i) => (
              <div key={i} className="rounded-xl border p-5"
                   style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
                {it.icon && <div className="text-2xl mb-2">{it.icon}</div>}
                {it.date && <div className="wp-eyebrow">{it.date}</div>}
                <div className="mt-1 text-lg font-semibold">{it.title}</div>
                {it.description && (
                  <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{it.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ol className="relative max-w-2xl mx-auto" style={{ borderLeft: '2px solid var(--border)' }}>
            {items.map((it, i) => (
              <li key={i} className="ml-6 pb-8 last:pb-0 relative">
                <span
                  className="absolute -left-[33px] top-1 grid place-items-center w-6 h-6 rounded-full text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    color: 'var(--bg)',
                  }}
                >
                  {it.icon || (i + 1)}
                </span>
                {it.date && <div className="wp-eyebrow">{it.date}</div>}
                <div className="text-lg font-semibold mt-1">{it.title}</div>
                {it.description && (
                  <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{it.description}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
