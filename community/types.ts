/**
 * Public types for community contributions.
 *
 * If you're adding a custom block, import from this file. The internal
 * shape of `AnyBlock` (in `types/blocks.ts`) is the renderer's concern;
 * you only need `BlockProps`.
 */

export interface BlockProps<P = Record<string, any>> {
  props: P;
}

/** Schema field types supported by the Odoo block editor. */
export type SchemaFieldType =
  | 'text' | 'textarea' | 'url' | 'image' | 'boolean'
  | 'select' | 'array' | 'number' | 'color';

export interface SchemaField {
  key: string;
  label: string;
  type: SchemaFieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** For type='select' */
  options?: Array<{ value: string; label: string }>;
  /** For type='array' — schema for each item */
  fields?: SchemaField[];
  /** For type='array' — display label for one item in the editor */
  item_label?: string;
}

/** A community block contribution. */
export interface CommunityBlockModule<P = Record<string, any>> {
  /** URL slug used in `block.type`. Lowercase, kebab or snake. */
  slug: string;
  /** Display name in the block picker. */
  name: string;
  /** Editor form schema. Renders inside the OWL block editor. */
  schema: SchemaField[];
  /** Optional default props when the block is added to a page. */
  defaultProps?: P;
  /** Optional category for grouping in the block picker. */
  category?: 'structure' | 'content' | 'media' | 'conversion' | 'list' | 'custom';
  /** Optional emoji or icon character for the picker. */
  icon?: string;
  /** The React component that renders the block. */
  default: (args: BlockProps<P>) => React.ReactElement | null;
}
