import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '@/context/ThemeContext'
const screenWidth = Dimensions.get('window').width;

const Button = ({ text }: { text: string }) => {
    const { gradients } = useTheme()

    return (
        <LinearGradient
            colors={gradients.button}
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

        width: screenWidth * 0.85,
        alignSelf: 'center',
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