import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, MapIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name') || 'Admin';

    const handleLogout = () => {
        // Hapus token dan data user dari memory browser
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');

        // Tendang kembali ke halaman login
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Navbar Atas */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">
                                AFF <span className="text-blue-600">NET</span> Monitoring
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-600">
                                Halo, {userName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Konten Utama (Tempat Map Leaflet & Data OLT nanti diletakkan) */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-2xl h-96 flex flex-col items-center justify-center bg-white">
                        <MapIcon className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium text-lg">
                            Area Peta GIS & Data Redaman OLT akan tampil di sini
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}