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
    TouchableOpacity
} from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import BlobDark from "@/assets/images/dark/regblob.svg"
import BlobLight from "@/assets/images/light/regblob.svg"
import InputContainer from '@/components/InputContainer'
import { LinearGradient } from 'expo-linear-gradient'
import Button from '@/components/button'

const RegisterScreen2 = () => {
    const { colors, theme, gradients } = useTheme();
    const { height } = useWindowDimensions()
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
                    <View style={styles.blobContainer}>
                        {dark ? (
                            <BlobDark width="100%" height="100%" />
                        ) : (
                            <BlobLight width="100%" height="100%" />
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
                            {/* Todo, add a select package */}
                            {/* Use a date picker */}
                            <InputContainer iconName={'date-range'} placeholder='Date of Birth' theme={theme} />

                            {/* Todo create a component */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <InputContainer width={'80%'} iconName={'monitor-weight'} placeholder='Your Weight' theme={theme} />

                                <LinearGradient
                                    colors={gradients.onboarding}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{ paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <View style={{ backgroundColor: '' }}><Text style={{ color: colors.text, fontFamily: 'PoppinsMedium', fontSize: 12 }}>KG</Text></View>
                                </LinearGradient>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <InputContainer width={'80%'} iconName={'height'} placeholder='Your Height' theme={theme} />
                                <LinearGradient
                                    colors={gradients.onboarding}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{ paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <View style={{ backgroundColor: '' }}><Text style={{ color: colors.text, fontFamily: 'PoppinsMedium', fontSize: 12 }}>CM</Text></View>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Button */}
                        <TouchableOpacity style={styles.buttonContainer}>
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
    blobContainer: {
        height: '40%',
        width: '100%',
        minHeight: 200,
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
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 'auto', 
        paddingBottom: 20, 
    }
})