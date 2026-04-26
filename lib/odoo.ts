/**
 * Odoo JSON API client for the websites_portal_odoo backend.
 *
 * ODOO_URL is baked in at build time (edge runtime — fetch only).
 */
export const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';
export const CACHE_SECONDS = 300; // 5-min edge cache

export interface Theme {
  id: number;
  name: string;
  slug: string;
  colors: { primary: string; accent: string; bg: string; text: string; muted: string };
  fonts: { body: string; display: string };
  radius: string;
  density: string;
  extras: Record<string, any>;
}

export interface MenuItem {
  label: string;
  href: string;
}

export interface FooterLink { label: string; href: string }
export interface FooterColumn { title: string; links: FooterLink[] }
export interface SocialLink { network: string; href: string }

export interface SiteConfig {
  id: number;
  slug: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  domain: string;
  lang?: string;
  locale?: string;
  adsense_publisher_id: string;
  adsense_auto_ads: boolean;
  ga4: string;
  gsc_verification: string;
  bing_verification?: string;
  yandex_verification?: string;
  fb_pixel_id?: string;
  fb_app_id?: string;
  twitter_handle?: string;
  logo_url: string;
  favicon_url: string;
  default_og_image_url?: string;
  menu: MenuItem[];
  theme: Theme;
  header_cta?: { label: string; href: string };
  footer?: {
    about: string;
    columns: FooterColumn[];
    socials: SocialLink[];
    copyright: string;
    credit: string;
  };
  custom_code?: {
    head_html: string;
    body_start_html: string;
    body_end_html: string;
    css: string;
    js: string;
    extra_meta?: Array<{ name?: string; property?: string; content: string }>;
  };
  seo?: {
    focus_keyword: string;
    secondary_keywords: string;
    niche: string;
    schema_type: string;
    phone: string;
    whatsapp: string;
  };
  tokens?: Record<string, string | number>;
}

import type { AnyBlock } from '@/types/blocks';

/**
 * Block is re-exported here as the discriminated union from `types/blocks.ts`.
 * The Odoo API may send slugs we haven't typed yet — at render time those
 * fall through to the `Unknown` component, which is safe.
 */
export type Block = AnyBlock;

export interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  noindex: boolean;
  nofollow?: boolean;
  og_title?: string;
  og_description?: string;
  og_type?: string;
  og_image: string;
  og_image_alt?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  is_homepage: boolean;
  blocks: Block[];
  meta: PageMeta;
  schema: any;
  published_at: string | null;
}

export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  category: string;
  tags: Array<{ name: string; slug: string }>;
  author: string;
  cover_url: string;
  cover_alt: string;
  post_date: string | null;
  published_at: string | null;
  read_time_min: number;
}

async function fetchOdoo<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const qs = new URLSearchParams(params).toString();
  const url = `${ODOO_URL}${path}?${qs}`;
  try {
    // NOTE: `next: { revalidate }` is unreliable on Cloudflare Workers edge
    // with @cloudflare/next-on-pages. Use standard cache headers + CF's own
    // cache layer instead (the Odoo controller already sends s-maxage=300).
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!data.ok) return null;
    return data as T;
  } catch (err) {
    console.warn('[odoo]', path, err);
    return null;
  }
}

import { USE_FIXTURES, fixtureSite, fixturePage, fixturePosts, fixturePost } from './fixtures';

export async function getSite(host: string): Promise<SiteConfig | null> {
  if (USE_FIXTURES) return fixtureSite(host);
  const r = await fetchOdoo<{ site: SiteConfig }>('/wp/api/site', { host });
  return r?.site || null;
}

export async function getPage(host: string, slugOrHome: { slug?: string; home?: boolean }): Promise<{ site: SiteConfig; page: Page } | null> {
  if (USE_FIXTURES) return fixturePage(host, slugOrHome);
  const params: Record<string, string> = { host };
  if (slugOrHome.home) params.home = '1';
  if (slugOrHome.slug) params.slug = slugOrHome.slug;
  const r = await fetchOdoo<{ site: SiteConfig; page: Page }>('/wp/api/page', params);
  return r || null;
}

export async function getPosts(host: string, opts: { page?: number; limit?: number; category?: string; tag?: string } = {}) {
  if (USE_FIXTURES) return fixturePosts(host, opts);
  const params: Record<string, string> = { host };
  if (opts.page) params.page = String(opts.page);
  if (opts.limit) params.limit = String(opts.limit);
  if (opts.category) params.category = opts.category;
  if (opts.tag) params.tag = opts.tag;
  return await fetchOdoo<{ site: SiteConfig; pagination: any; posts: PostSummary[] }>('/wp/api/posts', params);
}

