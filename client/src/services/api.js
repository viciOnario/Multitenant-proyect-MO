import axios from 'axios';

// 1. Lógica Inteligente de URL:
// Si estamos en Vercel, usa la variable de entorno VITE_API_URL.
// Si estamos en tu PC (local), usa http://localhost:5000/api.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor para el Token (Esencial para tu AuthContext):
// Antes de enviar cualquier petición, revisa si hay un token guardado.
// Si existe, lo agrega al header "Authorization".
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;