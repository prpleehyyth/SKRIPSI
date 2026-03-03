
import type { Device } from '../types';
import StatCard from '../components/StatCard';
import { Icon, Ico } from '../components/Icons';

export default function DashboardPage({ devices }: { devices: Device[] }) {
    const online = devices.filter(d => d.status === 1).length;
    const offline = devices.filter(d => d.status === 0).length;
    const total = devices.length;
    const uptime = total ? `${Math.round((online / total) * 100)}%` : '—';

    // Group by OS
    const byOS = devices.reduce<Record<string, { total: number; online: number }>>((acc, d) => {
        const key = d.os || 'Unknown';
        if (!acc[key]) acc[key] = { total: 0, online: 0 };
        acc[key].total++;
        if (d.status === 1) acc[key].online++;
        return acc;
    }, {});

    return (
        <div className="h-full flex flex-col gap-4 overflow-auto p-5">
            {/* Stat row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
                <StatCard label="Total Perangkat" value={total} sub="terdaftar di sistem" accent="#2563eb" delay="0.04s" />
                <StatCard label="Online" value={online} sub="aktif & terhubung" accent="#16a34a" delay="0.08s" />
                <StatCard label="Offline" value={offline} sub="tidak merespons" accent="#dc2626" delay="0.12s" />
                <StatCard label="Uptime Jaringan" value={uptime} sub="availability rate" accent="#7c3aed" delay="0.16s" />
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">

                {/* Recent devices */}
                <div className="card flex flex-col lg:col-span-2 min-h-0 anim-fade-up s3">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-shrink-0">
                        <Ico d={Icon.device} size={15} color="#2563eb" />
                        <span className="text-sm font-semibold text-slate-700">Perangkat Terbaru</span>
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {['Nama', 'IP', 'OS', 'Status'].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {devices.slice(0, 8).map(d => (
                                    <tr key={d.device_id} className="tbl-row">
                                        <td className="px-4 py-2.5 font-medium text-slate-800 text-xs">{d.sysName}</td>
                                        <td className="px-4 py-2.5 text-slate-400 font-mono text-xs">{d.ip}</td>
                                        <td className="px-4 py-2.5 text-slate-500 text-xs">{d.os}</td>
                                        <td className="px-4 py-2.5">
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
                </div>

                {/* OS breakdown */}
                <div className="card flex flex-col min-h-0 anim-fade-up s4">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-shrink-0">
                        <Ico d={Icon.chart} size={15} color="#7c3aed" />
                        <span className="text-sm font-semibold text-slate-700">Distribusi OS</span>
                    </div>
                    <div className="overflow-auto flex-1 p-3 flex flex-col gap-2">
                        {Object.entries(byOS).sort((a, b) => b[1].total - a[1].total).map(([os, stat]) => {
                            const pct = Math.round((stat.online / stat.total) * 100);
                            return (
                                <div key={os} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-semibold text-slate-700">{os}</span>
                                        <span className="text-xs text-slate-400">{stat.online}/{stat.total}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%`, background: pct === 100 ? '#16a34a' : pct > 50 ? '#2563eb' : '#dc2626' }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">{pct}% online</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}