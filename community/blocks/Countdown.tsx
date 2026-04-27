'use client';
/**
 * Example community block — Countdown timer.
 *
 * Demonstrates the contribution shape:
 *   1. Export `slug`, `name`, `schema`, `defaultProps`, `icon`, `category`
 *   2. Default-export the component as `default`
 *
 * Auto-registered by `community/blocks/index.ts` once a developer imports
 * it. Block picker in Odoo will show it once a matching record is added to
 * the catalog (or run `python tools/sync-blocks.py` once we add that).
 */
import { useEffect, useState } from 'react';
import type { BlockProps, SchemaField } from '../types';

interface CountdownProps {
  eyebrow?: string;
  heading: string;
  target_iso: string;
  finished_message?: string;
  show_seconds?: boolean;
}

export const slug = 'countdown';
export const name = 'Countdown';
export const icon = '⏱️';
export const category = 'content';
export const schema: SchemaField[] = [
  { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
  { key: 'heading', label: 'Heading', type: 'text', required: true },
  { key: 'target_iso', label: 'Target date (ISO)', type: 'text', required: true,
    placeholder: '2026-12-31T23:59:59Z',
    help: 'Use full ISO format. Example: 2026-12-31T23:59:59Z' },
  { key: 'finished_message', label: 'Message after target', type: 'text',
    placeholder: 'We\'re live!' },
  { key: 'show_seconds', label: 'Show seconds', type: 'boolean' },
];
export const defaultProps: CountdownProps = {
  heading: 'Launching soon',
  target_iso: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  show_seconds: true,
};

function diff(targetMs: number) {
  const now = Date.now();
  const ms = Math.max(0, targetMs - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { ms, days, hours, minutes, seconds };
}

export default function Countdown({ props }: BlockProps<CountdownProps>) {
  const target = props.target_iso ? Date.parse(props.target_iso) : 0;
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    if (!target || t.ms <= 0) return;
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target, t.ms]);

  const finished = t.ms <= 0;

  return (
    <section className="wp-section">
      <div className="wp-container text-center">
        {props.eyebrow && <div className="wp-eyebrow">{props.eyebrow}</div>}
        <h2 className="wp-heading mt-2">{props.heading}</h2>
        {finished ? (
          <p className="mt-6 text-2xl">{props.finished_message || "We're live!"}</p>
        ) : (
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Days', val: t.days },
              { label: 'Hours', val: t.hours },
              { label: 'Minutes', val: t.minutes },
              ...(props.show_seconds ? [{ label: 'Seconds', val: t.seconds }] : []),
            ].map((u, i) => (
              <div
                key={i}
                className="rounded-lg border p-4"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-elevated)',
                }}
              >
                <div className="text-3xl sm:text-5xl font-bold tabular-nums"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  {String(u.val).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-widest mt-2"
                     style={{ color: 'var(--muted)' }}>{u.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
