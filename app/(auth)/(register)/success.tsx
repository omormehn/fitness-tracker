import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import SuccessLight from '@/assets/images/light/regsuccess.svg'
import SuccessDark from '@/assets/images/dark/regsuccess.svg'
import { Colors } from '@/theme/Colors'
import Button from '@/components/button'
import { router } from 'expo-router'

const RegSuccess = () => {
    const { theme, colors } = useTheme();
    const Svg = theme === 'light' ? SuccessLight : SuccessDark;
    const routeToHome = () => {
        router.replace('/(tabs)')
    }
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top SVG */}
            <Svg width='100%' height='40%' />

            {/* Text */}
            <View style={{ gap: 8, width: '60%', alignItems: 'center', marginTop: 40 }}>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20, color: colors.text }}>Welcome, Nathan</Text>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: Colors.tintText2, textAlign: 'center' }}>You are all set now, let’s reach your goals together with us</Text>
            </View>

            {/* Button */}
            <TouchableOpacity onPress={routeToHome} style={{ position: 'absolute', bottom: 0, paddingBottom: 40, }}>
                <Button text='Go To Home' />
            </TouchableOpacity>
        </View >
    )
}

export default RegSuccess

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 100,
    }
})