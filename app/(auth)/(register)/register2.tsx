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
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router'
import { useAuthStore } from "@/store/useAuthStore";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'


const OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
]
const { width, height } = Dimensions.get('window')
const RegisterScreen2 = () => {
    const { colors, theme, gradients } = useTheme();
    const { height } = useWindowDimensions()
    const { updateUser, loading } = useAuthStore()

    const dark = theme === 'dark'

    const [gender, setGender] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));

    const { userId } = useLocalSearchParams()


    const [form, setForm] = useState({
        gender: null,
        weight: "",
        height: ""
    })

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        if (!form) return;
        try {
            const data = { ...form, userId, dob: dateOfBirth };
            const ok = await updateUser(data)
            if (ok) router.push('/goals')
        } catch (error) {
            console.log('err', error)
        }
    }


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
                                    value={gender}
                                    onChange={item => {
                                        setGender(item.value);
                                        handleChange('gender', item.value);
                                    }}
                                />
                            </View>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.datePicker, styles.dropdown, theme === 'dark' ? { backgroundColor: '#161818', } : { backgroundColor: '#F7F8F8', }]}>
                                <MaterialIcons name='date-range' size={24} color={theme === 'dark' ? 'white' : 'black'} />
                                <Text style={[styles.dateSelectorText, { color: colors.tintText3 }]}>
                                    {dateOfBirth.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </TouchableOpacity>
                            {/* Date Picker */}
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dateOfBirth}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (date) setDateOfBirth(date);
                                    }}
                                />
                            )}
                            {/* Todo create a component */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <InputContainer width={'80%'} iconName={'monitor-weight'} placeholder='Your Weight' theme={theme} keyboardType="decimal-pad" value={form.weight} onChangeText={(v) => handleChange('weight', v)} />

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
                                <InputContainer width={'80%'} iconName={'height'} placeholder='Your Height' theme={theme} keyboardType="decimal-pad" value={form.height} onChangeText={(v) => handleChange('height', v)} />
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
                        <TouchableOpacity disabled={loading} onPress={handleSubmit} style={styles.buttonContainer}>
                            <Button loading={loading} text='Next' />
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
    dateSelectorText: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
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
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})