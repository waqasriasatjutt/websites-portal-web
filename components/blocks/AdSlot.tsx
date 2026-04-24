import type { PropsOf } from '@/types/blocks';

export default function AdSlot({ props }: { props: PropsOf<'adsense'> }) {
    if (!props.client) return null;
    return (
        <section className="my-10">
            <div className="wp-container-narrow">
                <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Advertisement</div>
                <ins className="adsbygoogle block min-h-[120px] rounded"
                     style={{ display: 'block', textAlign: 'center' }}
                     data-ad-client={props.client}
                     data-ad-slot={props.slot}
                     data-ad-format={props.format || 'auto'}
                     data-full-width-responsive="true" />
            </div>
        </section>
    );
}
