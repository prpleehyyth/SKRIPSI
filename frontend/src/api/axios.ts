import axios from 'axios';

// Buat instance axios khusus
const api = axios.create({
    // Sesuaikan dengan port Nginx/Laravel kamu di docker
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor: Otomatis selipkan token di setiap request jika tokennya ada
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;