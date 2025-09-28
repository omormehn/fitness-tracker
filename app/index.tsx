import { Redirect, useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function Index() {
    const { hasOnboarded, token } = useAuthStore();
    console.log('token', token)

    const router = useRouter();

    useEffect(() => {
        console.log('sjsj')
    }, [])

    useEffect(() => {
        if (!hasOnboarded) {
            router.replace("/(onboarding)");
        } else if (!token) {
            router.replace("/(auth)/login");
        } else {
            router.replace("/(tabs)");
        }
    }, [hasOnboarded, token]);

    return null;
}
