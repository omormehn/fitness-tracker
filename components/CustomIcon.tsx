import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext';



const CustomIcon = ({ name, fill, focused }: { name: any, fill?: string, focused?: boolean }) => {
    const { theme } = useTheme();
    const color = theme === 'light' ? '#D77AE2' : '#9D28A2'
    const Icon = name;
    return (
        <View style={styles.container}>
            <Icon fill={focused ? color : 'transparent'} />
            {focused && (
                <View style={[styles.dot, { backgroundColor: color }]} />
            )}
        </View>
    )
}

export default CustomIcon

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 20,

    }
})