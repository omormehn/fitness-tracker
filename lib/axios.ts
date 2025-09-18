import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const api = axios.create({
    baseURL: `http://${process.env.EXPO_PUBLIC_SERVER_URL}/`,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
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
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized, logging out…");
            //clear AsyncStorage or trigger Zustand logout here
        }
        return Promise.reject(error);
    }
);

export default api;
