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
const LinearGradientComponent = ({ 
    start = { x: 0, y: 0 }, 
    end = { x: 1, y: 1 }, 
    style, 
    children 
}: LinearGradientProps) => {
    const { gradients } = useTheme();
    return (
        <LinearGradient
            colors={gradients.card}
            start={start}
            end={end}
            style={style}
        >
            {children}
        </LinearGradient>
    )
}

export default LinearGradientComponent

