import { useAuthStore } from "@/store/useAuthStore";
import { router, Slot, Stack, useSegments } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
    const { user, hasOnboarded } = useAuthStore();
    const segments = useSegments();

    useEffect(() => {
        if (user && hasOnboarded) {
            router.replace('/(tabs)');
        }

        if (user && !hasOnboarded) {
            router.replace('/(onboarding)');
        }
    }, [user, hasOnboarded]);

    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(register)" options={{ headerShown: false }} />
        </Stack>
    )
}