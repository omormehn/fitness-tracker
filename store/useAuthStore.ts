import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/axios';
import { AuthState } from '@/types/types';


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: false,
    error: null,

    login: async (data) => {
        try {
            set({ loading: true, error: null });
            const res = await api.post("/auth/login", data);
            console.log(res.data)
            await AsyncStorage.setItem("token", res.data.accessToken);
            set({ user: res.data.user, token: res.data.token });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Login failed", loading: false });
            console.error("Login error", err.response?.data || err.message);
        } finally {
            set({ loading: false });
        }
    },


    register: async (data) => {
        try {
            set({ loading: true, error: null });
            const res = await api.post("/auth/register", data);
            await AsyncStorage.setItem("token", res.data.accessToken);
            set({ user: res.data.user, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Registration failed", loading: false });
            console.log(err)
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem("token");
        set({ user: null, token: null });
    },


    //  load saved session
    loadSession: async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            // fetch user details using token
            set({ token });
        }
    },
}));
