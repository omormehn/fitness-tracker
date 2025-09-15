import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Entypo from '@expo/vector-icons/Entypo';
import { useTheme } from '@/context/ThemeContext';


const CustomHeader = ({ title }: { title: string }) => {
    const { theme } = useTheme();
    const color = theme === 'dark' ? 'white' : 'black'
    return (
        <View>
            {/* Icon 1 */}
            <View>
                <MaterialIcons name="arrow-left" size={24} color={color} />
            </View>
            {/* Title  */}
            <View>
                <Text>{title}</Text>
            </View>
            {/* Icon 3 */}
            <View>
                <Entypo name="dots-two-horizontal" size={24} color="black" />
            </View>
        </View>
    )
}

export default CustomHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 30
    }
})