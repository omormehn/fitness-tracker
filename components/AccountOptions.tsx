import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/theme/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

const AccountOptions = ({ option, iconName, isSetting = false, route }: { option: string, iconName: any, isSetting?: boolean, route?: any }) => {
    const { theme, colors } = useTheme();

    return (
        <Pressable onPress={() => router.push(route)} style={styles.container}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                {isSetting ? (
                    <Ionicons name={iconName} size={24} color={colors.iconColor} />
                ) : (
                    <MaterialCommunityIcons name={iconName} size={24} color={colors.iconColor} />
                )}
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: Colors.tintText1 }}>{option}</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.tintIcon} />
        </Pressable>
    )
}

export default AccountOptions

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8
    }
})