import React from 'react';
import type { Block } from '@/lib/odoo';

function Hero({ props }: { props: any }) {
  return (
    <section className="py-20 sm:py-28 lg:py-32 wp-container">
      {props.eyebrow && <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{props.eyebrow}</div>}
      <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight">
        <span className="wp-grad-text">{props.heading}</span>
      </h1>
      {props.subtitle && <p className="mt-6 text-lg max-w-3xl" style={{ color: 'var(--muted)' }}>{props.subtitle}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {props.cta_label && <a href={props.cta_href || '#'} className="wp-btn wp-btn-primary">{props.cta_label}</a>}
        {props.secondary_label && <a href={props.secondary_href || '#'} className="wp-btn wp-btn-ghost">{props.secondary_label}</a>}
      </div>
    </section>
  );
}

function Features({ props }: { props: any }) {
  const items = props.items || [];
  return (
    <section className="py-20 wp-container">
      {props.heading && <h2 className="text-3xl sm:text-4xl font-bold mb-12">{props.heading}</h2>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it: any, i: number) => (
          <div key={i} className="rounded-2xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            <div className="text-3xl">{it.icon}</div>
            <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{it.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA({ props }: { props: any }) {
  return (
    <section className="py-20 wp-container">
      <div className="rounded-3xl p-10 sm:p-16 text-center" style={{ background: 'linear-gradient(135deg, var(--primary), rgba(0,212,255,0.2))' }}>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--bg)]">{props.heading}</h2>
        {props.subtitle && <p className="mt-4 text-lg text-[var(--bg)] opacity-90">{props.subtitle}</p>}
        {props.cta_label && <a href={props.cta_href || '#'} className="wp-btn mt-8" style={{ background: 'var(--bg)', color: 'var(--text)' }}>{props.cta_label}</a>}
      </div>
    </section>
  );
}

function FAQ({ props }: { props: any }) {
  const items = props.items || [];
  return (
    <section className="py-20 wp-container">
      {props.heading && <h2 className="text-3xl sm:text-4xl font-bold mb-10">{props.heading}</h2>}
      <div className="space-y-3 max-w-3xl">
        {items.map((it: any, i: number) => (
          <details key={i} className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <summary className="cursor-pointer font-semibold">{it.q}</summary>
            <p className="mt-3" style={{ color: 'var(--muted)' }}>{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Testimonial({ props }: { props: any }) {
  return (
    <section className="py-20 wp-container text-center max-w-3xl mx-auto">
      <blockquote className="text-2xl sm:text-3xl font-medium leading-relaxed">"{props.quote}"</blockquote>
      <div className="mt-6 font-semibold">{props.author}{props.role && <span style={{ color: 'var(--muted)' }}> · {props.role}</span>}</div>
    </section>
  );
}

function Pricing({ props }: { props: any }) {
  const tiers = props.tiers || [];
  return (
    <section className="py-20 wp-container">
      {props.heading && <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">{props.heading}</h2>}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((t: any, i: number) => (
          <div key={i} className="rounded-2xl border p-8" style={{ borderColor: t.highlight ? 'var(--primary)' : 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="text-xl font-bold">{t.name}</h3>
            <div className="mt-4 text-4xl font-bold wp-grad-text">{t.price}<span className="text-base" style={{ color: 'var(--muted)' }}>{t.period}</span></div>
            <ul className="mt-6 space-y-2 text-sm">{(t.features || []).map((f: string, k: number) => <li key={k}>✓ {f}</li>)}</ul>
            {t.cta_label && <a href={t.cta_href || '#'} className="wp-btn wp-btn-primary mt-6 w-full">{t.cta_label}</a>}
          </div>
        ))}
      </div>
    </section>
  );
}

function PostList({ props }: { props: any }) {
  // Placeholder — populated server-side elsewhere; shows the heading only here
  return (
    <section className="py-20 wp-container">
      {props.heading && <h2 className="text-3xl sm:text-4xl font-bold mb-6">{props.heading}</h2>}
      <p style={{ color: 'var(--muted)' }}>Latest posts are shown on <a className="underline" href="/blog">/blog</a>.</p>
    </section>
  );
}

function RichText({ props }: { props: any }) {
  return (
    <section className="py-16 wp-container">
      <div className="prose prose-invert max-w-3xl" dangerouslySetInnerHTML={{ __html: props.html || '' }} />
    </section>
  );
}

function Unknown({ type }: { type: string }) {
  return (
    <section className="py-10 wp-container">
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm">Unknown block type: <code>{type}</code></div>
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
