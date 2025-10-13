import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenService = {
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('token');
  },

  getRefreshToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('refreshToken');
  },

  setTokens: async (token: string, refreshToken: string): Promise<void> => {
    await Promise.all([
      AsyncStorage.setItem('token', token),
      AsyncStorage.setItem('refreshToken', refreshToken)
    ]);
  },

  clearTokens: async (): Promise<void> => {
    await AsyncStorage.multiRemove(['token', 'refreshToken']);
  }
};