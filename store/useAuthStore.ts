import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/axios';
import { AuthState } from '@/types/types';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: false,
    error: null,

    hasOnboarded: false,

    setOnboarded: async () => {
        await AsyncStorage.setItem("hasOnboarded", "true");
        set({ hasOnboarded: true });
    },

    checkOnboarding: async () => {
        const value = await AsyncStorage.getItem("hasOnboarded");
        set({ hasOnboarded: value === "true" });
    },

    login: async (data) => {
        try {
            set({ loading: true, error: null });
            const res = await api.post("/auth/login", data);
            const token = res.data.accessToken ?? res.data.token;
            if (token) {
                await AsyncStorage.setItem("token", res.data.accessToken);
                api.defaults.headers.common.Authorization = `Bearer ${token}`;
            }
            set({ user: res.data.user, token });
            return true
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Login failed", });
            console.error("Login error", err.response?.data || err.message);
            return false;
        } finally {
            set({ loading: false });
        }
    },


    register: async (data) => {
        try {
            set({ loading: true, error: null });
            const res = await api.post("/auth/register", data);
            const token = res.data.accessToken;
            if (token) {
                await AsyncStorage.setItem("token", token);
                api.defaults.headers.common.Authorization = `Bearer ${token}`
            }
            set({ user: res.data.user, token: token });
            return true;
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Registration failed" });
            console.log(err)
            return false
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
