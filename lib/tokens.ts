/**
 * Mustache-style token substitution for block content.
 *
 *  - Supports `{{ key }}` with optional whitespace.
 *  - Unknown tokens are left as-is so editors can spot them in preview.
 *  - Walks nested objects/arrays inside a block's props.
 *  - Built-in dynamic tokens: {{year}}, {{month}}, {{date_iso}}.
 */

export type Tokens = Record<string, string | number | boolean | null | undefined>;

const TOKEN_RE = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

function withBuiltIns(tokens: Tokens): Record<string, string> {
    const now = new Date();
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(tokens || {})) {
        if (v === null || v === undefined) continue;
        out[k] = String(v);
    }
    // Built-ins (don't overwrite user-provided values)
    if (!('year' in out)) out.year = String(now.getFullYear());
    if (!('month' in out)) out.month = now.toLocaleString('en', { month: 'long' });
    if (!('date_iso' in out)) out.date_iso = now.toISOString().slice(0, 10);
    return out;
}

export function substituteString(s: string, tokens: Record<string, string>): string {
    if (!s || typeof s !== 'string') return s;
    return s.replace(TOKEN_RE, (_m, key) => {
        if (key in tokens) return tokens[key];
        return `{{${key}}}`; // leave as-is when token missing
    });
}

/** Deep-walk any value, substituting strings. Arrays + plain objects only. */
export function substituteDeep<T>(value: T, tokens: Tokens): T {
    const t = withBuiltIns(tokens);
    const walk = (v: any): any => {
        if (typeof v === 'string') return substituteString(v, t);
        if (Array.isArray(v)) return v.map(walk);
        if (v && typeof v === 'object') {
            const out: any = {};
            for (const [k, val] of Object.entries(v)) out[k] = walk(val);
            return out;
        }
        return v;
    };
    return walk(value);
}
