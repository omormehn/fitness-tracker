import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/axios';


interface AuthState {
    user: null | { id: string; email: string };
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: false,

    login: async (email, password) => {
        try {
            set({ loading: true });
            const { data } = await api.post("/auth/login", { email, password });
            await AsyncStorage.setItem("token", data.token);
            set({ user: data.user, token: data.token });
        } catch (err: any) {
            console.error("Login error", err.response?.data || err.message);
        } finally {
            set({ loading: false });
        }
    },


    register: async (email, password) => {
        try {
            set({ loading: true });
            const { data } = await api.post("/auth/register", { email, password });
            await AsyncStorage.setItem("token", data.token);
            set({ user: data.user, token: data.token });
        } catch (err: any) {
            console.error("Register error", err.response?.data || err.message);
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
