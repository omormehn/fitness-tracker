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
    const { theme, colors } = useTheme();
    const backgroundColor = theme === 'dark' ? '#2A2C38' : '#FFFFFF';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* First col */}
            <LinearGradientComponent styles={{ padding: 35, borderRadius: 35, }} x1={0} y1={0} x2={1} y2={1}>
                {/* TODO: Add your card content here */}
            </LinearGradientComponent>

            {/* 2nd col */}
            <View style={styles.column2}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.subTitle, { color: colors.tintText3 }]}>{calories} Calories Burn | {time} minutes</Text>
            </View>
            {/* 3rd col */}
            <View style={styles.cirlce} />

        </View>
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
        gap: 5,
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
        fontFamily: 'PoppinsRegular'
    },
    cirlce: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: '#9C23D7',
        justifyContent: 'center',
        alignItems: 'center',
    }
})