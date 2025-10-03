import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomHeader from '@/components/CustomHeader'
import { useTheme } from '@/context/ThemeContext'

const NotificationScreen = () => {
    const { colors } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title='Notification' />
        </View>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        alignItems: 'center'
    }
})