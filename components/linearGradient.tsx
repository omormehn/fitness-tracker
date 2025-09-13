import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient, LinearGradientPoint } from 'expo-linear-gradient'
import { useTheme } from '@/context/ThemeContext'
import { StyleProp, ViewStyle } from 'react-native';

type LinearGradientPoint = { x: number; y: number };

interface LinearGradientProps {
    start?: LinearGradientPoint;
    end?: LinearGradientPoint;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
const LinearGradientComponent = ({ x1, x2, y1, y2, styles, children }: LinearGradientProps) => {
    const { gradients } = useTheme();
    return (
        <LinearGradient
            colors={gradients.card}
            start={{ x: x1!, y: y1! }}
            end={{ x: x2!, y: y2! }}
            style={styles}
        >
            {children}
        </LinearGradient>
    )
}

export default LinearGradientComponent

