import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

const SocialsContianer = ({ name }: { name: any }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Ionicons name={name} size={30} />
        </TouchableOpacity>
    )
}

export default SocialsContianer

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