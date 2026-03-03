import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios'; // Import dari file yang kita buat di atas
import { SignalIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            // Tembak ke endpoint login Laravel
            const response = await api.post('/login', {
                email,
                password,
            });

            if (response.data.status === 'success') {
                // Simpan token ke localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_name', response.data.user);

                // Pindah ke halaman dashboard
                navigate('/dashboard');
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Gagal terhubung ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50">

                <div className="flex flex-col items-center">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 mb-4">
                        <SignalIcon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-950">
                        AFF <span className="text-blue-600">NET</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                        Sistem Monitoring Jaringan FTTH
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all sm:text-sm"
                                placeholder="Email Admin"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                    >
                        {loading ? 'Memeriksa...' : 'Masuk Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}