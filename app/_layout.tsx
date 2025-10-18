import { ThemeProvider } from '@/context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { router, Stack, useSegments, useRouter, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    ...FontAwesome.font,
  });


  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
      profileImageSize: 150
    })
  }, [])


  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get permission for notifications!');
        return;
      }
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }

  useEffect(() => {
    if (error) throw error;
  }, [error]);



  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { user, initializeAuthState, hasOnboarded, initialized, justRegistered, clearRegisterFlag, } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const hasNavigated = useRef(false);

  useEffect(() => {
    initializeAuthState();
  }, []);


  useEffect(() => {
    if (!initialized || !navigationState?.key) return;
    if (hasNavigated.current) return;
    console.log('navigating', hasOnboarded)
    // Only navigate once
    hasNavigated.current = true;

    const determineRoute = () => {
      if (!hasOnboarded) {
        return '/(onboarding)';
      }
      if (!user) {
        return '/(auth)/login';
      }
      if (user && justRegistered) {
        return '/(auth)/(register)/register2';
      }
      return '/(tabs)';
    };


    const targetRoute = determineRoute();


    setTimeout(() => {
      router.replace(targetRoute as any);
      if (justRegistered) {
        useAuthStore.getState().clearRegisterFlag();
      }
      SplashScreen.hideAsync();
    }, 100);

  }, [navigationState?.key, user, hasOnboarded, initialized, justRegistered]);


  if (!navigationState?.key || !hasNavigated.current) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000'
        }}
      >
        <ActivityIndicator size={40} color={'white'} />
      </View >
    );
  }

  return (
    <ThemeProvider>
      <StatusBar backgroundColor={'black'} barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}