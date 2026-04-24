import type { PropsOf } from '@/types/blocks';

export default function Features({ props }: { props: PropsOf<'features'> }) {
    const items = props.items || [];
    return (
        <section className="wp-section">
            <div className="wp-container">
                {(props.eyebrow || props.heading) && (
                    <div className="max-w-3xl mb-14">
                        {props.eyebrow && <div className="wp-eyebrow mb-4">{props.eyebrow}</div>}
                        {props.heading && (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{props.heading}</h2>
                        )}
                        {props.subtitle && <p className="mt-5 text-lg" style={{ color: 'var(--muted)' }}>{props.subtitle}</p>}
                    </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((it, i) => (
                        <div key={i} className="wp-card">
                            {it.image ? (
                                <div className="w-12 h-12 rounded-xl overflow-hidden mb-5 flex items-center justify-center"
                                     style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)' }}>
                                    <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                                     style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                                              border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)' }}>
                                    {it.icon}
                                </div>
                            )}
                            <h3 className="text-lg font-semibold">{it.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{it.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
