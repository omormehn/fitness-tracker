import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Switch } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import CustomHeader from '@/components/CustomHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { UpcomingWorkout, WorkoutData, WorkoutProgram } from '@/types/types';
import LineChartComponent from '@/components/LineChart';
import LinearGradientComponent from '@/components/linearGradient';
import { Colors } from '@/theme/Colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');



const WorkoutTrackerScreen = () => {
    const { colors, gradients, theme } = useTheme();
    const router = useRouter()

    const swapColor = theme === 'dark' ? '#110D0E' : '#1D1617'


    const [upcomingWorkouts, setUpcomingWorkouts] = useState<UpcomingWorkout[]>([
        { id: '1', title: 'Fullbody Workout', time: 'Today, 03:00pm', icon: '💪', enabled: true },
        { id: '2', title: 'Upperbody Workout', time: 'June 05, 02:00pm', icon: '🏋️', enabled: false },
    ]);

    const workoutData: WorkoutData[] = [
        { day: 'Sun', value: 20 },
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 30 },
        { day: 'Wed', value: 60 },
        { day: 'Thu', value: 35 },
        { day: 'Fri', value: 80, isActive: true },
        { day: 'Sat', value: 25 },
    ];

    const workoutPrograms: WorkoutProgram[] = [
        { id: '1', title: 'Fullbody Workout', exercises: 11, duration: '32mins', image: '🏃‍♀️' },
        { id: '2', title: 'Lowerbody Workout', exercises: 12, duration: '40mins', image: '🦵' },
        { id: '3', title: 'AB Workout', exercises: 14, duration: '20mins', image: '🤸‍♀️' },
    ];

    const toggleWorkout = (id: string) => {
        setUpcomingWorkouts(prev =>
            prev.map(workout =>
                workout.id === id ? { ...workout, enabled: !workout.enabled } : workout
            )
        );
    };

    const maxValue = Math.max(...workoutData.map(d => d.value));
    const chartHeight = 180;






    return (
        <LinearGradientComponent gradient={gradients.onboarding} style={[styles.container]}>
            <CustomHeader title="Workout Tracker" />
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Workout Chart */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <View>
                            <Text style={styles.chartDate}>Fri 28 May</Text>
                            <Text style={styles.chartTitle}>Upperbody Workout</Text>
                            <Text style={styles.chartTime}>180 Calories Burn | 20minutes</Text>
                        </View>
                    </View>
                    {/* Chart */}
                    <LineChartComponent
                        theme={theme}
                        width={width}
                        graphFrom={""}
                        graphTo={"transparent"}
                        gradientOpacity={0}
                        data={workoutData.map(d => d.value)}
                        labels={workoutData.map(d => d.day)}
                        curve
                    />

                </View>

                <View style={{ backgroundColor: colors.background, paddingHorizontal: 30, paddingVertical: 15, borderTopStartRadius: 30, borderTopEndRadius: 30, }}>
                    <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                        <View style={{ backgroundColor: swapColor, width: 40, paddingVertical: 4, borderRadius: 10, }} />
                    </View>
                    {/* Daily Workout Schedule */}
                    <View style={[styles.scheduleCard, { backgroundColor: colors.card }]}>
                        <View style={styles.scheduleHeader}>
                            <Text style={[styles.scheduleText, { color: colors.text }]}>
                                Daily Workout Schedule
                            </Text>

                            <TouchableOpacity onPress={() =>
                                router.push('/workoutschedule')
                            }>
                                <LinearGradient
                                    colors={gradients.button}
                                    style={styles.checkButton}
                                >
                                    <Text style={styles.checkButtonText}>Check</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Upcoming Workout */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Upcoming Workout
                            </Text>
                            <TouchableOpacity>
                                <Text style={[styles.seeMore, { color: colors.tintText3 }]}>
                                    See more
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {upcomingWorkouts.map((workout) => (
                            <View
                                key={workout.id}
                                style={[styles.workoutItem, { backgroundColor: colors.card }]}
                            >
                                <View style={styles.workoutInfo}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                                        <Text style={styles.workoutIcon}>{workout.icon}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.workoutTitle, { color: colors.text }]}>
                                            {workout.title}
                                        </Text>
                                        <Text style={[styles.workoutTime, { color: colors.tintText3 }]}>
                                            {workout.time}
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={workout.enabled}
                                    onValueChange={() => toggleWorkout(workout.id)}
                                    trackColor={{ false: colors.tintText3, true: gradients.greenLinear[0] }}
                                    thumbColor={workout.enabled ? '#fff' : '#f4f3f4'}
                                />
                            </View>
                        ))}
                    </View>

                    {/* What Do You Want to Train */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            What Do You Want to Train
                        </Text>

                        {workoutPrograms.map((program) => (
                            <View
                                key={program.id}
                                style={[styles.programCard, { backgroundColor: colors.card }]}
                            >
                                <View style={styles.programContent}>
                                    <Text style={[styles.programTitle, { color: colors.text }]}>
                                        {program.title}
                                    </Text>
                                    <Text style={[styles.programDetails, { color: colors.tintText3 }]}>
                                        {program.exercises} Exercises | {program.duration}
                                    </Text>
                                    <TouchableOpacity>
                                        <View

                                            style={[styles.viewMoreButton, { backgroundColor: colors.background }]}
                                        >
                                            <Text style={styles.viewMoreText}>View more</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.programImage}>
                                    <Text style={styles.programEmoji}>{program.image}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </LinearGradientComponent>
    );
};

export default WorkoutTrackerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,

    },
    chartCard: {
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 30
    },
    chartHeader: {
        // marginBottom: 20,
    },
    chartDate: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
    },
    chartTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
        marginTop: 4,
    },
    chartTime: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
        marginTop: 2,
    },
    scheduleCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    checkButtonText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    scheduleText: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
    },
    seeMore: {
        fontSize: 12,
        fontFamily: 'PoppinsMedium',
    },
    workoutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
    },
    workoutInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    workoutIcon: {
        fontSize: 24,
    },
    workoutTitle: {
        fontSize: 12,
        fontFamily: 'PoppinsMedium',
    },
    workoutTime: {
        fontSize: 10,
        fontFamily: 'PoppinsRegular',
        marginTop: 2,
    },
    programCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 20,
        marginBottom: 12,
        minHeight: 120,
    },
    programContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    programTitle: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
    },
    programDetails: {
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
        marginTop: 4,
    },
    viewMoreButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    viewMoreText: {
        color: Colors.linearText,
        fontSize: 10,
        fontFamily: 'PoppinsMedium',
    },
    programImage: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    programEmoji: {
        fontSize: 50,
    },
});