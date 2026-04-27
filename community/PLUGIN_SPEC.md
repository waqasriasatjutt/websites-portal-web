# Plugin Specification

A **plugin** for the Websites Portal platform is a GitHub repository
containing a `plugin.json` manifest at its root. Site owners install
plugins via the Odoo backend (Plugins → New → paste GitHub URL).

## Repo layout

```
my-plugin/
├── plugin.json              # The manifest (required)
├── README.md                # Install + usage (recommended)
├── blocks/                  # React block components (per type)
│   ├── PricingCalc.tsx
│   └── PricingCalc.bundle.js     # Compiled IIFE / UMD
├── themes/                  # Optional theme presets
│   └── neon-pop.json
├── templates/               # Optional pre-built page sets
│   └── saas-landing.json
└── widgets/                 # Optional standalone components
    └── chat-bubble.bundle.js
```

## plugin.json schema

```json
{
  "name": "My plugin",
  "slug": "my-plugin",
  "version": "1.0.0",
  "author": "Jane Doe",
  "description": "Adds a pricing calculator block.",
  "homepage": "https://example.com/my-plugin",
  "kind": "blocks",
  "icon": "🧮",

  "blocks": [
    {
      "slug": "pricing_calc",
      "name": "Pricing calculator",
      "icon": "🧮",
      "category": "conversion",
      "bundle_url": "https://cdn.example.com/my-plugin/PricingCalc.bundle.js",
      "schema": [
        { "key": "heading", "label": "Heading", "type": "text", "required": true },
        { "key": "rate_per_unit", "label": "Rate per unit ($)", "type": "text" }
      ],
      "default_props": { "heading": "Calculate your savings", "rate_per_unit": "9.99" }
    }
  ],

  "themes": [
    {
      "slug": "neon-pop",
      "name": "Neon Pop",
      "tokens": {
        "primary": "#ff00ff",
        "accent":  "#00ffff",
        "bg":      "#0a0a14",
        "text":    "#ffffff",
        "muted":   "#94a3b8",
        "font_body":    "Inter",
        "font_display": "Audiowide"
      },
      "css_url": "https://cdn.example.com/my-plugin/neon-pop.css"
    }
  ],

  "templates": [
    {
      "slug": "saas-landing",
      "name": "SaaS landing page",
      "category": "saas",
      "thumbnail_url": "https://cdn.example.com/my-plugin/saas-landing.png",
      "pages": [
        {
          "slug": "/",
          "title": "Home",
          "is_homepage": true,
          "blocks": [
            { "type": "hero", "props": { "heading": "Build faster", "cta_label": "Get started", "cta_href": "/signup" } },
            { "type": "pricing_calc", "props": { "heading": "Try it free" } }
          ]
        }
      ]
    }
  ],

  "widgets": [
    {
      "slug": "chat-bubble",
      "name": "Chat bubble",
      "bundle_url": "https://cdn.example.com/my-plugin/chat-bubble.bundle.js"
    }
  ]
}
```

## Field reference

### Top level

| Field | Required | Description |
|---|---|---|
| `name` | yes | Display name |
| `slug` | yes | Unique kebab-case ID (must match Odoo plugin record) |
| `version` | yes | Semver |
| `author` | no | |
| `description` | no | One-line description |
| `homepage` | no | Plugin website / docs URL |
| `kind` | yes | `blocks` / `theme` / `template` / `widget` / `mixed` |
| `icon` | no | Emoji shown in plugin browser |
| `blocks[]` | no | Block contributions |
| `themes[]` | no | Theme contributions |
| `templates[]` | no | Template contributions |
| `widgets[]` | no | Standalone widget contributions |

### Block entry

| Field | Required | Description |
|---|---|---|
| `slug` | yes | Block type slug (used in `block.type`) |
| `name` | yes | Display name in block picker |
| `icon` | no | Emoji |
| `category` | no | `structure` / `content` / `media` / `conversion` / `list` / `custom` |
| `bundle_url` | yes | Public URL to compiled JS (IIFE or UMD) |
| `schema` | yes | Editor field schema (same shape as core blocks) |
| `default_props` | no | Default prop values |

The compiled JS bundle must:
- Run in an iframe sandbox by default
- Read props from `window.WP_PROPS`
- Render into `document.getElementById('root')`
- React 18 UMD is provided as `window.React` / `window.ReactDOM`

### Theme entry

| Field | Description |
|---|---|
| `slug` | Theme identifier |
| `name` | Display name |
| `tokens` | Object with `primary`, `accent`, `bg`, `text`, `muted`, `font_body`, `font_display` |
| `css_url` | Optional URL to CSS to inject |

### Template entry

| Field | Description |
|---|---|
| `slug` | Template identifier |
| `name` | Display name |
| `category` | `agency` / `saas` / `blog` / `ecommerce` / `portfolio` / etc |
| `thumbnail_url` | Preview image |
| `pages[]` | Array of page objects (`slug`, `title`, `is_homepage`, `blocks[]`) |

### Widget entry

Standalone component for the existing `react_widget` slot system.

| Field | Description |
|---|---|
| `slug` | Widget identifier |
| `name` | Display name |
| `bundle_url` | Public URL to compiled JS |

## How to develop a plugin

```bash
# 1. Use the starter repo (TODO: publish)
git clone https://github.com/waqasriasatjutt/wp-plugin-starter.git my-plugin
cd my-plugin

# 2. Build (Vite/esbuild/webpack — your call)
npm install
npm run dev    # local hot-reload against demo fixtures
npm run build  # produces dist/

# 3. Commit + push
git remote set-url origin https://github.com/yourorg/my-plugin.git
git push -u origin main

# 4. Install on a tenant
# In Odoo: Websites Portal → Plugins (GitHub) → New
# - Repo URL: https://github.com/yourorg/my-plugin
# - Branch: main
# - Click "Fetch / Refresh manifest"
# - Click "Publish"
# - Then: Site form → Plugins tab → enable
```

## Minimal block bundle example

```js
// PricingCalc.bundle.js — IIFE wrapping
(function() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  function PricingCalc() {
    const props = window.WP_PROPS || {};
    const [units, setUnits] = React.useState(10);
    const rate = parseFloat(props.rate_per_unit || '9.99');
    return React.createElement('div', {style: {padding: '2rem'}},
      React.createElement('h2', null, props.heading),
      React.createElement('input', {
        type: 'number', value: units,
        onChange: e => setUnits(parseInt(e.target.value || '0', 10)),
      }),
      React.createElement('p', null, 'Total: $' + (units * rate).toFixed(2))
    );
  }
  root.render(React.createElement(PricingCalc));
})();
```

## Trust model

- Plugins run **iframe-sandboxed** by default (CSS scoped, no parent-DOM access).
- Platform admin can flip `trusted` on a plugin record to let it run inline (full DOM access). Only do this for code you authored or audited.
- Plugin URLs (`bundle_url`, `css_url`, `thumbnail_url`) should be HTTPS and ideally on a CDN you control.

## Versioning

- Bump `version` in `plugin.json` on each release.
- Site admin clicks "Fetch / Refresh manifest" to pull latest.
- Old bundle URLs stay cached at the CDN — versioned URLs (e.g. `pricing-calc@1.2.0.bundle.js`) avoid stale caches.
