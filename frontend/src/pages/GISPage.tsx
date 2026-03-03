
import { Icon, Ico } from '../components/Icons';

export default function GISPage() {
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
    );
}