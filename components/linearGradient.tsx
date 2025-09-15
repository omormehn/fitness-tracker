import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient, type LinearGradientPoint } from 'expo-linear-gradient'
import { useTheme } from '@/context/ThemeContext'
import type { StyleProp, ViewStyle } from 'react-native';


interface LinearGradientProps {
    start?: LinearGradientPoint;
    end?: LinearGradientPoint;
    styles: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
const LinearGradientComponent = ({ start = { x: 0, y: 0 }, end = { x: 1, y: 1 }, styles, children }: LinearGradientProps) => {
    const { gradients } = useTheme();
    return (
        <LinearGradient
            colors={gradients.card}
            start={start}
            end={end}
            style={styles}
        >
            {children}
        </LinearGradient>
    )
}

export default LinearGradientComponent

