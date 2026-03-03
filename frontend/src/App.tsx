import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainDashboard from './MainDashboard';

// Komponen Satpam (Protected Route)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Kalau nggak bawa tiket (token), usir ke halaman login
        return <Navigate to="/login" replace />;
    }

    // Kalau bawa tiket, silakan masuk
    return <>{children}</>;
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rute Bebas (Publik) */}
                <Route path="/login" element={<Login />} />

                {/* Rute Terkunci (Privat) */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Jika buka root URL (/), langsung arahkan ke dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}