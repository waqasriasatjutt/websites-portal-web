# websites-portal-web

Multi-tenant Next.js renderer for the `websites_portal_odoo` backend.
Serves every tenant site (sites.way4tech.com, plus each custom domain)
from a single Cloudflare Pages deployment — the same app looks at the
`Host` header and fetches that tenant's pages/posts from Odoo.

**For frontend devs:** the typical workflow is below. You do **not** need
an Odoo backend running locally — fixtures mode renders a demo site from
`__fixtures__/sites/demo.json`.

## Quick start

```bash
# 1. Install
npm install
# 2. Enable fixtures mode
cp .env.example .env
# 3. Run
npm run dev
# 4. Visit http://localhost:3000
```

That's it. You should see the Acme Labs demo site rendered from the local
JSON fixture. Edit `__fixtures__/sites/demo.json`, save, refresh — you're
iterating on blocks, themes, and chrome without any backend.

## Project layout

```
websites-portal-web/
├── app/                        Next.js App Router
│   ├── page.tsx                Homepage (any host → Odoo home page)
│   ├── [slug]/page.tsx         Any other page
│   ├── blog/page.tsx           /blog index
│   ├── blog/[slug]/page.tsx    /blog/:slug post
│   └── contact/page.tsx        Static contact form
├── components/
│   ├── SiteChrome.tsx          Header + footer
│   └── blocks/                 ← one file per block type
│       ├── README.md           ← contribution guide (start here)
│       ├── index.tsx           Registry + dispatcher
│       └── Hero.tsx, …         Individual block components
├── lib/
│   ├── odoo.ts                 Odoo JSON API client
│   ├── fixtures.ts             Offline fixtures adapter
│   └── tokens.ts               {{mustache}} substitution
├── types/
│   └── blocks.ts               Discriminated union for every block type
├── __fixtures__/
│   └── sites/demo.json         Sample site for offline dev
└── public/                     Static assets
```

## Where to make common changes

| I want to…                                      | Go to                                    |
| ----------------------------------------------- | ---------------------------------------- |
| Tweak an existing block's markup                | `components/blocks/<Name>.tsx`           |
| Add a new block type                            | See `components/blocks/README.md`        |
| Change header/footer                            | `components/SiteChrome.tsx`              |
| Edit the demo content                           | `__fixtures__/sites/demo.json`           |
| Adjust token substitution                       | `lib/tokens.ts`                          |
| Change theme defaults                           | `app/page.tsx` → `themeStyle()`          |
| Global CSS / design tokens                      | `app/globals.css`                        |
| Wire up a new Odoo endpoint                     | `lib/odoo.ts`                            |

## Environment variables

See `.env.example`.

- `NEXT_PUBLIC_USE_FIXTURES=1` — render from local JSON, skip Odoo.
- `ODOO_URL` — backend base URL (used only when fixtures are off).

## Type safety

- Blocks are a **discriminated union** in `types/blocks.ts`. Every block
  component declares its props as `PropsOf<'your_slug'>` so a typo
  anywhere in the chain is a compile error.
- Run `npx tsc --noEmit` to check — no output means clean.

## Deployment

```bash
npm run deploy
```

This builds with `@cloudflare/next-on-pages` and deploys to the
`websites-portal-web` Cloudflare Pages project on branch `main`. Requires
`wrangler` auth. DNS (wildcard CNAME `*.sites.way4tech.com` →
`websites-portal-web.pages.dev` and each custom domain CNAME) is managed
through the Odoo backend's auto-attach flow.

## Backend contract

The renderer consumes four Odoo endpoints:

| Endpoint         | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `/wp/api/site`   | Site config + theme + menu (by host)       |
| `/wp/api/page`   | A single page (by host + slug or `home=1`) |
| `/wp/api/posts`  | Paginated blog index                       |
| `/wp/api/post`   | A single post                              |

All endpoints are implemented by controllers in the `websites_portal_odoo`
Odoo module. The fixture adapter in `lib/fixtures.ts` mimics the same
response shapes so the app behaves identically in both modes.

## Tips

- **Content-only changes** (copy, images, new posts) happen in **Odoo**,
  not in this repo. This repo is the renderer only.
- **Structural changes** (new block types, new themes, new page templates
  at the renderer level) happen here.
- **Bug fix workflow:** turn on fixtures mode, reproduce in `demo.json`,
  fix the block component, turn off fixtures, verify against live Odoo,
  deploy.
