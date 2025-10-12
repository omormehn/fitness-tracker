import axios from 'axios';
import { TokenService } from './tokenService';
import { router } from 'expo-router';

const api = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    async (config) => {
        const token = await TokenService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await TokenService.getRefreshToken();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URL}/api/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                await TokenService.setTokens(accessToken, newRefreshToken);

              
                const { useAuthStore } = await import('@/store/useAuthStore');
                useAuthStore.getState().setAuth({
                    user: useAuthStore.getState().user,
                    token: accessToken
                });

                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                isRefreshing = false;

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;


                await TokenService.clearTokens();

                setTimeout(() => {
                    router.replace('/(auth)/login');
                }, 0);

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;