import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import InputContainer from '@/components/InputContainer'

import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '@/components/button';
import { router } from 'expo-router';
import Seperator from '@/components/Seperator';
import SocialsContainer from '@/components/SocialContianer';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { register } from '@/server/controllers/authController';



const RegisterScreen = () => {

    const { theme, colors } = useTheme()
    const [checked, setChecked] = useState(false);
    const { loading, error, register } = useAuthStore();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };
    const handleRegister = async () => {
        try {
            await register(form)
        } catch (error) {
            console.log('err', error)
        }
    };

    return (
        <ScrollView style={[
            theme === 'dark'
                ? { backgroundColor: colors.background }
                : { backgroundColor: '#FFFFFF' },
        ]} contentContainerStyle={styles.container}>
            {/* Top Section */}
            <View className='flex-col gap-2'>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 16, color: colors.text, textAlign: 'center' }}>Hey there,</Text>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 24, color: colors.text }}>Create an Account</Text>
            </View>

            {/* Form */}
            <View className='w-full gap-4 pt-10'>
                <InputContainer value={form.fullName} textContentType='name' onChangeText={(v) => handleChange("fullName", v)} iconName={'person-outline'} placeholder='Full Name' theme={theme} />
                <InputContainer value={form.email} textContentType='emailAddress' onChangeText={(v) => handleChange("email", v)} iconName={'mail-outline'} placeholder='Email' theme={theme} />
                <InputContainer value={form.phone} textContentType='telephoneNumber' onChangeText={(v) => handleChange("phone", v)} iconName={'phone'} placeholder='Phone Number' theme={theme} />
                <InputContainer value={form.password} textContentType='password' onChangeText={(v) => handleChange("password", v)} inputWidth={'80%'} type='password' iconName={'lock-outline'} placeholder='Password' theme={theme} />
            </View>
            {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
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
            <TouchableOpacity disabled={loading} onPress={handleRegister} style={{ marginTop: 100 }}>
                <Button loading={loading} text='Register' />
            </TouchableOpacity>

            {/* Divider */}
            <Seperator />

            {/* Socials */}
            <View style={{ top: 60, flexDirection: 'row', gap: 30 }} >
                <SocialsContainer name='logo-google' />
                <SocialsContainer name='logo-facebook' />
            </View>

            {/* Bottom */}
            <View style={{ top: 100 }}>
                <Text style={{ color: colors.text, fontFamily: 'PoppinsRegular' }}>Already Have an account? <Text onPress={() => router.push('/login')} style={{ fontFamily: 'PoppinsMedium', color: '#C150F6' }}>Login</Text></Text>
            </View>
        </ScrollView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 30,
        paddingBottom: 150,
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

})