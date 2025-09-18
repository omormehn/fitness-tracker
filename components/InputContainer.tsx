import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { InputContainerProps } from '@/types/types'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
const InputContainer = ({ placeholder, type, theme, value, onChangeText, iconName, width = '100%', inputWidth = '90%' }: InputContainerProps) => {
    const [showEye, setShow] = useState(false)
    const eyeIcon = showEye ? 'eye' : 'eye-off'
    const toggleEye = () => setShow(!showEye)

    return (
        <View style={[styles.container, { width: width }, theme === 'dark' ? { backgroundColor: '#161818' } : { backgroundColor: '#F7F8F8' }]}>
            <View style={styles.input} >
                <MaterialIcons name={iconName} size={24} color={theme === 'dark' ? 'white' : 'black'} />
                <TextInput
                    placeholderTextColor={theme === 'dark' ? '#ACA3A5' : '#A5A3B0'}
                    placeholder={placeholder}
                    secureTextEntry={type === 'password' && !showEye}
                    value={value}
                    onChangeText={onChangeText}
                    style={[{
                        width: inputWidth, fontFamily: "PoppinsRegular",
                        fontSize: 13,
                    }, theme === 'dark' ? { color: 'white' } : { color: 'black' }]}
                />
            </View>
            {type === 'password' && (
                <View style={{ position: 'absolute', right: 14, top: 18 }}>
                    <Ionicons onPress={toggleEye} name={eyeIcon} size={18} color={theme === 'dark' ? 'white' : 'black'} />
                </View>)}
        </View>
    )
}

export default InputContainer

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }
})