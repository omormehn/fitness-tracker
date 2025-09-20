import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/axios';
import { AuthState } from '@/types/types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,
            hasOnboarded: false,


            setOnboarded: () => set({ hasOnboarded: true }),

            login: async (data) => {
                try {
                    set({ loading: true, error: null });
                    const res = await api.post("/auth/login", data);
                    const token = res.data.accessToken ?? res.data.token;

                    if (token) {
                        api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    }

                    set({ user: res.data.user, token });
                    return true;
                } catch (err: any) {
                    set({ error: err.response?.data?.message || "Login failed" });
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
                        api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    }

                    set({ user: res.data.user, token });
                    return true;
                } catch (err: any) {
                    set({ error: err.response?.data?.message || "Registration failed" });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                set({ user: null, token: null });
            },
        }),
        {
            name: "auth-storage", 
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

