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
    console.log('eirn')
    GoogleSignin.configure({
      iosClientId: '98467727321-m1iq635u0lrvbmvoq7nlfgm7o9h8hm4c.apps.googleusercontent.com',
      webClientId: '98467727321-tlh2jutsbagmosnnu20sqgsotsoosp5c.apps.googleusercontent.com',
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

  async function scheduleSleepAlarm(time: string, message: string) {
    const date = new Date(time);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sleep Reminder 😴',
        body: message,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date
      },
    });
  }

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  console.log('env', process.env.EXPO_PUBLIC_CLIENT_ID)


  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { user, initializeAuthState, hasOnboarded, initialized, initializing, token, refreshToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const hasNavigated = useRef(false);

  useEffect(() => {
    initializeAuthState();
  }, [initializeAuthState]);


  useEffect(() => {
    if (initializing) return;
    if (!navigationState?.key) return;

    // Only navigate once
    if (hasNavigated.current) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inAppGroup = segments[0] === '(tabs)';

    let targetRoute: any = null;

    if (!hasOnboarded) {
      if (!inOnboardingGroup) targetRoute = '/(onboarding)';
    } else if (!user || !token || !refreshToken) {
      if (!inAuthGroup) targetRoute = '/(auth)/login';
    } else {
      if (!inAppGroup) targetRoute = '/(tabs)';
    }
    hasNavigated.current = true;

    if (targetRoute) {
      setTimeout(() => {
        router.replace(targetRoute);
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 100);
      }, 50);
    } else {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
    }

  }, [navigationState?.key, user, hasOnboarded, segments]);
  console.log('ss', hasNavigated.current, navigationState?.key, initializing)


  if (initializing || !navigationState?.key || !hasNavigated.current) {
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

  console.log('onboard', hasOnboarded)
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