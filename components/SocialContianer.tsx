import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

const SocialsContainer = ({ name, onpress, disable }: { name: any, onpress?: (e: GestureResponderEvent) => void, disable?: boolean }) => {
    return (
        <TouchableOpacity activeOpacity={0.5} disabled={disable} onPress={onpress} style={styles.container}>
            <Ionicons name={name} size={30} />
        </TouchableOpacity>
    )
}

export default SocialsContainer

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#423C3D',
        borderRadius: 20
    }
})