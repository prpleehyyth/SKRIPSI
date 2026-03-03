import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './api/axios' // Menggunakan axios yang sudah disisipi Token

// ─── Types ────────────────────────────────────────────────────────────────────

interface Device {
  device_id: number
  hostname: string
  sysName: string
  ip: string
  hardware: string
  os: string
  version: string
  status: number
}

type Page = 'dashboard' | 'inventory' | 'gis'
type FilterStatus = 'all' | 'online' | 'offline'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK: Device[] = [
  { device_id: 1, hostname: 'core-sw-01', sysName: 'CORE-SW-01', ip: '192.168.1.1', hardware: 'Cisco Catalyst 9300', os: 'IOS-XE', version: '17.9.3', status: 1 },
  { device_id: 2, hostname: 'dist-rt-01', sysName: 'DIST-RT-01', ip: '192.168.1.2', hardware: 'MikroTik CCR2004', os: 'RouterOS', version: '7.12.1', status: 1 },
  { device_id: 3, hostname: 'acc-sw-floor2', sysName: 'ACC-SW-F2', ip: '192.168.2.10', hardware: 'TP-Link TL-SG3428', os: 'TL-OS', version: '2.0.3', status: 0 },
  { device_id: 4, hostname: 'ap-lobby-01', sysName: 'AP-LOBBY-01', ip: '10.10.1.20', hardware: 'Ubiquiti U6-Pro', os: 'UniFi', version: '6.6.55', status: 1 },
  { device_id: 5, hostname: 'fw-main', sysName: 'FW-MAIN', ip: '192.168.0.1', hardware: 'Fortinet FG-100F', os: 'FortiOS', version: '7.4.2', status: 1 },
  { device_id: 6, hostname: 'nms-server', sysName: 'NMS-SERVER', ip: '10.0.0.5', hardware: 'Dell PowerEdge R440', os: 'Ubuntu', version: '22.04', status: 1 },
  { device_id: 7, hostname: 'acc-sw-floor3', sysName: 'ACC-SW-F3', ip: '192.168.3.10', hardware: 'TP-Link TL-SG3428', os: 'TL-OS', version: '2.0.1', status: 0 },
  { device_id: 8, hostname: 'ap-ruang-rapat', sysName: 'AP-RAPAT-01', ip: '10.10.1.21', hardware: 'Ubiquiti U6-Lite', os: 'UniFi', version: '6.5.28', status: 1 },
  { device_id: 9, hostname: 'dist-sw-02', sysName: 'DIST-SW-02', ip: '192.168.1.3', hardware: 'HP Aruba 2930F', os: 'ArubaOS', version: '16.11.0', status: 1 },
  { device_id: 10, hostname: 'ap-kantor-01', sysName: 'AP-KANTOR-01', ip: '10.10.1.22', hardware: 'Ubiquiti U6-Mesh', os: 'UniFi', version: '6.6.55', status: 0 },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icon = {
  wifi: <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />,
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
  server: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v.75a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18v-.75m19.5 0a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.75A2.25 2.25 0 0119.5 21H4.5a2.25 2.25 0 01-2.25-2.25V18m19.5-9V15M2.25 6v9m19.5-9v9M2.25 6a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25v.75H2.25V6z" />,
  map: <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />,
  search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />,
  refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />,
  pin: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>,
  check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  xcirc: <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  device: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
  logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
}

function Ico({ d, size = 16, color = 'currentColor', spin = false }: { d: React.ReactNode; size?: number; color?: string; spin?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.75}
      className={spin ? 'spin' : ''}
      style={{ flexShrink: 0 }}>
      {d}
    </svg>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent, delay }: {
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
  )
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function DashboardPage({ devices }: { devices: Device[] }) {
  const online = devices.filter(d => d.status === 1).length
  const offline = devices.filter(d => d.status === 0).length
  const total = devices.length
  const uptime = total ? `${Math.round((online / total) * 100)}%` : '—'

  // Group by OS
  const byOS = devices.reduce<Record<string, { total: number; online: number }>>((acc, d) => {
    const key = d.os || 'Unknown'
    if (!acc[key]) acc[key] = { total: 0, online: 0 }
    acc[key].total++
    if (d.status === 1) acc[key].online++
    return acc
  }, {})

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
              const pct = Math.round((stat.online / stat.total) * 100)
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
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function InventoryPage({ devices, loading, onRefresh, refreshing, lastUpdated }: {
  devices: Device[]
  loading: boolean
  onRefresh: () => void
  refreshing: boolean
  lastUpdated: string
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('all')

  const total = devices.length
  const online = devices.filter(d => d.status === 1).length
  const offline = devices.filter(d => d.status === 0).length

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return devices.filter(d => {
      const matchSearch = !q || [d.sysName, d.hostname, d.ip, d.hardware, d.os]
        .some(v => v?.toLowerCase().includes(q))
      const matchFilter =
        filter === 'all' ||
        (filter === 'online' && d.status === 1) ||
        (filter === 'offline' && d.status === 0)
      return matchSearch && matchFilter
    })
  }, [devices, search, filter])

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
  )
}

