/**
 * Block registry + dispatcher.
 *
 * To add a new block:
 *   1. Add its interface to `types/blocks.ts` and include it in `AnyBlock`.
 *   2. Create `components/blocks/<YourBlock>.tsx` with `PropsOf<'your_slug'>`.
 *   3. Import + register it in REGISTRY below.
 *   4. (Optional) add it to the Odoo block catalog so editors can pick it.
 *   5. (Optional) add a sample to `__fixtures__/sites/demo.json`.
 */
import type { ReactElement } from 'react';
import type { AnyBlock, BlockType } from '@/types/blocks';

import Hero from './Hero';
import Features from './Features';
import CTA from './CTA';
import FAQ from './FAQ';
import Testimonial from './Testimonial';
import Pricing from './Pricing';
import PostList from './PostList';
import RichText from './RichText';
import AdSlot from './AdSlot';
import Unknown from './Unknown';

type AnyComponent = (args: { props: any }) => ReactElement | null;

const REGISTRY: Record<BlockType, AnyComponent> = {
    hero: Hero,
    features: Features,
    cta: CTA,
    faq: FAQ,
    testimonial: Testimonial,
    pricing: Pricing,
    post_list: PostList,
    richtext: RichText,
    adsense: AdSlot,
};

export default function BlockRenderer({ blocks }: { blocks: AnyBlock[] }) {
    return (
        <>
            {blocks.map(b => {
                const Comp = REGISTRY[b.type as BlockType];
                if (!Comp) return <Unknown key={b.id} type={b.type} />;
                return <Comp key={b.id} props={b.props} />;
            })}
        </>
    );
}

export { REGISTRY };
