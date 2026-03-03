import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';
import type { Device, Page } from './types';
import { MOCK } from './data/mock';
import { Icon, Ico } from './components/Icons';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import GISPage from './pages/GISPage';

export default function MainDashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>('dashboard');
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchDevices = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.get('/inventory');
      setDevices(res.data.data ?? res.data ?? []);
    } catch (error: any) {
      console.error("Gagal ambil data API:", error.response || error.message);
      setDevices(MOCK);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Icon.home },
    { id: 'inventory', label: 'Inventaris Perangkat', icon: Icon.server },
    { id: 'gis', label: 'Peta Jaringan (GIS)', icon: Icon.map },
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-10 h-10 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 spin" />
        </div>
        <p className="text-sm text-slate-400 font-medium">Memuat  Data…</p>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Top Navbar ── */}
      <header style={{
        flexShrink: 0, height: 56, background: 'white', borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Ico d={Icon.wifi} size={15} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: '#0f172a', letterSpacing: '-0.02em' }}>
              AFF <span style={{ color: '#2563eb' }}>NET</span>
            </div>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1, marginTop: 2 }}>
              Monitoring System
            </div>
          </div>
        </div>

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
            <Ico d={Icon.pin} size={12} color="#94a3b8" /> Puri, Mojokerto
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, background: '#f0fdf4', color: '#15803d',
            border: '1px solid #bbf7d0', borderRadius: 99, padding: '3px 10px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} className="dot-pulse" />
            {devices.filter(d => d.status === 1).length}/{devices.length} Online
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, background: '#fee2e2', color: '#dc2626',
              padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer'
            }}
          >
            <Ico d={Icon.logout} size={12} color="#dc2626" /> Keluar
          </button>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main style={{ flex: 1, overflow: 'hidden', background: '#f1f5f9' }}>
        {page === 'dashboard' && <DashboardPage devices={devices} />}
        {page === 'inventory' && (
          <InventoryPage devices={devices} loading={loading} onRefresh={() => fetchDevices(true)} refreshing={refreshing} lastUpdated={lastUpdated} />
        )}
        {page === 'gis' && <GISPage />}
      </main>
    </div>
  );
}