function GISPage() {
  return (
    <div className="h-full flex items-center justify-center p-5">
      <div className="text-center anim-fade-up">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <Ico d={Icon.map} size={28} color="#2563eb" />
        </div>
        <h2 className="text-lg font-bold text-slate-700 mb-1">Peta Jaringan (GIS)</h2>
        <p className="text-sm text-slate-400 max-w-xs">
          Fitur peta jaringan geografis sedang dalam pengembangan. Akan segera hadir.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: '#fef9c3', color: '#a16207', border: '1px solid #fde68a' }}>
          🚧 Coming Soon
        </span>
      </div>
    </div>
  )
}

// ─── Root MainDashboard ───────────────────────────────────────────────────────

export default function MainDashboard() {
  const navigate = useNavigate()
  const [page, setPage] = useState<Page>('dashboard')
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchDevices = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await api.get('/inventory')
      setDevices(res.data.data ?? res.data ?? [])
    } catch (error: any) {
      // TAMBAHKAN BARIS INI UNTUK MELIHAT PENYAKIT ASLINYA 👇
      console.error("Gagal ambil data API:", error.response || error.message);

      setDevices(MOCK)
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLastUpdated(new Date().toLocaleTimeString('id-ID'))
    }
  }

  useEffect(() => { fetchDevices() }, [])

  // Fungsi Logout Baru
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_name')
    navigate('/login')
  }

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Icon.home },
    { id: 'inventory', label: 'Inventaris Perangkat', icon: Icon.server },
    { id: 'gis', label: 'Peta Jaringan (GIS)', icon: Icon.map },
  ]

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-10 h-10 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 spin" />
        </div>
        <p className="text-sm text-slate-400 font-medium">Memuat inventaris…</p>
      </div>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Top Navbar ── */}
      <header style={{
        flexShrink: 0,
        height: 56,
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Ico d={Icon.wifi} size={15} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: '#0f172a', letterSpacing: '-0.02em' }}>
              AFF <span style={{ color: '#2563eb' }}>NET</span>
            </div>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1, marginTop: 2 }}>
              Inventory System
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: '#e2e8f0', marginRight: 20, flexShrink: 0 }} />

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`nav-link ${page === item.id ? 'active' : ''}`}
            >
              <Ico d={item.icon} size={14} color={page === item.id ? '#2563eb' : '#94a3b8'} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>
            <Ico d={Icon.pin} size={12} color="#94a3b8" />
            Kudu, Jombang
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, background: '#f0fdf4', color: '#15803d',
            border: '1px solid #bbf7d0', borderRadius: 99, padding: '3px 10px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
              className="dot-pulse" />
            {devices.filter(d => d.status === 1).length}/{devices.length} Online
          </div>

          {/* Tombol Logout Baru */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: '#fee2e2', color: '#dc2626',
              padding: '4px 10px', borderRadius: '6px',
              fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer'
            }}
          >
            <Ico d={Icon.logout} size={12} color="#dc2626" />
            Keluar
          </button>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main style={{ flex: 1, overflow: 'hidden', background: '#f1f5f9' }}>
        {page === 'dashboard' && <DashboardPage devices={devices} />}
        {page === 'inventory' && (
          <InventoryPage
            devices={devices}
            loading={loading}
            onRefresh={() => fetchDevices(true)}
            refreshing={refreshing}
            lastUpdated={lastUpdated}
          />
        )}
        {page === 'gis' && <GISPage />}
      </main>
    </div>
  )
}