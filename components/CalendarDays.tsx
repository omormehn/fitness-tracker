import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { CalendarDaysProps } from '@/types/types';

const CalendarDays = ({ selectedDate, onDateSelect }: CalendarDaysProps) => {
    const { theme, colors, gradients } = useTheme()

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];
        const startDate = new Date(selectedDate);
        startDate.setDate(startDate.getDate() - 2);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const calendarDays = generateCalendarDays();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


    return (
        <View style={{ height: 120 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScroll}>
                {calendarDays.map((date, index) => {
                    const isSelected = date?.toDateString() === selectedDate?.toDateString();
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onDateSelect(date)}
                            style={[
                                styles.dayCard,
                                { backgroundColor: colors.card },
                                isSelected && { backgroundColor: 'transparent' },
                            ]}
                        >
                            {isSelected && (
                                <LinearGradient colors={gradients.button} style={styles.selectedDayGradient} />
                            )}
                            <Text
                                style={[
                                    styles.dayName,
                                    { color: colors.tintText3 },
                                    isSelected && { color: '#fff' },
                                ]}
                            >
                                {daysOfWeek[date.getDay()].substring(0, 3)}
                            </Text>
                            <Text
                                style={[
                                    styles.dayNumber,
                                    { color: colors.text },
                                    isSelected && { color: '#fff' },
                                ]}
                            >
                                {date.getDate()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export default CalendarDays

const styles = StyleSheet.create({
    calendarScroll: {
        paddingHorizontal: 20,
        marginBottom: 20,
        right: 10,
    },
    dayCard: {
        width: 80,
        paddingVertical: 16,
        marginRight: 12,
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    selectedDayGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    dayName: {
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
        marginBottom: 8,
    },
    dayNumber: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
    },
})