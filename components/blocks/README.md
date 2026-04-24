# Block components

Page layouts are built from **blocks**. A block is a single self-contained
section on a page (Hero, Features, Pricing, etc). Editors compose pages by
stacking blocks in the Odoo drag-drop editor — this folder contains the
React renderer for each block.

## Current block catalog

| Slug          | Component          | Purpose                                     |
| ------------- | ------------------ | ------------------------------------------- |
| `hero`        | `Hero.tsx`         | Full-width header with heading + CTA + stats |
| `features`    | `Features.tsx`     | 3-column icon grid                          |
| `cta`         | `CTA.tsx`          | Mid-page call-to-action banner              |
| `faq`         | `FAQ.tsx`          | Accordion Q&A                               |
| `testimonial` | `Testimonial.tsx`  | Single customer quote                       |
| `pricing`     | `Pricing.tsx`      | 3-tier pricing table                        |
| `post_list`   | `PostList.tsx`     | Auto-hydrated latest blog posts             |
| `richtext`    | `RichText.tsx`     | Free-form HTML                              |
| `adsense`     | `AdSlot.tsx`       | Google AdSense unit                         |

Unknown block types (anything not in the registry) render a yellow warning
box via `Unknown.tsx` — the site stays live, but the bad block is flagged.

## Adding a new block in 5 steps

Say we're adding a **Video** block that embeds a YouTube URL with a caption.

### 1. Declare the type

Open [`types/blocks.ts`](../../types/blocks.ts) and add a new interface + add
it to the `AnyBlock` union:

```ts
export interface VideoBlock {
    id: string;
    type: 'video';
    props: {
        youtube_id: string;
        caption?: string;
        autoplay?: boolean;
    };
}

export type AnyBlock =
    | HeroBlock
    | FeaturesBlock
    // …
    | VideoBlock;   // ← add here
```

### 2. Create the component

Create `components/blocks/Video.tsx`:

```tsx
import type { PropsOf } from '@/types/blocks';

export default function Video({ props }: { props: PropsOf<'video'> }) {
    const src = `https://www.youtube-nocookie.com/embed/${props.youtube_id}${props.autoplay ? '?autoplay=1' : ''}`;
    return (
        <section className="wp-section">
            <div className="wp-container-narrow">
                <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe src={src} className="w-full h-full" allowFullScreen />
                </div>
                {props.caption && (
                    <p className="mt-4 text-sm text-center" style={{ color: 'var(--muted)' }}>
                        {props.caption}
                    </p>
                )}
            </div>
        </section>
    );
}
```

Keep to theme tokens (`var(--primary)`, `var(--bg)`, etc.) and the shared
utility classes (`wp-section`, `wp-container`, `wp-card`, `wp-btn`,
`wp-eyebrow`, `wp-grad-text`) — that way the block automatically respects
every theme we ship.

### 3. Register it

Open [`components/blocks/index.tsx`](./index.tsx) and add two lines:

```tsx
import Video from './Video';

const REGISTRY: Record<BlockType, AnyComponent> = {
    // …
    video: Video,   // ← add here
};
```

### 4. Add a fixture (recommended)

Add a sample to `__fixtures__/sites/demo.json` so you can see it render
without needing the Odoo backend:

```json
{
  "id": "v1",
  "type": "video",
  "props": {
    "youtube_id": "dQw4w9WgXcQ",
    "caption": "Product walkthrough"
  }
}
```

Run `NEXT_PUBLIC_USE_FIXTURES=1 pnpm dev` and visit <http://localhost:3000>.

### 5. (Optional) Make it editable in Odoo

So editors can drop this block into pages from the Odoo backend:

```bash
# In the Odoo shell
env['websites.portal.block.type'].create({
    'slug':      'video',
    'name':      'Video',
    'icon':      'fa-youtube-play',
    'category':  'media',
    'schema':    json.dumps({
        'youtube_id': {'type': 'string', 'label': 'YouTube video ID', 'required': True},
        'caption':    {'type': 'string', 'label': 'Caption'},
        'autoplay':   {'type': 'bool',   'label': 'Autoplay', 'default': False},
    }),
})
```

Schema field types are `string`, `text`, `bool`, `number`, `html`, `array`
— the block editor renders the appropriate input for each.

## Design system conventions

- **Wrap in `<section className="wp-section">`** — standard vertical rhythm.
- **Use `wp-container`** for full-width blocks; `wp-container-narrow` for
  prose-width blocks (richtext, ads).
- **Theme via CSS variables** — never hardcode colors. The theme object
  flows in via `app/page.tsx` → `themeStyle()` and sets `--primary`,
  `--accent`, `--bg`, `--text`, `--muted`, `--bg-elevated`, `--border`.
- **Prefer `wp-card`** for elevated tiles, `wp-btn` + modifiers for CTAs,
  `wp-grad-text` for gradient headings.
- **Don't take `any` props** — every block must use `PropsOf<'your_slug'>`
  so a prop rename gets caught at compile time.

## Token substitution

Any string prop may contain `{{token}}` placeholders. These are substituted
at render time in `app/page.tsx` via `substituteDeep()`. You don't need to
do anything in the block component — just trust that strings arrive with
tokens already replaced.

Common tokens: `{{service_name}}`, `{{city}}`, `{{year}}`, `{{month}}`,
plus any custom variable the editor defines on the site.

## Testing the block

With fixtures mode on, `pnpm dev` + a browser is the whole feedback loop.
To verify TypeScript is happy:

```bash
npx tsc --noEmit
```

## Gotchas

- `aspect-video` and other Tailwind utilities need `tailwindcss` v3.4+ —
  already installed.
- `dangerouslySetInnerHTML` is OK for `richtext`, but sanitize anywhere
  else (the Odoo controller is the source of truth for HTML trust).
- Edge runtime means **no `fs`, no `Buffer`**, no Node APIs — keep blocks
  pure-presentational.
