import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient, type LinearGradientPoint } from 'expo-linear-gradient'
import { useTheme } from '@/context/ThemeContext'
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';



interface LinearGradientProps {
    start?: LinearGradientPoint;
    end?: LinearGradientPoint;
    style: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    gradient: any
}

const LinearGradientComponent = ({
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    gradient,
    style,
    children
}: LinearGradientProps) => {

    return (
        <LinearGradient
            colors={gradient}
            start={start}
            end={end}
            style={style}
        >
            {children}
        </LinearGradient>
    )
}

export default LinearGradientComponent

