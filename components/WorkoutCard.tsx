import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext';
import LinearGradientComponent from './linearGradient';
import { LinearGradient } from 'expo-linear-gradient';

interface WorkoutCardProps {
    title: string
    calories: string
    time: string
}

const WorkoutCard = ({ title, calories, time }: WorkoutCardProps) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* First col */}
            <LinearGradientComponent style={{ padding: 35, borderRadius: 35, }} >
                {/* TODO: Add your card content here */}
            </LinearGradientComponent>

            {/* 2nd col */}
            <View style={styles.column2}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.subTitle, { color: colors.tintText3 }]}>{calories} Calories Burn | {time} minutes</Text>
            </View>
            {/* 3rd col */}
            <View style={styles.circle} />

        </View>
    )
}

export default WorkoutCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 15,
        paddingHorizontal: 10
    },
    column2: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium'
    },
    subTitle: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
        width: 200
    },
    circle: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: '#9C23D7',
        justifyContent: 'center',
        alignItems: 'center',
    }
})