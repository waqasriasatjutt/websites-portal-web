import type { PropsOf } from '@/types/blocks';

export default function FAQ({ props }: { props: PropsOf<'faq'> }) {
    const items = props.items || [];
    return (
        <section className="wp-section">
            <div className="wp-container">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div>
                        {props.eyebrow && <div className="wp-eyebrow mb-4">{props.eyebrow}</div>}
                        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">{props.heading || 'Questions'}</h2>
                        {props.subtitle && <p className="mt-5" style={{ color: 'var(--muted)' }}>{props.subtitle}</p>}
                    </div>
                    <div className="lg:col-span-2 space-y-3">
                        {items.map((it, i) => (
                            <details key={i} className="group rounded-xl border p-5 transition-all"
                                     style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                                <summary className="cursor-pointer flex items-center justify-between font-semibold list-none">
                                    <span>{it.q}</span>
                                    <span className="text-xl transition-transform group-open:rotate-45" style={{ color: 'var(--primary)' }}>+</span>
                                </summary>
                                <p className="mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>{it.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
