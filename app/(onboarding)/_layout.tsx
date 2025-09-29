import { useAuthStore } from "@/store/useAuthStore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";


export default function ScreenLayout() {
    const { user, hasOnboarded } = useAuthStore();

    useEffect(() => {
        if (!user) {
            router.replace('/(auth)/login');
            return;
        }
        if (hasOnboarded) {
            router.replace('/(tabs)');
        }
    }, [user, hasOnboarded]);
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
        </Stack>
    )
}