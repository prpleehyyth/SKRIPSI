

export default function StatCard({ label, value, sub, accent, delay }: {
    label: string; value: string | number; sub: string; accent: string; delay: string
}) {
    return (
        <div className={`card p-4 anim-fade-up flex flex-col gap-3`} style={{ animationDelay: delay }}>
            <div className="w-2 h-2 rounded-full dot-pulse" style={{ background: accent }} />
            <div>
                <p className="text-2xl font-bold tracking-tight" style={{ color: accent, fontVariantNumeric: 'tabular-nums' }}>
                    {value}
                </p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}