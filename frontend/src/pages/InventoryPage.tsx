import { useState, useMemo } from 'react';
import type { Device, FilterStatus } from '../types';
import { Icon, Ico } from '../components/Icons';

export default function InventoryPage({ devices, loading, onRefresh, refreshing, lastUpdated }: {
    devices: Device[]
    loading: boolean
    onRefresh: () => void
    refreshing: boolean
    lastUpdated: string
}) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterStatus>('all');

    const total = devices.length;
    const online = devices.filter(d => d.status === 1).length;
    const offline = devices.filter(d => d.status === 0).length;

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return devices.filter(d => {
            const matchSearch = !q || [d.sysName, d.hostname, d.ip, d.hardware, d.os]
                .some(v => v?.toLowerCase().includes(q));
            const matchFilter =
                filter === 'all' ||
                (filter === 'online' && d.status === 1) ||
                (filter === 'offline' && d.status === 0);
            return matchSearch && matchFilter;
        });
    }, [devices, search, filter]);

    return (
        <div className="h-full flex flex-col p-5 gap-4 min-h-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 flex-shrink-0 anim-fade-up">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
                    >
                        Semua <span className="pill-count">{total}</span>
                    </button>
                    <button
                        onClick={() => setFilter('online')}
                        className={`filter-pill ${filter === 'online' ? 'active' : ''}`}
                    >
                        Online <span className="pill-count">{online}</span>
                    </button>
                    <button
                        onClick={() => setFilter('offline')}
                        className={`filter-pill ${filter === 'offline' ? 'active' : ''}`}
                    >
                        Offline <span className="pill-count">{offline}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {lastUpdated && (
                        <span className="text-xs text-slate-400 hidden sm:block">Update: {lastUpdated}</span>
                    )}

                    {/* Search */}
                    <div className="relative">
                        <Ico d={Icon.search} size={14} color="#94a3b8" />
                        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <Ico d={Icon.search} size={14} color="#94a3b8" />
                        </span>
                        <input
                            type="text"
                            className="input-search"
                            placeholder="Cari nama, IP, OS…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <button onClick={onRefresh} disabled={refreshing} className="btn btn-ghost">
                        <Ico d={Icon.refresh} size={14} spin={refreshing} />
                        {refreshing ? 'Memuat…' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card flex flex-col flex-1 min-h-0 overflow-hidden anim-fade-up s2">
                <div className="overflow-auto flex-1">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                            <tr>
                                {[
                                    { label: '#', w: 48 },
                                    { label: 'Perangkat & IP' },
                                    { label: 'Hardware' },
                                    { label: 'OS & Versi' },
                                    { label: 'Status', center: true },
                                ].map(h => (
                                    <th
                                        key={h.label}
                                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                                        style={{ width: h.w, textAlign: h.center ? 'center' : undefined }}
                                    >
                                        {h.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">Memuat data…</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="flex flex-col items-center py-14 text-slate-300">
                                            <Ico d={Icon.xcirc} size={36} color="#cbd5e1" />
                                            <p className="text-sm font-medium text-slate-400 mt-2">Tidak ada perangkat ditemukan</p>
                                            <p className="text-xs text-slate-300 mt-0.5">Coba ubah filter atau kata kunci</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map((d, i) => (
                                <tr key={d.device_id} className="tbl-row">
                                    <td className="px-4 py-3 text-xs text-slate-300 font-mono">{String(i + 1).padStart(2, '0')}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-slate-800 text-sm leading-tight">{d.sysName || d.hostname}</p>
                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{d.ip}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500">{d.hardware || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] font-mono px-2 py-0.5 rounded"
                                            style={{ background: '#f1f5f9', color: '#64748b' }}>
                                            {d.os} {d.version}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {d.status === 1
                                            ? <span className="badge-online"><span className="w-1.5 h-1.5 rounded-full bg-green-500 dot-pulse" />Online</span>
                                            : <span className="badge-offline"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Offline</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                    <span className="text-xs text-slate-400">
                        Menampilkan <strong className="text-slate-600">{filtered.length}</strong> dari <strong className="text-slate-600">{total}</strong> perangkat
                    </span>
                    <span className="text-xs text-slate-300">AFF NET Inventory</span>
                </div>
            </div>
        </div>
    );
}