export async function getPost(host: string, slug: string) {
  if (USE_FIXTURES) return fixturePost(host, slug);
  return await fetchOdoo<{ site: SiteConfig; post: any }>('/wp/api/post', { host, slug });
}

/**
 * Build a complete Next.js Metadata object from site + page SEO data.
 * Used by both home and dynamic page generateMetadata.
 */
export function buildMetadata(site: SiteConfig, page: Page, host: string, pathname: string) {
  const proto = process.env.NEXT_PUBLIC_SITE_PROTO || 'https';
  const baseUrl = `${proto}://${host}`;
  const pageUrl = `${baseUrl}${pathname.startsWith('/') ? pathname : '/' + pathname}`;

  const title = page.meta?.title || page.title || site.title;
  const description = page.meta?.description || site.description || '';
  const canonical = page.meta?.canonical || pageUrl;

  // Resolve absolute URLs for images (Odoo paths are relative)
  const absUrl = (u?: string) => {
    if (!u) return undefined;
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${ODOO_URL}${u}`;
  };

  const ogImage = absUrl(page.meta?.og_image || site.default_og_image_url);
  const twitterImage = absUrl(page.meta?.twitter_image) || ogImage;

  const robotsParts: string[] = [];
  if (page.meta?.noindex) robotsParts.push('noindex'); else robotsParts.push('index');
  if (page.meta?.nofollow) robotsParts.push('nofollow'); else robotsParts.push('follow');

  return {
    title,
    description,
    keywords: page.meta?.keywords || site.seo?.secondary_keywords || undefined,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
    },
    robots: robotsParts.join(', '),
    icons: {
      icon: site.favicon_url ? absUrl(site.favicon_url) : undefined,
      shortcut: site.favicon_url ? absUrl(site.favicon_url) : undefined,
    },
    openGraph: {
      title: page.meta?.og_title || title,
      description: page.meta?.og_description || description,
      url: canonical,
      siteName: site.title || site.name,
      type: (page.meta?.og_type as any) || 'website',
      locale: site.locale || 'en_US',
      images: ogImage ? [{
        url: ogImage,
        alt: page.meta?.og_image_alt || title,
        width: 1200,
        height: 630,
      }] : undefined,
    },
    twitter: {
      card: (page.meta?.twitter_card as any) || 'summary_large_image',
      site: site.twitter_handle || undefined,
      creator: site.twitter_handle || undefined,
      title: page.meta?.twitter_title || page.meta?.og_title || title,
      description: page.meta?.twitter_description || page.meta?.og_description || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    other: {
      ...(site.gsc_verification ? { 'google-site-verification': site.gsc_verification } : {}),
      ...(site.bing_verification ? { 'msvalidate.01': site.bing_verification } : {}),
      ...(site.yandex_verification ? { 'yandex-verification': site.yandex_verification } : {}),
      ...(site.fb_app_id ? { 'fb:app_id': site.fb_app_id } : {}),
    },
  } as const;
}

/**
 * Auto-generate JSON-LD schema for a page based on niche + page meta.
 * Returns null if no schema can be inferred — caller should also include any
 * page-specific schema_json from Odoo.
 */
export function buildJsonLd(site: SiteConfig, page: Page, host: string, pathname: string) {
  const proto = process.env.NEXT_PUBLIC_SITE_PROTO || 'https';
  const baseUrl = `${proto}://${host}`;
  const pageUrl = `${baseUrl}${pathname}`;

  const orgType = site.seo?.schema_type || (
    site.seo?.niche === 'local' ? 'LocalBusiness' :
    site.seo?.niche === 'food' ? 'Restaurant' :
    site.seo?.niche === 'healthcare' ? 'MedicalBusiness' :
    site.seo?.niche === 'real_estate' ? 'RealEstateAgent' :
    'Organization'
  );

  const org: any = {
    '@type': orgType,
    name: site.title || site.name,
    url: baseUrl,
  };
  if (site.logo_url) org.logo = site.logo_url.startsWith('http') ? site.logo_url : `${ODOO_URL}${site.logo_url}`;
  if (site.description) org.description = site.description;
  if (site.seo?.phone) org.telephone = site.seo.phone;

  const webPage: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl,
    url: pageUrl,
    name: page.meta?.title || page.title,
    description: page.meta?.description || site.description,
    inLanguage: site.lang || 'en',
    isPartOf: {
      '@type': 'WebSite',
      url: baseUrl,
      name: site.title || site.name,
    },
    publisher: org,
  };

  return webPage;
}
