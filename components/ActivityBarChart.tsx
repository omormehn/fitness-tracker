import { StyleSheet, Text, View, Dimensions, ColorValue, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withDelay,
} from 'react-native-reanimated';
import { BarItemProps, ChartBarData } from '@/types/types';
import { useHealthStore } from '@/store/useHealthStore';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 60;
const CHART_HEIGHT = 200;
const BAR_WIDTH = 28;



const ActivityBarChart = ({ filter }: { filter: string | null }) => {
    const { colors, gradients, } = useTheme();
    const { todaysSteps, fetchWeeklySummary, todaysCalories } = useHealthStore();
    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);

    const loadWeeklyData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchWeeklySummary();
            setWeeklyData(data || []);
        } catch (error) {
            console.error('Error loading weekly data:', error);
            setWeeklyData([]);
        } finally {
            setLoading(false);
        }
    }, [fetchWeeklySummary]);

    useEffect(() => {
        loadWeeklyData();
    }, [loadWeeklyData]);
    const getValueByFilter = (day: any) => {
        switch (filter) {
            case 'steps':
                return todaysSteps || 0;
            case 'calories':
                return todaysCalories || 0;
            case 'workoutMinutes':
                return day.workoutMinutes || 0;
            case 'water':
                return day.water || 0;
            default:
                return todaysSteps || 0;
        }
    };

    const getGradientByFilter = (index: number) => {
        switch (filter) {
            case 'steps':
                return index % 2 === 0 ? gradients.greenLinear : gradients.button;
            case 'calories':
                return ['#FF6B6B', '#FF8E8E'];
            case 'workoutMinutes':
                return ['#4ECDC4', '#88D3CE'];
            case 'water':
                return ['#4A90E2', '#6AAEFF'];
            default:
                return index % 2 === 0 ? gradients.greenLinear : gradients.button;
        }
    };

    const activityData: ChartBarData[] = weeklyData?.map((day, index) => ({
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: getValueByFilter(day),
        gradient: getGradientByFilter(index),
    }));

    if (loading) {
        return (
            <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
                <ActivityIndicator size="small" color={colors.text} />
            </View>
        );
    }


    if (activityData?.length === 0) {
        return (
            <Text style={{ color: colors.text, textAlign: 'center' }}>No Activity</Text>
        );
    }


    const values = activityData && activityData.length > 0
        ? activityData.map(d => d.value)
        : [0];

    const maxValue = Math.max(...values, 1000);

    return (
        <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            <View style={styles.barsContainer}>
                {activityData?.map((item, index) => (
                    <BarItem
                        key={item.day}
                        day={item.day}
                        value={item.value}
                        maxValue={maxValue}
                        gradient={item.gradient}
                        delay={index * 100}
                        bgColor={colors.background}
                    />
                ))}
            </View>
        </View>
    );
};


const BarItem: React.FC<BarItemProps> = ({
    day,
    value,
    maxValue,
    gradient,
    delay,
    bgColor,
}) => {
    const height = useSharedValue(0);
    const { colors } = useTheme();

    useEffect(() => {
        height.value = withDelay(
            delay,
            withSpring((value / maxValue) * (CHART_HEIGHT - 40), {
                damping: 15,
                stiffness: 90,
            })
        );
    }, [value, delay, maxValue]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
    }));

    return (
        <View style={styles.barContainer}>
            <View style={styles.barWrapper}>

                <View
                    style={[
                        styles.backgroundBar,
                        { backgroundColor: bgColor },
                    ]}
                />
                {/* Animated active bar */}
                <Animated.View style={[styles.activeBar, animatedStyle]}>
                    <LinearGradient
                        colors={gradient}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.gradient}
                    />
                </Animated.View>
            </View>
            <Text style={[styles.dayText, { color: colors.tintText3 }]}>{day}</Text>
        </View>
    );
};

export default ActivityBarChart;

const styles = StyleSheet.create({
    chartContainer: {
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: CHART_HEIGHT,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        width: BAR_WIDTH,
        height: CHART_HEIGHT - 40,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    backgroundBar: {
        position: 'absolute',
        bottom: 0,
        width: BAR_WIDTH,
        height: '100%',
        borderRadius: 14,
    },
    activeBar: {
        width: BAR_WIDTH,
        borderRadius: 14,
        overflow: 'hidden',
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    dayText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 12,
        marginTop: 8,
    },
});