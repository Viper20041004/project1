import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('[DEBUG INTERCEPTOR] Request URL:', config.url);
        console.log('[DEBUG INTERCEPTOR] Token from localStorage:', token ? 'EXISTS (' + token.substring(0, 20) + '...)' : 'NOT_FOUND');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[DEBUG INTERCEPTOR] Authorization header SET');
        } else {
            console.log('[DEBUG INTERCEPTOR] Authorization header NOT SET (no token)');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Auto logout or redirect to login
            // localStorage.removeItem('access_token');
            // window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return api.post('/api/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    },
    loginJson: (username, password) => {
        console.log('[DEBUG] loginJson called with:', { username, password: password ? '***' : 'empty' });
        console.log('[DEBUG] Actual body:', JSON.stringify({ username, password }));
        return api.post('/api/auth/login/json', { username, password });
    },
    register: (data) => api.post('/api/auth/register', data),
    getMe: (token = null) => {
        const authToken = token || localStorage.getItem('access_token');
        console.log('[DEBUG] getMe called with token:', authToken ? 'PROVIDED' : 'FROM_STORAGE');
        return api.get('/api/auth/me', {
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
        });
    },
};

export const chatService = {
    send: (message) => api.post('/api/chat/send', { message, role: "user" }),
    getHistory: (limit = 50, offset = 0) => api.get(`/api/chat/history?limit=${limit}&offset=${offset}`),
    delete: (chatId) => api.delete(`/api/chat/history/${chatId}`),
};

export default api;
