/**
 * Community block registry.
 *
 * Add a new block by:
 *   1. Create `community/blocks/YourBlock.tsx` (see Countdown.tsx for pattern)
 *   2. Import + add to COMMUNITY_BLOCKS below
 *   3. (Optional) add a matching catalog record to the Odoo module:
 *      data/block_type_extra_data.xml
 *
 * The renderer pulls these into the main REGISTRY at module load time.
 */

import * as Countdown from './Countdown';

import type { CommunityBlockModule } from '../types';

export const COMMUNITY_BLOCKS: CommunityBlockModule[] = [
  Countdown as unknown as CommunityBlockModule,
  // ↑ Add your blocks here
];

/** Map slug → component for the renderer. */
export function buildCommunityRegistry() {
  const out: Record<string, (a: { props: any }) => React.ReactElement | null> = {};
  for (const m of COMMUNITY_BLOCKS) {
    out[m.slug] = m.default as any;
  }
  return out;
}

/** For the developer: an array of {slug, name, schema, defaultProps} the
 *  Odoo-side script can use to keep the catalog in sync. */
export function exportCommunityCatalog() {
  return COMMUNITY_BLOCKS.map(m => ({
    slug: m.slug,
    name: (m as any).name || m.slug,
    icon: (m as any).icon || '📦',
    category: (m as any).category || 'custom',
    schema: m.schema,
    default_props: m.defaultProps || {},
  }));
}
