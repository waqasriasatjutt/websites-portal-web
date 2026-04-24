import type { PropsOf } from '@/types/blocks';

export default function PostList({ props }: { props: PropsOf<'post_list'> }) {
    const posts = props.posts || [];
    return (
        <section className="wp-section">
            <div className="wp-container">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
                    <div>
                        {props.eyebrow && <div className="wp-eyebrow mb-4">{props.eyebrow}</div>}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{props.heading || 'Latest posts'}</h2>
                    </div>
                    <a href="/blog" className="wp-btn wp-btn-ghost">View all →</a>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.slice(0, 6).map(p => (
                        <a key={p.id} href={`/blog/${p.slug}`} className="wp-card block">
                            {p.cover_url && (
                                <div className="aspect-video -mx-7 -mt-7 mb-5 overflow-hidden rounded-t-2xl"
                                     style={{ background: 'var(--bg-elevated)' }}>
                                    <img src={p.cover_url} alt={p.cover_alt || p.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            {p.category && <span className="wp-chip">{p.category}</span>}
                            <h3 className="mt-4 text-lg font-semibold leading-snug">{p.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
                                {p.excerpt}
                            </p>
                            <div className="mt-5 flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
                                <span>{p.author}</span>
                                <span>{p.read_time_min} min read</span>
                            </div>
                        </a>
                    ))}
                    {posts.length === 0 && (
                        <p style={{ color: 'var(--muted)' }}>No posts yet.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
