import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/axios';
import { AuthState } from '@/types/types';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { ToastAndroid } from 'react-native';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            initialized: false,
            loading: false,
            error: { field: '', msg: '' },
            hasOnboarded: false,
            setAuth: ({ user, token }) => set({ user, token }),
            setError: (error: { field: string | null, msg: string | null }) => set({ error }),
            setOnboarded: () => set({ hasOnboarded: true }),


            login: async (data) => {
                try {
                    set({ loading: true,  error: { field: null, msg: null } });
                    const res = await api.post("/auth/login", data);
                    const token = res.data.accessToken ?? res.data.token;

                    if (token) {
                        api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    }
                    set({ user: res.data.user, token });
                    return true;
                } catch (err: any) {
                    const errors = err.response?.data?.errors;
                    console.log('err', errors)
                    if (Array.isArray(errors) && errors.length > 0) {
                        set({ error: { field: errors[0].field, msg: errors[0].message } });
                    } else {
                        set({ error: { msg: "Login failed" } });
                    }
                    return false;
                } finally {
                    set({ loading: false, });
                }
            },

            register: async (data) => {
                try {
                    set({ loading: true, error: { field: null, msg: null } });
                    const res = await api.post("/auth/register", data);
                    console.log('res', res.data);
                    const token = res.data.accessToken;
                    console.log('tkk', token);
                    if (token) {
                        api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    }
                    set({ user: res.data.user, token });
                    return true;
                } catch (err: any) {
                    console.log('err', err)
                    const errors = err.response?.data?.errors;
                    console.log('err', errors)
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

            updateUser: async (data) => {
                try {
                    set({ loading: true, error: { field: null, msg: null } });
                    const res = await api.post("/auth/update", data);
                    set({ user: res.data.user });
                    return true;
                } catch (err: any) {
                    console.log('err', err)
                    const errors = err.response?.data?.errors;
                    console.log('err', errors)
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
                set({ loading: true })
                try {
                    await GoogleSignin.hasPlayServices();
                    await GoogleSignin.signOut();
                    const res = await GoogleSignin.signIn();
                    if (isSuccessResponse(res)) {
                        const { idToken, } = res.data
                        const serverResponse = await api.post('/auth/google', {
                            token: idToken,
                        })
                        console.log('ser', serverResponse.data)
                        const { user, accessToken } = serverResponse.data;
                        console.log('usr', user)
                        await AsyncStorage.setItem("token", accessToken);
                        set({ user, token: accessToken });
                        set({ error: { field: null, msg: null } })
                        return true

                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            'Sign in canceled',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                        );
                        return false
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
                                console.log('err', error.code)
                        }
                    } else {
                        console.log('err in goog', error)
                    }
                    return false;
                } finally {
                    set({ loading: false })
                }
            },

            logout: async () => {
                try {
                    delete (api.defaults.headers.common as any).Authorization;
                } finally {
                    set({ user: null, token: null });
                }
            },
            initializeAuthState: async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));



                    set({ initialized: false });
                } catch (error) {
                    console.error('Error initializing auth state:', error);
                    set({ initialized: false, });
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                hasOnboarded: state.hasOnboarded,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.loading = false;
                }
            },
        }
    )
);

