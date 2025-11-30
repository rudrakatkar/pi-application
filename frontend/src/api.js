import axios from 'axios';

// --- THE FIX ---
// If we are building for production (on the Pi), use '/api'
// If we are developing locally (on Laptop), use 'http://localhost:3000'
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3000'; 
// ----------------

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to attach the token
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