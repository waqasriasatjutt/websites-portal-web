import React from 'react';
import type { Block } from '@/lib/odoo';

/* ═══════════════════════════════════════════════════════════════
 * Block components — match production quality
 * ═══════════════════════════════════════════════════════════════ */

function Hero({ props }: { props: any }) {
  return (
    <section className="relative overflow-hidden wp-section" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 wp-grid-bg opacity-40"></div>
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-30 wp-float"
           style={{ background: 'var(--primary)' }}></div>
      <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full blur-3xl opacity-20"
           style={{ background: 'var(--accent)' }}></div>

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
          {props.stats && Array.isArray(props.stats) && props.stats.length > 0 && (
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
              {props.stats.map((s: any, i: number) => (
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

function Features({ props }: { props: any }) {
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
          {items.map((it: any, i: number) => (
            <div key={i} className="wp-card">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                   style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)' }}>
                {it.icon}
              </div>
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ props }: { props: any }) {
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

function FAQ({ props }: { props: any }) {
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
            {items.map((it: any, i: number) => (
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

function Testimonial({ props }: { props: any }) {
  const initials = (props.author || '').split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <section className="wp-section">
      <div className="wp-container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl leading-none opacity-30" style={{ color: 'var(--primary)', fontFamily: 'Georgia, serif' }}>&ldquo;</div>
          <blockquote className="-mt-8 text-2xl sm:text-3xl font-medium leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
            {props.quote}
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
                 style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--bg)' }}>
              {initials}
            </div>
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

function Pricing({ props }: { props: any }) {
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
          {tiers.map((t: any, i: number) => (
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
                {(t.features || []).map((f: string, k: number) => (
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

function PostList({ props }: { props: any }) {
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
          {posts.slice(0, 6).map((p: any) => (
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

function RichText({ props }: { props: any }) {
  return (
    <section className="wp-section">
      <div className="wp-container-narrow">
        <div className="wp-prose" dangerouslySetInnerHTML={{ __html: props.html || '' }} />
      </div>
    </section>
  );
}

function AdSlot({ props }: { props: any }) {
  if (!props.client) return null;
  return (
    <section className="my-10">
      <div className="wp-container-narrow">
        <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Advertisement</div>
        <ins className="adsbygoogle block min-h-[120px] rounded"
             style={{ display: 'block', textAlign: 'center' }}
             data-ad-client={props.client}
             data-ad-slot={props.slot}
             data-ad-format={props.format || 'auto'}
             data-full-width-responsive="true" />
      </div>
    </section>
  );
}

function Unknown({ type }: { type: string }) {
  return (
    <section className="wp-section">
      <div className="wp-container">
        <div className="rounded-lg border p-4 text-sm"
             style={{ borderColor: 'rgba(234, 179, 8, 0.3)', background: 'rgba(234, 179, 8, 0.1)', color: '#fde68a' }}>
          Unknown block type: <code>{type}</code> — add it to BlockRenderer or remove from page.
        </div>
      </div>
    </section>
  );
}

const REGISTRY: Record<string, React.FC<{ props: any }>> = {
  hero: Hero,
  features: Features,
  cta: CTA,
  faq: FAQ,
  testimonial: Testimonial,
  pricing: Pricing,
  post_list: PostList,
  richtext: RichText,
  adsense: AdSlot,
};

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map(b => {
        const Comp = REGISTRY[b.type];
        if (!Comp) return <Unknown key={b.id} type={b.type} />;
        return <Comp key={b.id} props={b.props || {}} />;
      })}
    </>
  );
}
