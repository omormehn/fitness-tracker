import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import BlobDark from "@/assets/images/dark/regblob.svg"
import BlobLight from "@/assets/images/light/regblob.svg"
import InputContainer from '@/components/InputContainer'
import { LinearGradient } from 'expo-linear-gradient'
import Button from '@/components/button'
import { Dropdown } from 'react-native-element-dropdown'
import { Gender } from '@/types/types'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router'

const OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
]
const { width, height } = Dimensions.get('window')
const RegisterScreen2 = () => {
    const { colors, theme, gradients } = useTheme();
    const { height } = useWindowDimensions()

    const [form, setForm] = useState({
        gender: null,
        dob: '',
        weight: '',
        height: ''
    })

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const dark = theme === 'dark'

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: colors.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {/* Top section */}
                    <View >
                        {dark ? (
                            <BlobDark width="100%" height={height * 0.35} />
                        ) : (
                            <BlobLight width="100%" height={height * 0.35} />
                        )}
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        {/* Header Text */}
                        <View style={styles.header}>
                            <Text style={{ fontFamily: "PoppinsBold", fontSize: 20, color: colors.text }}>
                                Let's complete your profile
                            </Text>
                            <Text style={{ fontFamily: "PoppinsRegular", fontSize: 12, color: colors.text }}>
                                It will help us to know more about you!
                            </Text>
                        </View>

                        {/* Text Input */}
                        <View style={styles.inputsContainer}>
                            <View style={{ justifyContent: 'center' }} className='relative justify-center'>
                                <View style={{ position: 'absolute', top: 15, left: 10, zIndex: 1 }}>
                                    <Ionicons name='people-outline' size={24} color={theme === 'dark' ? 'white' : 'black'} />
                                </View>
                                <Dropdown
                                    style={[styles.dropdown, theme === 'dark' ? { backgroundColor: '#161818' } : { backgroundColor: '#F7F8F8' }]}
                                    placeholderStyle={[{ fontSize: 13, fontFamily: 'PoppinsRegular', left: 35, top: 2 }, theme === 'dark' ? { color: '#ACA3A5' } : { color: '#A5A3B0' }]}
                                    selectedTextStyle={{ fontSize: 13, color: colors.text, fontFamily: 'PoppinsRegular', left: 35, top: 2 }}
                                    iconStyle={{ width: 20, height: 23, tintColor: colors.text }}
                                    data={OPTIONS}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Choose Gender"
                                    onChange={item => { handleChange('gender', item); }}
                                />
                            </View>
                            {/* Use a date picker */}
                            <InputContainer iconName={'date-range'} placeholder='Date of Birth' theme={theme} value={form.dob} onChangeText={(v) => handleChange('dob', v)} />

                            {/* Todo create a component */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <InputContainer width={'80%'} iconName={'monitor-weight'} placeholder='Your Weight' theme={theme} value={form.weight} onChangeText={(v) => handleChange('weight', v)} />

                                <LinearGradient
                                    colors={gradients.onboarding}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{ paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <View ><Text style={{ color: colors.text, fontFamily: 'PoppinsMedium', fontSize: 12 }}>KG</Text></View>
                                </LinearGradient>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <InputContainer width={'80%'} iconName={'height'} placeholder='Your Height' theme={theme} value={form.height} onChangeText={(v) => handleChange('height', v)} />
                                <LinearGradient
                                    colors={gradients.onboarding}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{ paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <View ><Text style={{ color: colors.text, fontFamily: 'PoppinsMedium', fontSize: 12 }}>CM</Text></View>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Button */}
                        <TouchableOpacity onPress={() => router.push('/goals')} style={styles.buttonContainer}>
                            <Button text='Next' />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default RegisterScreen2

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    inputsContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 0,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 'auto',
        paddingBottom: 50,
    },
    dropdown: {
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 55,
        borderWidth: 1,

    }
})