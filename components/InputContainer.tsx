import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { InputContainerProps } from '@/types/types'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
const InputContainer = ({ placeholder, type, theme, iconName = 'son', }: InputContainerProps) => {
    const [showEye, setShow] = useState(false)
    const eyeIcon = showEye ? 'eye' : 'eye-off'
    const toggleEye = () => setShow(!showEye)

    return (
        <View style={[styles.container, theme === 'dark' ? { backgroundColor: '#161818' } : { backgroundColor: '#F7F8F8' }]}>
            <View style={styles.input} className='flex-row'>
                <MaterialIcons name={iconName} size={24} color={theme === 'dark' ? 'white' : 'black'} />
                <TextInput
                    placeholderTextColor={theme === 'dark' ? '#ACA3A5' : '#A5A3B0'}
                    placeholder={placeholder}
                    secureTextEntry={type === 'password' && !showEye}
                    style={[{ width: '80%' }, theme === 'dark' ? { color: 'white' } : { color: 'black' }]}
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