import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/axios';
import { AuthState } from '@/types/types';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { ToastAndroid } from 'react-native';
import { router } from 'expo-router';
import { TokenService } from '@/lib/tokenService';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            initialized: false,
            justRegistered: false,
            loading: false,
            error: { field: '', msg: '' },
            hasOnboarded: false,

            setAuth: ({ user, token }) => set({ user, token }),
            setError: (error: { field: string | null, msg: string | null }) => set({ error }),
            setOnboarded: () => set({ hasOnboarded: true }),

            login: async (data) => {
                try {
                    set({ loading: true, error: { field: null, msg: null } });
                    const res = await api.post("/auth/login", data);
                    const { refreshToken, accessToken, user } = res.data;

                    await TokenService.setTokens(accessToken, refreshToken);

                    set({
                        user: user || null,
                        token: accessToken,
                        refreshToken
                    });

                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    if (!user?.weight || !user?.height) {
                        setTimeout(() => {
                            router.replace('/(auth)/(register)/register2');
                        }, 100);
                    }

                    return true;
                } catch (err: any) {
                    const errors = err.response?.data?.errors;
                    if (Array.isArray(errors) && errors.length > 0) {
                        set({ error: { field: errors[0].field, msg: errors[0].message } });
                    } else {
                        set({ error: { msg: "Login failed" } });
                    }
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            register: async (data) => {
                try {
                    set({ loading: true, error: { field: null, msg: null }, justRegistered: true });
                    const res = await api.post("/auth/register", data);
                    const { refreshToken, accessToken, user } = res.data;
                    const id = user?.id;
                    await TokenService.setTokens(accessToken, refreshToken);

                    set({
                        token: accessToken,
                        refreshToken
                    });

                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    return id;
                } catch (err: any) {
                    const errors = err.response?.data?.errors;
                    if (Array.isArray(errors) && errors.length > 0) {
                        set({ error: { field: errors[0].field, msg: errors[0].message } });
                    } else {
                        set({ error: { msg: "Registration failed" } });
                    }
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            clearRegisterFlag: () => set({ justRegistered: false }),
            updateUser: async (data) => {
                try {
                    set({ loading: true, error: { field: null, msg: null } });
                    const res = await api.post("/auth/update", data);
                    set({ user: res.data.user });
                    return true;
                } catch (err: any) {
                    const errors = err.response?.data?.errors;
                    if (Array.isArray(errors) && errors.length > 0) {
                        set({ error: { field: errors[0].field, msg: errors[0].message } });
                    } else {
                        set({ error: { msg: "Update failed" } });
                    }
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            googleSignIn: async () => {
                set({ loading: true });
                try {
                    await GoogleSignin.hasPlayServices();
                    await GoogleSignin.signOut();
                    const res = await GoogleSignin.signIn();

                    if (isSuccessResponse(res)) {
                        const { idToken } = res.data;
                        const serverResponse = await api.post('/auth/google', {
                            token: idToken,
                        });

                        const { user, accessToken, refreshToken } = serverResponse.data;

                        await TokenService.setTokens(accessToken, refreshToken);

                        set({
                            user,
                            token: accessToken,
                            refreshToken,
                            error: { field: null, msg: null }
                        });


                        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                        if (!user?.weight || !user?.height) {
                            setTimeout(() => {
                                router.replace('/(auth)/(register)/register2');
                            }, 100);
                        } else {
                            setTimeout(() => {
                                router.replace('/(tabs)');
                            }, 100);
                        }

                        return true;
                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            'Sign in canceled',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                        );
                        return false;
                    }
                } catch (error) {
                    if (isErrorWithCode(error)) {
                        switch (error.code) {
                            case statusCodes.IN_PROGRESS:
                                ToastAndroid.showWithGravityAndOffset(
                                    'Sign in in progress',
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    50,
                                );
                                break;
                            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                                ToastAndroid.showWithGravityAndOffset(
                                    'Google play services was not detected',
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    50,
                                );
                                break;
                            default:
                                console.error(error);
                                ToastAndroid.showWithGravityAndOffset(
                                    'Network Error, Please try again',
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    50,
                                );
                        }
                    }
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                try {
                    await AsyncStorage.multiRemove(['token', 'refreshToken']);
                    delete (api.defaults.headers.common as any).Authorization;
                } finally {
                    set({
                        user: null,
                        token: null,
                        refreshToken: null
                    });
                }
            },

            initializeAuthState: async () => {
                try {
                    const [refreshToken, token] = await Promise.all([
                        AsyncStorage.getItem('refreshToken'),
                        AsyncStorage.getItem('token')
                    ])

                    if (token) {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }

                    set({ refreshToken, token, initialized: true, });
                } catch (error) {
                    console.error('Error initializing auth state:', error);
                    set({ initialized: true });
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                hasOnboarded: state.hasOnboarded,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.loading = false;
                    state.initialized = false;
                }
            },
        }
    )
);