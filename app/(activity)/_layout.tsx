import { useAuthStore } from "@/store/useAuthStore";
import { Slot, Stack } from "expo-router";

export default function ScreenLayout() {
    const { user } = useAuthStore()
    if (!user) return null;
    return (
        <Stack>
            <Stack.Screen name="sleeptracker" options={{ headerShown: false }} />
            <Stack.Screen name="sleepschedule" options={{ headerShown: false }} />
            <Stack.Screen name="waterintake" options={{ headerShown: false }} />
        </Stack>
    )
}