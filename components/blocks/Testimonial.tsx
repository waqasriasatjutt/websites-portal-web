import type { PropsOf } from '@/types/blocks';

export default function Testimonial({ props }: { props: PropsOf<'testimonial'> }) {
    const initials = (props.author || '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
    return (
        <section className="wp-section">
            <div className="wp-container">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-7xl leading-none opacity-30" style={{ color: 'var(--primary)', fontFamily: 'Georgia, serif' }}>&ldquo;</div>
                    <blockquote className="-mt-8 text-2xl sm:text-3xl font-medium leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                        {props.quote}
                    </blockquote>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        {props.author_avatar ? (
                            <img src={props.author_avatar} alt={props.author}
                                 className="w-14 h-14 rounded-full object-cover"
                                 style={{ border: '2px solid color-mix(in srgb, var(--primary) 40%, transparent)' }} />
                        ) : (
                            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
                                 style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--bg)' }}>
                                {initials}
                            </div>
                        )}
                        <div className="text-left">
                            <div className="font-semibold">{props.author}</div>
                            {props.role && <div className="text-sm" style={{ color: 'var(--muted)' }}>{props.role}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
