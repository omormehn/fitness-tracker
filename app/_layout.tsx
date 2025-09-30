import { ThemeProvider } from '@/context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { router, Stack, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
      profileImageSize: 150
    })
  }, [])

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function LoadingScreen() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000'
    }}>
      <ActivityIndicator size="large" color={'#fff'} />
    </View>
  );
}

function RootLayoutNav() {
  const { user, initializeAuthState, hasOnboarded, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationAttempted = useRef(false);

  useEffect(() => {
    initializeAuthState();
  }, []);

  useEffect(() => {

    if (loading) return;

    // Prevent multiple navigation attempts
    if (navigationAttempted.current) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inAppGroup = segments[0] === '(tabs)';

    let shouldNavigate = false;
    let targetRoute: any = '';

    if (!user && !inAuthGroup) {
      shouldNavigate = true;
      targetRoute = '/(auth)/login';
    } else if (user && !hasOnboarded && !inOnboardingGroup) {
      shouldNavigate = true;
      targetRoute = '/(onboarding)';
    } else if (user && hasOnboarded && (inAuthGroup || inOnboardingGroup)) {
      shouldNavigate = true;
      targetRoute = '/(tabs)';
    }

    navigationAttempted.current = true;

    if (shouldNavigate) {
      router.replace(targetRoute);
    }
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);

  }, [loading, user, hasOnboarded, segments]);


  if (loading || !navigationAttempted.current) {
    return null;
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