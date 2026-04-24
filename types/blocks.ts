/**
 * Typed block contract for the websites_portal_odoo renderer.
 *
 * Every block on a page is one of these variants. Add a new block by:
 *   1. Adding a new interface + type slug below
 *   2. Adding it to the `AnyBlock` union
 *   3. Creating `components/blocks/<slug>.tsx` with props typed as that interface
 *   4. Registering it in `components/blocks/index.tsx`
 *
 * Keep this file in sync with the Odoo `websites.portal.block.type` catalog —
 * the slugs here are the `slug` field on each catalog record.
 */

export interface StatItem {
    label: string;
    value: string;
}

export interface HeroBlock {
    id: string;
    type: 'hero';
    props: {
        eyebrow?: string;
        heading: string;
        heading_before?: string;
        heading_after?: string;
        subtitle?: string;
        cover_image?: string;
        cta_label?: string;
        cta_href?: string;
        secondary_label?: string;
        secondary_href?: string;
        stats?: StatItem[];
    };
}

export interface FeatureItem {
    icon?: string;
    image?: string;
    title: string;
    description: string;
}

export interface FeaturesBlock {
    id: string;
    type: 'features';
    props: {
        eyebrow?: string;
        heading?: string;
        subtitle?: string;
        items: FeatureItem[];
    };
}

export interface CTABlock {
    id: string;
    type: 'cta';
    props: {
        eyebrow?: string;
        heading: string;
        subtitle?: string;
        cta_label?: string;
        cta_href?: string;
        secondary_label?: string;
        secondary_href?: string;
    };
}

export interface FAQItem {
    q: string;
    a: string;
}

export interface FAQBlock {
    id: string;
    type: 'faq';
    props: {
        eyebrow?: string;
        heading?: string;
        subtitle?: string;
        items: FAQItem[];
    };
}

export interface TestimonialBlock {
    id: string;
    type: 'testimonial';
    props: {
        quote: string;
        author: string;
        role?: string;
        author_avatar?: string;
    };
}

export interface PricingTier {
    name: string;
    description?: string;
    price: string;
    period?: string;
    features?: string[];
    cta_label?: string;
    cta_href?: string;
    highlight?: boolean;
}

export interface PricingBlock {
    id: string;
    type: 'pricing';
    props: {
        eyebrow?: string;
        heading?: string;
        subtitle?: string;
        tiers: PricingTier[];
    };
}

/**
 * `posts` is populated at render time by app/page.tsx — editors leave it
 * empty in Odoo. Typed as optional so the contract is honest.
 */
export interface PostListBlock {
    id: string;
    type: 'post_list';
    props: {
        eyebrow?: string;
        heading?: string;
        posts?: Array<{
            id: number;
            slug: string;
            title: string;
            excerpt?: string;
            cover_url?: string;
            cover_alt?: string;
            category?: string;
            author?: string;
            read_time_min?: number;
        }>;
    };
}

export interface RichTextBlock {
    id: string;
    type: 'richtext';
    props: {
        html: string;
    };
}

export interface AdSenseBlock {
    id: string;
    type: 'adsense';
    props: {
        client?: string;
        slot?: string;
        format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    };
}

/** Discriminated union of every supported block. */
export type AnyBlock =
    | HeroBlock
    | FeaturesBlock
    | CTABlock
    | FAQBlock
    | TestimonialBlock
    | PricingBlock
    | PostListBlock
    | RichTextBlock
    | AdSenseBlock;

/** Slug string literal of every supported block. */
export type BlockType = AnyBlock['type'];

/** Helper: given a type slug, get the matching block interface. */
export type BlockOfType<T extends BlockType> = Extract<AnyBlock, { type: T }>;

/** Helper: given a type slug, get the matching props type. */
export type PropsOf<T extends BlockType> = BlockOfType<T>['props'];
