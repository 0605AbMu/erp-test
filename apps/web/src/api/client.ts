// api/client.ts

import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    validateStatus: null
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

//logout if token invalid
api.interceptors.response.use((val) => {

    if (val.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = "/"; 
    }

    return val;
});