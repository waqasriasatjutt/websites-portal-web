'use client';
import { useState } from 'react';
import type { PropsOf } from '@/types/blocks';

export default function ContactForm({ props }: { props: PropsOf<'contact_form'> }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fields = props.fields || [];
  const submitLabel = props.submit_label || 'Send message';
  const successMessage = props.success_message || 'Thanks! We\'ll get back to you soon.';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    fields.forEach(f => { payload[f.key] = String(fd.get(f.key) || ''); });

    try {
      const host = window.location.host;
      const r = await fetch(`/api/forms/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Site-Host': host },
        body: JSON.stringify({ host, fields: payload }),
      });
      if (!r.ok) throw new Error('Submission failed');
      setSubmitted(true);
      if (props.redirect_url) {
        setTimeout(() => { window.location.href = props.redirect_url!; }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="wp-section">
      <div className="wp-container max-w-2xl">
        {(props.eyebrow || props.heading) && (
          <div className="text-center mb-8">
            {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
            {props.heading && <h2 className="wp-heading mt-3">{props.heading}</h2>}
            {props.subtitle && <p className="wp-sub mt-3">{props.subtitle}</p>}
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-lg text-center" style={{ background: 'var(--bg-elevated)', color: 'var(--text)' }}>
            {successMessage}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label htmlFor={`f_${f.key}`} className="text-sm font-medium">
                  {f.label}{f.required ? ' *' : ''}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={`f_${f.key}`}
                    name={f.key}
                    rows={4}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="px-3 py-2.5 rounded-md text-sm border outline-none focus:border-[var(--primary)]"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                ) : f.type === 'select' ? (
                  <select
                    id={`f_${f.key}`}
                    name={f.key}
                    required={f.required}
                    className="px-3 py-2.5 rounded-md text-sm border outline-none focus:border-[var(--primary)]"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <option value="">{f.placeholder || 'Select...'}</option>
                    {(f.options || '').split('\n').filter(Boolean).map((opt, i) => (
                      <option key={i} value={opt.trim()}>{opt.trim()}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`f_${f.key}`}
                    name={f.key}
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="px-3 py-2.5 rounded-md text-sm border outline-none focus:border-[var(--primary)]"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                )}
              </div>
            ))}
            {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="wp-btn wp-btn-primary w-full sm:w-auto"
            >
              {submitting ? 'Sending…' : submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
