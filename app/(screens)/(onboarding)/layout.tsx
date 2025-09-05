import { Stack } from "expo-router";


export default function ScreenLayout() {
    return (
        <Stack>
            <Stack.Screen name="(screens)/(onboarding)/onboardingscreen1" options={{ headerShown: false }} />
        </Stack>
    )
}