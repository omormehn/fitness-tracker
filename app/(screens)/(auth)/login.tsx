import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import InputContainer from '@/components/InputContainer';
import Button from '@/components/button';
import Seperator from '@/components/seperator';
import SocialsContainer from '@/components/SocialContianer';
import { router } from 'expo-router';


const LoginScreen = () => {
    const { colors, theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top section */}
            <View>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 16, color: colors.text, textAlign: 'center' }}>Hey there,</Text>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20, color: colors.text }}>Welcome Back</Text>
            </View>

            {/* Form */}
            <View style={{ marginTop: 40, gap: 20 }}>
                <InputContainer
                    placeholder='Email'
                    iconName={'mail-outline'}
                    theme={theme}
                />
                <InputContainer
                    placeholder='Password'
                    iconName={'lock-outline'}
                    theme={theme}
                    type='password'
                />
                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: colors.tintText3, textDecorationLine: 'underline', textAlign: 'center' }}>Forgot your password?</Text>
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} >
                <Button text='Login' />
            </TouchableOpacity>

            {/* Divider */}
            <View >
                <Seperator  />
            </View>

            {/* Socials */}
            <View style={{ top: 60, flexDirection: 'row', gap: 30 }} >
                <SocialsContainer name='logo-google' />
                <SocialsContainer name='logo-facebook' />
            </View>

            <View style={{ top: 100 }}>
                <Text style={{ color: colors.text, fontFamily: 'PoppinsRegular' }}>Don't Have an account?  <Text onPress={() => router.push('/register')} style={{ fontFamily: 'PoppinsMedium', color: '#C150F6' }}>Register</Text></Text>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40
    },
    button: {
        marginTop: 100
    }
})