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

export interface SiteConfig {
  id: number;
  slug: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  domain: string;
  adsense_publisher_id: string;
  adsense_auto_ads: boolean;
  ga4: string;
  gsc_verification: string;
  logo_url: string;
  favicon_url: string;
  menu: Array<{ label: string; href: string }>;
  theme: Theme;
}

export interface Block {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  is_homepage: boolean;
  blocks: Block[];
  meta: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    noindex: boolean;
    og_image: string;
  };
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
    const res = await fetch(url, { next: { revalidate: CACHE_SECONDS } });
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!data.ok) return null;
    return data as T;
  } catch (err) {
    console.warn('[odoo]', path, err);
    return null;
  }
}

export async function getSite(host: string): Promise<SiteConfig | null> {
  const r = await fetchOdoo<{ site: SiteConfig }>('/wp/api/site', { host });
  return r?.site || null;
}

export async function getPage(host: string, slugOrHome: { slug?: string; home?: boolean }): Promise<{ site: SiteConfig; page: Page } | null> {
  const params: Record<string, string> = { host };
  if (slugOrHome.home) params.home = '1';
  if (slugOrHome.slug) params.slug = slugOrHome.slug;
  const r = await fetchOdoo<{ site: SiteConfig; page: Page }>('/wp/api/page', params);
  return r || null;
}

export async function getPosts(host: string, opts: { page?: number; limit?: number; category?: string; tag?: string } = {}) {
  const params: Record<string, string> = { host };
  if (opts.page) params.page = String(opts.page);
  if (opts.limit) params.limit = String(opts.limit);
  if (opts.category) params.category = opts.category;
  if (opts.tag) params.tag = opts.tag;
  return await fetchOdoo<{ site: SiteConfig; pagination: any; posts: PostSummary[] }>('/wp/api/posts', params);
}

export async function getPost(host: string, slug: string) {
  return await fetchOdoo<{ site: SiteConfig; post: any }>('/wp/api/post', { host, slug });
}
