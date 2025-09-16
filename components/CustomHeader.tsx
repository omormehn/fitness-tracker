import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Entypo from '@expo/vector-icons/Entypo';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';


const CustomHeader = ({ title }: { title: string }) => {
    const { theme, colors } = useTheme();
    const color = theme === 'dark' ? 'white' : 'black'
    return (
        <View style={styles.container}>
            {/* Icon 1 */}
            <TouchableOpacity onPress={() => router.back()} style={[styles.iconBg, { backgroundColor: colors.iconBg, }]}>
                <MaterialIcons name="arrow-left" size={24} color={color} />
            </TouchableOpacity>
            {/* Title  */}
            <View>
                <Text style={[{ fontFamily: 'PoppinsBold', fontSize: 16 }, { color: colors.text }]}>{title}</Text>
            </View>
            {/* Icon 3 */}
            <View style={[styles.iconBg, { backgroundColor: colors.iconBg, }]}>
                <Entypo name="dots-two-horizontal" size={24} color={color} />
            </View>
        </View>
    )
}

export default CustomHeader

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 30
    },
    iconBg: { borderRadius: 10, paddingHorizontal: 4, paddingVertical: 4 }
})