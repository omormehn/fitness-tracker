import { Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import InputContainer from '@/components/InputContainer';
import Button from '@/components/button';
import Seperator from '@/components/Seperator';
import SocialsContainer from '@/components/SocialContianer';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorText from '@/components/ErrorText';
import FullPageLoader from '@/components/PageLoader';





const LoginScreen = () => {
    const { colors, theme } = useTheme();
    const { loading, error, login, setAuth, setError, googleSignIn } = useAuthStore();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [isloading, setIsLoading] = useState(false)



    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            const ok = await googleSignIn();
            if (ok) {
                router.replace('/(tabs)')
            }
        } catch (error) {
            console.log('err in goog', error)
        } finally {
            setIsLoading(false)
        }
    }

    const routeToReg = () => {
        router.push('/(auth)/(register)/register')
        setError({ field: null, msg: null })
    }


    if (isloading) {
        return (
            <FullPageLoader visible={isloading} />
        )
    }

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };
    const showToast = () => {
        ToastAndroid.showWithGravityAndOffset(
            'A wild toast appeared!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );

    };
    const handleLogin = async () => {
        try {
            if (form.email.length <= 0) {
                setError({ field: 'email', msg: 'Invalid Email Address' })
            }
            const res = await login(form)
            if (res) router.replace('/(tabs)')
        } catch (error) {
            console.log('err', error)
        }
    };
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top section */}
            <View>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 16, color: colors.text, textAlign: 'center' }}>Hey there,</Text>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20, color: colors.text }}>Welcome Back</Text>
            </View>

            {/* Form */}
            <View style={{ marginTop: 40, gap: 20 }}>
                <View>
                    <InputContainer
                        placeholder='Email'
                        iconName={'mail-outline'}
                        theme={theme}
                        value={form.email}
                        onChangeText={(v) => handleChange('email', v)}
                    />
                    {error.field === 'email' && <ErrorText msg={error.msg} />}
                </View>

                <View>
                    <InputContainer
                        placeholder='Password'
                        iconName={'lock-outline'}
                        theme={theme}
                        type='password'
                        value={form.password}
                        onChangeText={(v) => handleChange('password', v)}
                    />
                    {error.field === 'password' && <ErrorText msg={error.msg} />}
                </View>

                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: colors.tintText3, textDecorationLine: 'underline', textAlign: 'center' }}>Forgot your password?</Text>
            </View>


            {/* Button */}
            <TouchableOpacity activeOpacity={0.8} disabled={loading} onPress={handleLogin} style={styles.button} >
                <Button loading={loading} text='Login' />
            </TouchableOpacity>

            {/* Divider */}
            <View >
                <Seperator />
            </View>

            {/* Socials */}
            <View style={{ top: 60, flexDirection: 'row', gap: 30 }} >
                <SocialsContainer onpress={handleGoogleSignIn} name='logo-google' />
                {/* <SocialsContainer onpress={showToast} name='logo-facebook' /> */}
            </View>

            <View style={{ top: 100 }}>
                <Text style={{ color: colors.text, fontFamily: 'PoppinsRegular' }}>Don't Have an account?  <Text onPress={routeToReg} style={{ fontFamily: 'PoppinsMedium', color: '#C150F6' }}>Register</Text></Text>
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