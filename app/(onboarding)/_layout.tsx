import { useAuthStore } from "@/store/useAuthStore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";


export default function ScreenLayout() {
    
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
        </Stack>
    )
}