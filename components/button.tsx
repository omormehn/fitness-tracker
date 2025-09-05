import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '@/context/ThemeContext'

const Button = ({ text }: { text: string }) => {

    return (
        <LinearGradient
            colors={['#983BCB', '#4023D7']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.container}
        >
            <Text style={styles.text}>{text}</Text>
        </LinearGradient>
    )
}

export default Button

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 120,
        paddingVertical: 15,
        borderRadius: 30
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'PoppinsBold',
        fontSize: 16    
    }
})