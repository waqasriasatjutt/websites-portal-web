import type { PropsOf } from '@/types/blocks';

export default function CustomHTML({ props }: { props: PropsOf<'custom_html'> }) {
  if (!props.html) return null;
  return (
    <section className="wp-section">
      <div className="wp-container">
        <div dangerouslySetInnerHTML={{ __html: props.html }} />
      </div>
    </section>
  );
}
