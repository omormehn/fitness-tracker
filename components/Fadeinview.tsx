import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'

const FadeInView = ({ children }: { children: React.ReactNode }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start()
    }, [])

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            {children}
        </Animated.View>
    )
}

export default FadeInView

const styles = StyleSheet.create({})