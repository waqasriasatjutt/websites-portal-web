'use client';
/**
 * Example community block — Before/After image slider.
 * Drag to compare two images. Pure React + DOM, no extra deps.
 */
import { useRef, useState } from 'react';
import type { BlockProps, SchemaField } from '../types';

interface Props {
  heading?: string;
  before_image: string;
  after_image: string;
  before_label?: string;
  after_label?: string;
}

export const slug = 'before_after';
export const name = 'Before / After slider';
export const icon = '🔄';
export const category = 'media' as const;
export const schema: SchemaField[] = [
  { key: 'heading', label: 'Heading', type: 'text' },
  { key: 'before_image', label: 'Before image', type: 'image', required: true },
  { key: 'after_image', label: 'After image', type: 'image', required: true },
  { key: 'before_label', label: 'Before label', type: 'text', placeholder: 'Before' },
  { key: 'after_label', label: 'After label', type: 'text', placeholder: 'After' },
];
export const defaultProps: Props = {
  heading: '',
  before_image: '',
  after_image: '',
  before_label: 'Before',
  after_label: 'After',
};

export default function BeforeAfter({ props }: BlockProps<Props>) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);

  const onMove = (e: React.PointerEvent | React.TouchEvent) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const x = (e as any).clientX ?? (e as any).touches?.[0]?.clientX ?? 0;
    const p = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
    setPct(p);
  };

  return (
    <section className="wp-section">
      <div className="wp-container">
        {props.heading && <h2 className="wp-heading text-center mb-6">{props.heading}</h2>}
        <div
          ref={wrapRef}
          className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border select-none"
          style={{ borderColor: 'var(--border)', aspectRatio: '16/10', cursor: 'ew-resize' }}
          onPointerMove={onMove as any}
          onTouchMove={onMove as any}
        >
          {props.after_image && (
            <img src={props.after_image} alt={props.after_label}
                 className="absolute inset-0 w-full h-full object-cover" />
          )}
          {props.before_image && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${pct}%` }}
            >
              <img src={props.before_image} alt={props.before_label}
                   className="absolute inset-0 w-full h-full object-cover"
                   style={{ width: `${(100 / pct) * 100}%`, maxWidth: 'none' }}
                   onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md grid place-items-center text-gray-700 text-xs font-bold">
              ⇔
            </div>
          </div>
          {props.before_label && (
            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {props.before_label}
            </div>
          )}
          {props.after_label && (
            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {props.after_label}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
