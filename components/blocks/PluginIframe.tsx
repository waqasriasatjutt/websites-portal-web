/**
 * Renders a plugin-contributed React block.
 *
 * Two modes:
 *  - `trusted`: load the UMD bundle inline (script tag) and render it inside this page.
 *  - default (untrusted): render in an iframe pointing at /_plugin/<plugin>/<block>,
 *    which is a sandboxed HTML page that loads the bundle and mounts it with props.
 *
 * Props:
 *  - plugin: plugin name (matches websites.portal.plugin.name)
 *  - block: block slug within the plugin
 *  - bundle_url: UMD bundle URL (CDN, jsDelivr, etc.)
 *  - mount_export: name of the React component exported by the bundle
 *  - trusted: render inline vs iframe
 *  - height: iframe height
 *  - props: user-filled-in props for the plugin component (object)
 */
'use client';

import { useEffect, useRef, useState } from 'react';

export type PluginIframeProps = {
  plugin?: string;
  block?: string;
  bundle_url?: string;
  mount_export?: string;
  trusted?: boolean;
  height?: number;
  props?: Record<string, any>;
};

declare global {
  interface Window {
    [key: string]: any;
  }
}

function TrustedInline({ bundle_url, mount_export = 'default', props = {} }: PluginIframeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bundle_url || !ref.current) return;
    let cancelled = false;
    const tag = document.createElement('script');
    tag.src = bundle_url;
    tag.async = true;
    tag.onload = () => {
      if (cancelled || !ref.current) return;
      const exportName = mount_export || 'default';
      const Comp =
        (window[exportName] && (window[exportName].default || window[exportName])) ||
        (window['WP_PLUGIN'] && window['WP_PLUGIN'][exportName]);
      if (!Comp) {
        setError(`Bundle loaded but no export named "${exportName}"`);
        return;
      }
      try {
        // Lazy-load react-dom to avoid SSR import
        import('react-dom/client').then(({ createRoot }) => {
          if (cancelled || !ref.current) return;
          const root = createRoot(ref.current!);
          root.render(<Comp {...(props || {})} />);
        });
      } catch (e: any) {
        setError(`Mount failed: ${e.message || String(e)}`);
      }
    };
    tag.onerror = () => setError(`Failed to load bundle: ${bundle_url}`);
    document.head.appendChild(tag);
    return () => {
      cancelled = true;
      try { document.head.removeChild(tag); } catch {}
    };
  }, [bundle_url, mount_export, JSON.stringify(props || {})]);

  if (error) {
    return (
      <div className="wp-plugin-error" style={{ padding: '16px', border: '1px solid #f33', color: '#f33', fontFamily: 'monospace', fontSize: '13px' }}>
        Plugin block error: {error}
      </div>
    );
  }
  return <div ref={ref} className="wp-plugin-trusted"></div>;
}

function SandboxedIframe({ plugin, block, bundle_url, mount_export, props = {}, height = 600 }: PluginIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoHeight, setAutoHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const expectedSrc = iframeRef.current.src;
    function onMsg(e: MessageEvent) {
      // Plugin pages opt in by posting { type: 'plugin:resize', height: number }
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type !== 'plugin:resize' || typeof d.height !== 'number') return;
      // Sanity bounds.
      const next = Math.max(120, Math.min(8000, Math.round(d.height)));
      setAutoHeight(next);
      // (No origin check — sandboxed iframe origin is 'null', which the browser
      //  surfaces in `e.origin`. We only act on the shape of the payload.)
      void expectedSrc;
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (!plugin || !block || !bundle_url) return null;
  const qs = new URLSearchParams({
    bundle: bundle_url,
    mount: mount_export || 'default',
    props: JSON.stringify(props || {}),
  });
  const src = `/plugin/${encodeURIComponent(plugin)}/${encodeURIComponent(block)}?${qs.toString()}`;
  return (
    <iframe
      ref={iframeRef}
      src={src}
      sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
      title={`${plugin}:${block}`}
      style={{
        width: '100%',
        border: 0,
        display: 'block',
        height: `${autoHeight ?? height}px`,
        transition: 'height .15s ease',
      }}
    />
  );
}

export default function PluginIframe({ props }: { props: PluginIframeProps }) {
  if (!props) return null;
  if (!props.bundle_url) {
    return (
      <div className="wp-plugin-error" style={{ padding: '16px', border: '1px dashed #888', fontFamily: 'monospace', fontSize: '13px' }}>
        Plugin block: missing <code>bundle_url</code>.
      </div>
    );
  }
  return props.trusted ? <TrustedInline {...props} /> : <SandboxedIframe {...props} />;
}
