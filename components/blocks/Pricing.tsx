import type { PropsOf } from '@/types/blocks';

export default function Pricing({ props }: { props: PropsOf<'pricing'> }) {
    const tiers = props.tiers || [];
    return (
        <section className="wp-section">
            <div className="wp-container">
                <div className="max-w-3xl mx-auto text-center mb-14">
                    {props.eyebrow && <div className="wp-eyebrow mb-4 justify-center">{props.eyebrow}</div>}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{props.heading || 'Pricing'}</h2>
                    {props.subtitle && <p className="mt-5 text-lg" style={{ color: 'var(--muted)' }}>{props.subtitle}</p>}
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                    {tiers.map((t, i) => (
                        <div key={i} className={`relative rounded-2xl p-8 ${t.highlight ? 'ring-2' : ''}`}
                             style={{
                                 background: t.highlight ? 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 12%, var(--bg-elevated)), var(--bg-elevated))' : 'rgba(255,255,255,0.03)',
                                 border: t.highlight ? '1px solid color-mix(in srgb, var(--primary) 50%, transparent)' : '1px solid var(--border)',
                             }}>
                            {t.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                                     style={{ background: 'var(--primary)', color: 'var(--bg)' }}>POPULAR</div>
                            )}
                            <h3 className="text-xl font-bold">{t.name}</h3>
                            {t.description && <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{t.description}</p>}
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className={`text-4xl font-bold ${t.highlight ? 'wp-grad-text' : ''}`}>{t.price}</span>
                                {t.period && <span className="text-sm" style={{ color: 'var(--muted)' }}>{t.period}</span>}
                            </div>
                            <ul className="mt-8 space-y-3">
                                {(t.features || []).map((f, k) => (
                                    <li key={k} className="flex gap-3 text-sm">
                                        <span style={{ color: 'var(--primary)' }}>✓</span>
                                        <span style={{ color: 'var(--muted)' }}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            {t.cta_label && (
                                <a href={t.cta_href || '#'} className={`wp-btn mt-8 w-full ${t.highlight ? 'wp-btn-primary' : 'wp-btn-ghost'}`}>
                                    {t.cta_label}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
