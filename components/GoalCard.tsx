import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '@/context/ThemeContext'
import { CarouselProps } from '@/types/types'

const GoalCard = ({ lightImage, darkImage, title, description }: CarouselProps) => {
    const { gradients, theme, colors } = useTheme();
    const ImageComponent = theme === 'dark' ? darkImage : lightImage

    return (
        <LinearGradient
            colors={gradients.onboarding}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <ImageComponent width='100%' height='70%' />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{description}</Text>
        </LinearGradient>
    )
}

export default GoalCard

const styles = StyleSheet.create({
    card: {
        width: '80%',
        height: '90%',
        borderRadius: 20,
        alignItems: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontFamily: 'PoppinsBold',
        marginTop: 25,
        color: 'white'
    },
    desc: {
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
        marginTop: 6,
        textAlign: 'center',
        color: 'white'
    },
})