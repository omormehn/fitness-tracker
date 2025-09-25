import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/theme/Colors'
import { useTheme } from '@/context/ThemeContext'

const ProfileCard = ({ text, type }: { text: string, type: string }) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: colors.background }]}>
            <Text style={{ color: Colors.linearText, fontFamily: 'PoppinsMedium', fontSize: 14 }}>{text}</Text>
            <Text style={{ color: Colors.tintText1, fontFamily: 'PoppinsRegular', fontSize: 12 }}>{type}</Text>
        </View>

    )
}

export default ProfileCard

const styles = StyleSheet.create({
    card: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 20,
        backgroundColor: '#2A2C38',
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 1,
    }
})