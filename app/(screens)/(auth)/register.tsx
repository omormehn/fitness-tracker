import { LogBox, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import InputContainer from '@/components/InputContainer'

import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '@/components/button';
import SocialsContianer from '@/components/SocialContianer';



const RegisterScreen = () => {

    const { theme, colors } = useTheme()
    const [checked, setChecked] = useState(false);
    return (
        <View style={[styles.container, theme === 'dark' ? { backgroundColor: colors.onboardingBg } : { backgroundColor: '#FFFFFF' }]}>
            {/* Top Section */}
            <View className='flex-col gap-2'>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 16, color: colors.text, textAlign: 'center' }}>Hey there,</Text>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 24, color: colors.text }}>Create an Account</Text>
            </View>

            {/* Form */}
            <View className='w-full gap-4 pt-10'>
                <InputContainer iconName={'person-outline'} placeholder='Full Name' theme={theme} />
                <InputContainer iconName={'phone'} placeholder='Phone Number' theme={theme} />
                <InputContainer iconName={'mail-outline'} placeholder='Email' theme={theme} />
                <InputContainer type='password' iconName={'lock-outline'} placeholder='Password' theme={theme} />
            </View>

            {/* Terms */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => setChecked(!checked)} style={styles.terms}>
                <Pressable
                    style={[styles.checkboxBase, checked && styles.checkboxChecked]}

                >
                    {checked && <Ionicons name="checkmark" size={16} color="white" />}
                </Pressable>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>
                    By continuing you accept our Privacy Policy and <Text className='underline'>Term of Use</Text>
                </Text>
            </TouchableOpacity>

            {/* button */}
            <TouchableOpacity style={{ marginTop: 100 }}>
                <Button text='Register' />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.seperator} >
                <View style={styles.divider} />
                <View style={styles.divider} />
                <View style={styles.smallText}>
                    <Text style={{ color: colors.text }}>Or</Text>
                </View>
            </View>

            {/* Socials */}
            <View style={{ top: 60, flexDirection: 'row', gap: 30 }} >
                <SocialsContianer name='logo-google' />
                <SocialsContianer name='logo-facebook' />
            </View>

            {/* Bottom */}
            <View style={{ top: 100 }}>
                <Text style={{ color: colors.text, fontFamily: 'PoppinsRegular' }}>Already Have an account? <Text style={{fontFamily: 'PoppinsMedium', color: '#C150F6'}}>Login</Text></Text>

            </View>
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 30,
    },
    checkboxBase: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#999",
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxChecked: {
        backgroundColor: "#6B50F6",
        borderColor: "#6B50F6",
    },
    terms: {
        flexDirection: 'row',
        // alignItems: 'center',
        gap: 15,
        paddingTop: 20,
        paddingHorizontal: 15
    },
    seperator: {
        flexDirection: 'row',
        gap: 30,
        justifyContent: 'center'
    },
    divider: {
        backgroundColor: '#423C3D',
        top: 30,
        height: 1,
        paddingHorizontal: 80,
    },
    smallText: {
        top: 20,
        position: 'absolute'
    }
})