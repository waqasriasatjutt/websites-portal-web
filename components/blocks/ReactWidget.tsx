import type { PropsOf } from '@/types/blocks';

/**
 * Slot for an external React widget. The widget runtime is loaded inside an
 * iframe sandbox to keep CSS and JS scoped to the widget. Widget code is
 * delivered by the renderer's `/widgets/<slot_name>.html` route (built by
 * a separate sidecar — see dev contribution docs).
 *
 * Until widgets exist, we render a clearly-marked placeholder.
 */
export default function ReactWidget({ props }: { props: PropsOf<'react_widget'> }) {
  const slot = props.slot_name || 'unnamed';
  const minHeight = parseInt(props.min_height || '400', 10) || 400;
  const widgetUrl = `/widgets/${encodeURIComponent(slot)}.html`;
  const placeholder = props.placeholder_text || `Widget slot "${slot}" — not yet published.`;

  // Pass props to the iframe via query string (URL-safe limit ~2KB)
  const propsJson = props.props_json || '';
  const fullUrl = propsJson
    ? `${widgetUrl}?props=${encodeURIComponent(propsJson)}`
    : widgetUrl;

  return (
    <section className="wp-section">
      <div className="wp-container">
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <iframe
            src={fullUrl}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            title={`React widget: ${slot}`}
            style={{ width: '100%', minHeight, border: 0, background: 'var(--bg-elevated)' }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
          <code>react_widget</code> slot: <strong>{slot}</strong> —{' '}
          {placeholder.includes('Widget slot') ? placeholder : (
            <>Connected. Edit at <code>/widgets/{slot}.html</code>.</>
          )}
        </p>
      </div>
    </section>
  );
}
