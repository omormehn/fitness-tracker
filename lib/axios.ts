import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

console.log(process.env.EXPO_PUBLIC_SERVER_URI)
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
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized, logging out…");
            //clear AsyncStorage or trigger Zustand logout here
        }
        return Promise.reject(error);
    }
);

export default api;
