import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import Button from '@/components/button'
import { router } from 'expo-router'

const SettingScreen = () => {
    const { logout } = useAuthStore()
    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login')
    }
    return (
        <Pressable onPress={handleLogout}>
            <Button text='Logout' />
        </Pressable>
    )
}

export default SettingScreen

const styles = StyleSheet.create({})