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

export interface VideoBlock {
    id: string;
    type: 'video';
    props: {
        eyebrow?: string;
        heading?: string;
        subtitle?: string;
        video_url: string;
        poster?: string;
        autoplay?: boolean;
        loop?: boolean;
        caption?: string;
    };
}

export interface GalleryItem {
    image: string;
    caption?: string;
    href?: string;
}
export interface GalleryBlock {
    id: string;
    type: 'gallery';
    props: {
        eyebrow?: string;
        heading?: string;
        layout?: 'grid_3' | 'grid_4' | 'masonry' | 'carousel';
        items: GalleryItem[];
    };
}

export interface FormField {
    key: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    required?: boolean;
    placeholder?: string;
    options?: string;
}
export interface ContactFormBlock {
    id: string;
    type: 'contact_form';
    props: {
        eyebrow?: string;
        heading?: string;
        subtitle?: string;
        submit_label?: string;
        success_message?: string;
        redirect_url?: string;
        fields: FormField[];
    };
}

export interface NewsletterBlock {
    id: string;
    type: 'newsletter';
    props: {
        eyebrow?: string;
        heading?: string;
        subtitle?: string;
        placeholder?: string;
        submit_label?: string;
        success_message?: string;
        layout?: 'inline' | 'stacked' | 'hero';
    };
}

export interface MapBlock {
    id: string;
    type: 'map';
    props: {
        eyebrow?: string;
        heading?: string;
        address_line?: string;
        map_query: string;
        height_px?: string;
        phone?: string;
        hours?: string;
    };
}

export interface LogoCloudItem {
    image: string;
    alt: string;
    href?: string;
}
export interface LogoCloudBlock {
    id: string;
    type: 'logo_cloud';
    props: {
        heading?: string;
        layout?: 'row' | 'grid' | 'marquee';
        grayscale?: boolean;
        items: LogoCloudItem[];
    };
}

export interface StatItemFull {
    value: string;
    label: string;
    icon?: string;
}
export interface StatsCounterBlock {
    id: string;
    type: 'stats_counter';
    props: {
        eyebrow?: string;
        heading?: string;
        items: StatItemFull[];
    };
}

export interface TimelineItem {
    date?: string;
    title: string;
    description?: string;
    icon?: string;
}
export interface TimelineBlock {
    id: string;
    type: 'timeline';
    props: {
        eyebrow?: string;
        heading?: string;
        layout?: 'vertical' | 'horizontal';
        items: TimelineItem[];
    };
}

export interface TeamMember {
    photo?: string;
    name: string;
    role?: string;
    bio?: string;
    linkedin?: string;
    twitter?: string;
}
export interface TeamBlock {
    id: string;
    type: 'team';
    props: {
        eyebrow?: string;
        heading?: string;
        subtitle?: string;
        items: TeamMember[];
    };
}

export interface CodeBlock {
    id: string;
    type: 'code';
    props: {
        heading?: string;
        language?: string;
        code: string;
        caption?: string;
    };
}

export interface CustomHTMLBlock {
    id: string;
    type: 'custom_html';
    props: {
        html: string;
    };
}

export interface ReactWidgetBlock {
    id: string;
    type: 'react_widget';
    props: {
        slot_name: string;
        props_json?: string;
        min_height?: string;
        placeholder_text?: string;
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
    | AdSenseBlock
    | VideoBlock
    | GalleryBlock
    | ContactFormBlock
    | NewsletterBlock
    | MapBlock
    | LogoCloudBlock
    | StatsCounterBlock
    | TimelineBlock
    | TeamBlock
    | CodeBlock
    | CustomHTMLBlock
    | ReactWidgetBlock;

/** Slug string literal of every supported block. */
export type BlockType = AnyBlock['type'];

/** Helper: given a type slug, get the matching block interface. */
export type BlockOfType<T extends BlockType> = Extract<AnyBlock, { type: T }>;

/** Helper: given a type slug, get the matching props type. */
export type PropsOf<T extends BlockType> = BlockOfType<T>['props'];
