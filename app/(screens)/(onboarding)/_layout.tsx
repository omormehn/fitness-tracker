import { Stack } from "expo-router";


export default function ScreenLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
        </Stack>
    )
}