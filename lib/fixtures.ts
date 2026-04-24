/**
 * Fixtures mode — offline renderer for React devs without Odoo access.
 *
 * Enable by setting `NEXT_PUBLIC_USE_FIXTURES=1` in your local `.env` file:
 *
 *   NEXT_PUBLIC_USE_FIXTURES=1
 *
 * The adapter below short-circuits every call in `lib/odoo.ts` and returns
 * data from `__fixtures__/sites/demo.json` instead of hitting the Odoo API.
 *
 * Add more fixture sites by dropping JSON files into `__fixtures__/sites/`
 * and keying them by hostname — e.g. `localhost.json`, `my-test.json`.
 */
import type { SiteConfig, Page, PostSummary } from './odoo';

import demoFixture from '@/__fixtures__/sites/demo.json';

/** Whether the app should read from fixtures instead of Odoo. */
export const USE_FIXTURES = process.env.NEXT_PUBLIC_USE_FIXTURES === '1';

interface FixtureBundle {
    site: SiteConfig;
    pages: Record<string, Page>;
    posts: PostSummary[];
}

const BUNDLES: Record<string, FixtureBundle> = {
    // Keyed by hostname. Default bundle serves every host in dev.
    'default': demoFixture as unknown as FixtureBundle,
};

function bundleForHost(_host: string): FixtureBundle {
    // Future: look up host-specific fixture. For now every host gets the demo.
    return BUNDLES.default;
}

export function fixtureSite(host: string): SiteConfig | null {
    return bundleForHost(host).site || null;
}

export function fixturePage(host: string, opts: { slug?: string; home?: boolean }): { site: SiteConfig; page: Page } | null {
    const b = bundleForHost(host);
    let page: Page | undefined;
    if (opts.home) {
        page = b.pages.home || Object.values(b.pages).find(p => p.is_homepage);
    } else if (opts.slug) {
        page = b.pages[opts.slug];
    }
    if (!page) return null;
    return { site: b.site, page };
}

export function fixturePosts(host: string, opts: { page?: number; limit?: number; category?: string; tag?: string } = {}) {
    const b = bundleForHost(host);
    let posts = [...b.posts];
    if (opts.category) posts = posts.filter(p => p.category === opts.category);
    const limit = opts.limit || 10;
    const pageNum = opts.page || 1;
    const start = (pageNum - 1) * limit;
    return {
        site: b.site,
        pagination: { page: pageNum, limit, total: posts.length, pages: Math.ceil(posts.length / limit) },
        posts: posts.slice(start, start + limit),
    };
}

export function fixturePost(host: string, slug: string) {
    const b = bundleForHost(host);
    const post = b.posts.find(p => p.slug === slug);
    if (!post) return null;
    return { site: b.site, post };
}
