import { Stack } from "expo-router";


export default function ScreenLayout() {
    return (
        <Stack>
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    )
}