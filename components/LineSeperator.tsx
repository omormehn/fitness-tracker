import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext';

const screenWidth = Dimensions.get('window').width
const LineSeperator = () => {
    const { colors } = useTheme();

    return (
        <View style={styles.seperator} >
            <View style={styles.divider} />
            <View style={styles.divider} />
            <View style={styles.smallText}>
                <Text style={{ color: colors.text }}>Or</Text>
            </View>
        </View >
    )
}

export default LineSeperator

const styles = StyleSheet.create({
    seperator: {
        flexDirection: 'row',
        gap: 30,
        justifyContent: 'center',
        position: 'relative'
    },
    divider: {
        backgroundColor: '#423C3D',
        top: 30,
        height: 1,
        paddingHorizontal: screenWidth * 0.2,
    },
    smallText: {
        top: 20,
        position: 'absolute'
    }
})