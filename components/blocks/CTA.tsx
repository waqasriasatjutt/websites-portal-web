import type { PropsOf } from '@/types/blocks';

export default function CTA({ props }: { props: PropsOf<'cta'> }) {
    return (
        <section className="wp-section">
            <div className="wp-container">
                <div className="relative overflow-hidden rounded-3xl px-8 sm:px-16 py-16 sm:py-20"
                     style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, var(--bg-elevated)) 0%, var(--bg-elevated) 100%)',
                              border: '1px solid color-mix(in srgb, var(--primary) 35%, transparent)' }}>
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-40"
                         style={{ background: 'var(--primary)' }}></div>
                    <div className="relative max-w-2xl">
                        {props.eyebrow && <div className="wp-eyebrow mb-5">{props.eyebrow}</div>}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{props.heading}</h2>
                        {props.subtitle && <p className="mt-5 text-lg" style={{ color: 'var(--muted)' }}>{props.subtitle}</p>}
                        <div className="mt-8 flex flex-wrap gap-3">
                            {props.cta_label && (
                                <a href={props.cta_href || '#'} className="wp-btn wp-btn-primary wp-btn-lg">{props.cta_label} →</a>
                            )}
                            {props.secondary_label && (
                                <a href={props.secondary_href || '#'} className="wp-btn wp-btn-ghost wp-btn-lg">{props.secondary_label}</a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
