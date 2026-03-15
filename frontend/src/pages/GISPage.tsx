import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Icon, Ico } from '../components/Icons';

// --- Fix Bug Icon Bawaan Leaflet di React ---
// Kita pakai link CDN eksternal agar icon tidak pecah/hilang saat di-build lokal
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Definisikan Tipe Data dari API Laravel ---
interface SignalLog {
  rx_power: number;
  status: string;
  created_at: string;
}

interface Odp {
  id: number;
  name: string;
}

interface Onu {
  id: number;
  mac_address: string;
  customer_name: string;
  latitude: number;
  longitude: number;
  odp: Odp;
  signal_logs: SignalLog[]; 
}

export default function GISPage() {
    const [onus, setOnus] = useState<Onu[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // GANTI INI DENGAN IP PUBLIC AWS KAMU:
        // Karena backend di AWS dan frontend di laptop lokal, pastikan IP-nya bisa diakses
        fetch('http://172.31.24.243:8000/api/onus') 
            .then((res) => res.json())
            .then((response) => {
                if (response.success) {
                    setOnus(response.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Gagal menarik data GIS:", error);
                setLoading(false);
            });
    }, []);

    // Tampilan Loading (memakai desain orisinil kamu yang keren)
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center p-5">
                <div className="text-center anim-fade-up">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <Ico d={Icon.map} size={28} color="#2563eb" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-700 mb-1">Memuat Peta (GIS)...</h2>
                    <p className="text-sm text-slate-400 max-w-xs">
                        Sedang menyinkronkan data koordinat dan redaman OLT secara real-time.
                    </p>
                </div>
            </div>
        );
    }

    // Tampilan Setelah Data Berhasil Ditarik
    return (
        <div className="h-full w-full flex flex-col p-5">
            {/* Header GIS */}
            <div className="mb-4 flex items-center gap-3 anim-fade-up">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                    <Ico d={Icon.map} size={24} color="#2563eb" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-700">Peta Jaringan (GIS)</h2>
                    <p className="text-sm text-slate-400">Monitoring Pemetaan ODP dan ONU FTTH</p>
                </div>
            </div>
            
            {/* Kontainer Peta Leaflet */}
            <div className="flex-1 w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
                {/* zIndex: 0 penting agar peta tidak menutupi sidebar/navbar kamu */}
                <MapContainer center={[-7.472, 112.433]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Looping Marker Pelanggan */}
                    {onus.map((onu) => {
                        const lastLog = onu.signal_logs && onu.signal_logs.length > 0 ? onu.signal_logs[0] : null;
                        
                        // Logika Pewarnaan Status Redaman
                        let statusColor = "#334155"; // slate-700 (Default)
                        let bgColor = "#f1f5f9"; // slate-100 (Default)
                        
                        if (lastLog?.status === "Normal") { statusColor = "#15803d"; bgColor = "#dcfce3"; } // Hijau
                        if (lastLog?.status === "Warning") { statusColor = "#a16207"; bgColor = "#fef9c3"; } // Kuning
                        if (lastLog?.status === "Critical") { statusColor = "#b91c1c"; bgColor = "#fee2e2"; } // Merah

                        return (
                            <Marker key={onu.id} position={[onu.latitude, onu.longitude]}>
                                <Popup>
                                    <div className="min-w-[200px] font-sans">
                                        <h3 className="font-bold text-slate-800 text-base mb-1">{onu.customer_name}</h3>
                                        <p className="text-xs text-slate-500 mb-2">ODP Induk: <strong>{onu.odp?.name || 'Tidak diketahui'}</strong></p>
                                        
                                        <div className="border-t border-slate-200 my-2"></div>
                                        
                                        <p className="text-sm text-slate-600 mb-1">
                                            <strong>MAC:</strong> <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{onu.mac_address}</span>
                                        </p>
                                        
                                        {/* Kotak Status Redaman */}
                                        <div className="mt-3 p-2.5 rounded-lg border" style={{ backgroundColor: bgColor, borderColor: statusColor + '40' }}>
                                            <p className="text-xs text-slate-600 mb-1 font-semibold">Redaman (Rx Power):</p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm" style={{ color: statusColor }}>
                                                    {lastLog ? `${lastLog.rx_power} dBm` : 'N/A'}
                                                </span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" 
                                                      style={{ backgroundColor: 'white', color: statusColor, border: `1px solid ${statusColor}40` }}>
                                                    {lastLog ? lastLog.status : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}