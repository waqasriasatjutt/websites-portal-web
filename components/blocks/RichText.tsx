import type { PropsOf } from '@/types/blocks';

export default function RichText({ props }: { props: PropsOf<'richtext'> }) {
    return (
        <section className="wp-section">
            <div className="wp-container-narrow">
                <div className="wp-prose" dangerouslySetInnerHTML={{ __html: props.html || '' }} />
            </div>
        </section>
    );
}
