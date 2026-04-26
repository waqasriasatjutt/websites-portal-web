import type { PropsOf } from '@/types/blocks';

function extractEmbedUrl(url: string): string {
  if (!url) return '';
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export default function Video({ props }: { props: PropsOf<'video'> }) {
  const embed = extractEmbedUrl(props.video_url || '');
  const params: string[] = [];
  if (props.autoplay) params.push('autoplay=1', 'mute=1');
  if (props.loop) params.push('loop=1');
  const src = embed + (params.length ? (embed.includes('?') ? '&' : '?') + params.join('&') : '');

  return (
    <section className="wp-section">
      <div className="wp-container">
        {(props.eyebrow || props.heading) && (
          <div className="text-center mb-10">
            {props.eyebrow && (
              <div className="wp-eyebrow">{props.eyebrow}</div>
            )}
            {props.heading && (
              <h2 className="wp-heading mt-3">{props.heading}</h2>
            )}
            {props.subtitle && (
              <p className="wp-sub mt-3 max-w-2xl mx-auto">{props.subtitle}</p>
            )}
          </div>
        )}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <div style={{ aspectRatio: '16/9', position: 'relative' }}>
            <iframe
              src={src}
              title={props.caption || props.heading || 'Video'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
        {props.caption && (
          <p className="text-center text-sm mt-3" style={{ color: 'var(--muted)' }}>{props.caption}</p>
        )}
      </div>
    </section>
  );
}
