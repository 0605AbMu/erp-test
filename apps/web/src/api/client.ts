// api/client.ts

import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';
import { refreshTokenApi } from './auth';
import { notification } from 'antd';

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

const refreshAvailableErrorMessages = ["token_version_mismatch"]
//logout if token invalid
api.interceptors.response.use(async (val) => {

    if (val.status === 401 && refreshAvailableErrorMessages.includes(val.data?.error?.message)) {
        const refreshed = await refreshToken();

        if (refreshed)
            return val;

        useAuthStore.getState().logout();
        window.location.href = "/";
    }

    return val;
});

let refreshPromise: Promise<boolean> | null = null;

const refreshToken = async () => {
    if (!refreshPromise) {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
            useAuthStore.getState().logout();
            return false;
        }

        try {
            const result = await refreshTokenApi(refreshToken);
            useAuthStore.getState().setToken(result.accessToken, result.refreshToken);

            return true;
        } catch (error: any) {
            useAuthStore.getState().logout();

            notification.error({ description: error.message });

            return false;
        }
    }
    return refreshPromise;
}