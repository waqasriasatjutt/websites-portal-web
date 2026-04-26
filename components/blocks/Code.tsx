'use client';
import { useState } from 'react';
import type { PropsOf } from '@/types/blocks';

export default function Code({ props }: { props: PropsOf<'code'> }) {
  const [copied, setCopied] = useState(false);
  const lang = props.language || 'plain';
  const onCopy = () => {
    navigator.clipboard.writeText(props.code || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <section className="wp-section">
      <div className="wp-container max-w-4xl">
        {props.heading && <h3 className="text-xl font-bold mb-4">{props.heading}</h3>}
        <div
          className="relative rounded-lg overflow-hidden border"
          style={{ borderColor: 'var(--border)', background: '#0d1117' }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b text-xs"
               style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
            <span>{lang}</span>
            <button onClick={onCopy} className="hover:text-white transition">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 text-sm" style={{ color: '#e6edf3' }}>
            <code>{props.code}</code>
          </pre>
        </div>
        {props.caption && (
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{props.caption}</p>
        )}
      </div>
    </section>
  );
}
