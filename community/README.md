# Community contributions

Two ways for an outside React developer to add value to the platform without
forking the renderer:

## 1. Custom block (system-wide)

Add a new block that any site can use. File goes in `community/blocks/<YourBlock>.tsx`,
auto-registered with the slug from the filename.

### Step-by-step

```bash
git clone https://github.com/waqasriasatjutt/websites-portal-web.git
cd websites-portal-web
cp .env.example .env   # NEXT_PUBLIC_USE_FIXTURES=1 by default → no Odoo needed
npm install
npm run dev            # http://localhost:3000 with the demo fixtures
```

Create `community/blocks/Countdown.tsx`:

```tsx
import type { BlockProps } from '@/community/types';

export const slug = 'countdown';
export const schema = [
  { key: 'heading', label: 'Heading', type: 'text', required: true },
  { key: 'target_iso', label: 'Target date (ISO)', type: 'text', placeholder: '2026-12-31T23:59:59Z' },
];

export default function Countdown({ props }: BlockProps<{ heading: string; target_iso: string }>) {
  // ... your React code, full hook support, framer-motion, anything
}
```

Then:
```bash
git add community/blocks/Countdown.tsx
git commit -m "Add countdown block"
git push origin yourbranch  # PR or fork
```

When merged + deployed, every tenant can drop a `countdown` block on their pages.

## 2. Standalone widget (per-site)

If your component is too specific for the global catalog (e.g., "tenant ABC's
custom pricing calculator"), use the per-site widget slot system:

1. **Build locally**: any tooling (Vite, Webpack, Parcel, esbuild). Output a
   single self-contained JS file. Optional: include CSS via JS injection.
2. **Inside Odoo**: Websites Portal → React Widgets (devs) → New
3. **Slot name**: e.g. `pricing-calc`. Paste your compiled JS into "Widget JS source".
4. **Publish**.
5. **On any page** of the same tenant: add a `react_widget` block, set
   `slot_name = pricing-calc`, set `props_json` to anything you want passed in.
6. The renderer iframe-loads `/widgets/pricing-calc.html`, which fetches your
   JS from Odoo, runs it inside a sandboxed page with React UMD + your props.

### Widget runtime

Inside the iframe sandbox:

```js
window.WP_PROPS  // your props_json, parsed
window.WP_HOST   // current tenant host
window.WP_SLOT   // your slot name
React            // 18.x UMD
ReactDOM         // 18.x UMD
document.getElementById('root')
```

### Minimal widget

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
function App() {
  const [n, set] = React.useState(0);
  return React.createElement('button',
    { onClick: () => set(n+1) },
    'Clicked ' + n + ' times');
}
root.render(React.createElement(App));
```

### Building with modern tooling

If you want JSX + npm packages instead of raw `React.createElement`, build
locally with this minimal Vite setup:

```bash
npm create vite@latest my-widget -- --template react-ts
cd my-widget
# Edit src/main.tsx to use window.WP_PROPS instead of <App />
npm run build
# dist/assets/index-XXXX.js → paste contents into Odoo's "Widget JS source"
```

Or use esbuild for a one-liner build:

```bash
npx esbuild widget.tsx --bundle --format=iife --jsx=automatic \
  --external:react --external:react-dom \
  --define:process.env.NODE_ENV=\"production\" > widget.js
# paste widget.js into Odoo
```

## 3. Custom theme

Themes are simple records in Odoo (Configuration → Themes). Add via Odoo UI
or the API. Each theme exposes its colors and fonts as CSS custom properties
(`--primary`, `--accent`, `--bg`, `--text`, `--muted`, `--font-body`,
`--font-display`). Custom blocks use these instead of hardcoded colors.

## 4. Custom template

Templates are pre-built combinations of blocks + theme that other tenants can
clone. Defined in `data/template_data.xml` of the Odoo module. Contributing
a template = PR to `github.com/waqasriasatjutt/odoo19saas`.

## Where to ask

GitHub issues on the renderer repo. The project lead is the user behind the
`waqasriasatjutt` account.
