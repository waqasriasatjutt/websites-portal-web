'use client';
/**
 * Lightweight error boundary for block rendering.
 *
 * If a block throws (bad props, missing field, network blip in a hook), we
 * surface a compact warning instead of 500-ing the whole page. In production
 * we hide details from the visitor; in dev we show the message for debugging.
 */
import { Component, ReactNode } from 'react';

type Props = { children: ReactNode; label?: string };
type State = { hasError: boolean; message?: string };

export class BlockErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any): State {
    return { hasError: true, message: err?.message || String(err) };
  }

  componentDidCatch(err: any) {
    // Visible in CF Pages function logs.
    console.error('[block-error]', this.props.label || '', err);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const isDev = process.env.NODE_ENV !== 'production';
    return (
      <div
        role="alert"
        style={{
          margin: '12px 0',
          padding: '14px 18px',
          border: '1px solid #fca5a5',
          background: '#fef2f2',
          borderRadius: 8,
          color: '#7f1d1d',
          fontSize: 14,
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        <strong>Block failed to render.</strong>
        {isDev && this.state.message ? <div style={{ marginTop: 6 }}>{this.state.message}</div> : null}
      </div>
    );
  }
}
