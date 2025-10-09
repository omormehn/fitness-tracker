import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext';
import LinearGradientComponent from './linearGradient';
import { LinearGradient } from 'expo-linear-gradient';

interface WorkoutCardProps {
    title: string
    calories?: string
    time: string | number
    gif?: string
    onpress?: () => void
}


const WorkoutCard = ({ title, calories, time, gif, onpress }: WorkoutCardProps) => {
    const { colors, gradients } = useTheme();
    return (
        <TouchableOpacity onPress={onpress} style={[styles.container, { backgroundColor: colors.background }]}>
            {/* First col */}
            <LinearGradientComponent gradient={gradients.card} style={{ padding: 30, borderRadius: 35, }} >
                <Image source={{ uri: gif }} style={{ width: 15, height: 15 }} resizeMode="contain" />
            </LinearGradientComponent>

            {/* 2nd col */}
            <View style={styles.column2}>
                <Text style={[styles.title, { color: colors.text }]}>{title.charAt(0).toUpperCase() + title.slice(1)}</Text>
                <Text style={[styles.subTitle, { color: colors.tintText3 }]}>{calories} Calories Burn | {time} minutes</Text>
            </View>

            {/* 3rd col */}
            <View style={styles.circle} />
        </TouchableOpacity>
    )
}

export default WorkoutCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 10
    },
    column2: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
        width: 150,
    },
    subTitle: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
        // width: 200
    },
    circle: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: '#9C23D7',
    }
})