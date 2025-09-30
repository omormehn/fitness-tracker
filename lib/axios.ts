import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_SERVER_URI}/api`,
    timeout: 10000,
    withCredentials: true
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const { data } = await axios.post(
                    `${process.env.EXPO_PUBLIC_SERVER_URI}/api/auth/refresh-token`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = data;

                await AsyncStorage.setItem("token", accessToken);
                await AsyncStorage.setItem("refreshToken", newRefreshToken);

                // Update the header and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                await AsyncStorage.multiRemove(['token', 'refreshToken']);
                // Redirect to login screen
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;