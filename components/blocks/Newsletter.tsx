'use client';
import { useState } from 'react';
import type { PropsOf } from '@/types/blocks';

export default function Newsletter({ props }: { props: PropsOf<'newsletter'> }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const layout = props.layout || 'inline';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const host = window.location.host;
      await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, email }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const heroLayout = layout === 'hero';
  const stacked = layout === 'stacked';

  return (
    <section className={'wp-section ' + (heroLayout ? '' : '')}>
      <div className={'wp-container ' + (heroLayout ? '' : 'max-w-3xl')}>
        <div
          className={heroLayout ? 'rounded-2xl border p-10 text-center' : 'text-center'}
          style={heroLayout ? { borderColor: 'var(--border)', background: 'var(--bg-elevated)' } : undefined}
        >
          {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
          {props.heading && <h2 className="wp-heading mt-2">{props.heading}</h2>}
          {props.subtitle && <p className="wp-sub mt-3 max-w-xl mx-auto">{props.subtitle}</p>}

          {submitted ? (
            <p className="mt-6">{props.success_message || 'You\'re in. Check your inbox.'}</p>
          ) : (
            <form onSubmit={onSubmit}
                  className={'mt-6 mx-auto max-w-md ' + (stacked ? 'flex flex-col gap-3' : 'flex gap-2')}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={props.placeholder || 'you@example.com'}
                className="flex-1 px-3 py-2.5 rounded-md text-sm border outline-none focus:border-[var(--primary)]"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="wp-btn wp-btn-primary"
              >
                {submitting ? 'Submitting…' : (props.submit_label || 'Subscribe')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
