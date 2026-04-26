import type { PropsOf } from '@/types/blocks';

export default function Team({ props }: { props: PropsOf<'team'> }) {
  const items = props.items || [];
  return (
    <section className="wp-section">
      <div className="wp-container">
        {(props.eyebrow || props.heading) && (
          <div className="text-center mb-12">
            {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
            {props.heading && <h2 className="wp-heading mt-2">{props.heading}</h2>}
            {props.subtitle && <p className="wp-sub mt-3 max-w-2xl mx-auto">{props.subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((m, i) => (
            <article
              key={i}
              className="rounded-xl border p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
            >
              {m.photo ? (
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full grid place-items-center font-bold text-xl"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--bg)' }}
                >
                  {(m.name || '?').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <h3 className="mt-3 font-semibold">{m.name}</h3>
              {m.role && <div className="text-xs" style={{ color: 'var(--primary)' }}>{m.role}</div>}
              {m.bio && (
                <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{m.bio}</p>
              )}
              <div className="mt-3 flex gap-2">
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
                     className="text-xs" style={{ color: 'var(--muted)' }}>LinkedIn</a>
                )}
                {m.twitter && (
                  <a href={m.twitter} target="_blank" rel="noopener noreferrer"
                     className="text-xs" style={{ color: 'var(--muted)' }}>Twitter</a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
