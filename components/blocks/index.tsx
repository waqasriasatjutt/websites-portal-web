/**
 * Block registry + dispatcher.
 *
 * Three sources of blocks:
 *   1. Core blocks (this folder) — built-in, ship with the renderer.
 *   2. Community blocks (../../community/blocks) — typed exports auto-registered
 *      by slug. Add a file there + push.
 *   3. Site-specific React widgets — runtime-loaded via the `react_widget`
 *      block (see ReactWidget.tsx and /widgets/<slot>.html route).
 */
import type { ReactElement } from 'react';
import type { AnyBlock } from '@/types/blocks';

import Hero from './Hero';
import Features from './Features';
import CTA from './CTA';
import FAQ from './FAQ';
import Testimonial from './Testimonial';
import Pricing from './Pricing';
import PostList from './PostList';
import RichText from './RichText';
import AdSlot from './AdSlot';
import Video from './Video';
import Gallery from './Gallery';
import ContactForm from './ContactForm';
import Newsletter from './Newsletter';
import MapBlock from './Map';
import LogoCloud from './LogoCloud';
import StatsCounter from './StatsCounter';
import Timeline from './Timeline';
import Team from './Team';
import Code from './Code';
import CustomHTML from './CustomHTML';
import ReactWidget from './ReactWidget';
import Unknown from './Unknown';

import { buildCommunityRegistry } from '@/community/blocks';

type AnyComponent = (args: { props: any }) => ReactElement | null;

const CORE_REGISTRY: Record<string, AnyComponent> = {
    hero: Hero,
    features: Features,
    cta: CTA,
    faq: FAQ,
    testimonial: Testimonial,
    pricing: Pricing,
    post_list: PostList,
    richtext: RichText,
    adsense: AdSlot,
    video: Video,
    gallery: Gallery,
    contact_form: ContactForm,
    newsletter: Newsletter,
    map: MapBlock,
    logo_cloud: LogoCloud,
    stats_counter: StatsCounter,
    timeline: Timeline,
    team: Team,
    code: Code,
    custom_html: CustomHTML,
    react_widget: ReactWidget,
};

// Community blocks override core if slug collision (intentional — let
// contributors fix bugs in core blocks via community without forking).
const REGISTRY: Record<string, AnyComponent> = {
    ...CORE_REGISTRY,
    ...buildCommunityRegistry(),
};

export default function BlockRenderer({ blocks }: { blocks: AnyBlock[] }) {
    return (
        <>
            {blocks.map(b => {
                const Comp = REGISTRY[b.type as string];
                if (!Comp) return <Unknown key={b.id} type={b.type} />;
                return <Comp key={b.id} props={(b as any).props} />;
            })}
        </>
    );
}

export { REGISTRY };
