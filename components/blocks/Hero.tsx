import type { PropsOf } from '@/types/blocks';

export default function Hero({ props }: { props: PropsOf<'hero'> }) {
    return (
        <section className="relative overflow-hidden wp-section" style={{ background: 'var(--bg)' }}>
            <div className="absolute inset-0 wp-grid-bg opacity-40"></div>
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-30 wp-float"
                 style={{ background: 'var(--primary)' }}></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full blur-3xl opacity-20"
                 style={{ background: 'var(--accent)' }}></div>

            {props.cover_image && (
                <div className="absolute inset-0 pointer-events-none">
                    <img src={props.cover_image} alt=""
                         className="w-full h-full object-cover opacity-25" />
                    <div className="absolute inset-0"
                         style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, var(--bg) 90%)' }}></div>
                </div>
            )}

            <div className="wp-container relative">
                <div className="max-w-4xl">
                    {props.eyebrow && <div className="wp-eyebrow mb-8">{props.eyebrow}</div>}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05]">
                        {props.heading_before && <span>{props.heading_before} </span>}
                        <span className="wp-grad-text">{props.heading}</span>
                        {props.heading_after && <span> {props.heading_after}</span>}
                    </h1>
                    {props.subtitle && (
                        <p className="mt-6 text-lg sm:text-xl max-w-3xl leading-relaxed" style={{ color: 'var(--muted)' }}>
                            {props.subtitle}
                        </p>
                    )}
                    <div className="mt-10 flex flex-wrap gap-3">
                        {props.cta_label && (
                            <a href={props.cta_href || '#'} className="wp-btn wp-btn-primary wp-btn-lg">
                                {props.cta_label} <span className="ml-1">→</span>
                            </a>
                        )}
                        {props.secondary_label && (
                            <a href={props.secondary_href || '#'} className="wp-btn wp-btn-ghost wp-btn-lg">
                                {props.secondary_label}
                            </a>
                        )}
                    </div>
                    {props.stats && props.stats.length > 0 && (
                        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
                            {props.stats.map((s, i) => (
                                <div key={i}>
                                    <div className="text-3xl sm:text-4xl font-bold wp-grad-text">{s.value}</div>
                                    <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
