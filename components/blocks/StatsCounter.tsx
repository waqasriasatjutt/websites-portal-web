import type { PropsOf } from '@/types/blocks';

export default function StatsCounter({ props }: { props: PropsOf<'stats_counter'> }) {
  const items = props.items || [];
  return (
    <section className="wp-section">
      <div className="wp-container">
        {(props.eyebrow || props.heading) && (
          <div className="text-center mb-12">
            {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
            {props.heading && <h2 className="wp-heading mt-2">{props.heading}</h2>}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          {items.map((s, i) => (
            <div key={i} className="text-center">
              {s.icon && <div className="text-3xl mb-2">{s.icon}</div>}
              <div className="text-3xl sm:text-5xl font-bold tracking-tight"
                   style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {s.value}
              </div>
              <div className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
