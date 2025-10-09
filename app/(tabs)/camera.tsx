import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext';

const CameraScreen = () => {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={{color: colors.text}}>Screen Not Complete</Text>
        </View>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})