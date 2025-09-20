import { Stack } from "expo-router";


export default function RegisterLayout() {

    return (
        <Stack>
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="register2" options={{ headerShown: false }} />
            <Stack.Screen name="goals" options={{ headerShown: false }} />
            <Stack.Screen name="success" options={{ headerShown: false }} />
        </Stack>
    )
}