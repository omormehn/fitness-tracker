import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function Index() {
    const { hasOnboarded, token } = useAuthStore();

    if (!hasOnboarded) return <Redirect href="/(onboarding)" />;
    if (!token) return <Redirect href="/(auth)/login" />;
    return <Redirect href="/(tabs)" />;
}
