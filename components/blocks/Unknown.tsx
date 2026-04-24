export default function Unknown({ type }: { type: string }) {
    return (
        <section className="wp-section">
            <div className="wp-container">
                <div className="rounded-lg border p-4 text-sm"
                     style={{ borderColor: 'rgba(234, 179, 8, 0.3)', background: 'rgba(234, 179, 8, 0.1)', color: '#fde68a' }}>
                    Unknown block type: <code>{type}</code> — add it under <code>components/blocks/</code> and register it in <code>components/blocks/index.tsx</code>.
                </div>
            </div>
        </section>
    );
}
