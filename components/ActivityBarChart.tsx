import { StyleSheet, Text, View, Dimensions, ColorValue } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withDelay,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 60;
const CHART_HEIGHT = 200;
const BAR_WIDTH = 28;

interface ActivityData {
    day: string;
    value: number;
    gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

const ActivityBarChart = () => {
    const { colors, gradients, theme } = useTheme();

    // Sample data - replace with your actual data
    const activityData: ActivityData[] = [
        { day: 'Sun', value: 60, gradient: gradients.greenLinear },
        { day: 'Mon', value: 85, gradient: gradients.button },
        { day: 'Tue', value: 45, gradient: gradients.greenLinear },
        { day: 'Wed', value: 75, gradient: gradients.button },
        { day: 'Thu', value: 95, gradient: gradients.greenLinear },
        { day: 'Fri', value: 50, gradient: gradients.button },
        { day: 'Sat', value: 80, gradient: gradients.greenLinear },
    ];

    const maxValue = 100;

    return (
        <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            <View style={styles.barsContainer}>
                {activityData.map((item, index) => (
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

interface BarItemProps {
    day: string;
    value: number;
    maxValue: number;
    gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
    delay: number;
    bgColor: string;
}

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
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
    }));

    return (
        <View style={styles.barContainer}>
            <View style={styles.barWrapper}>
                {/* Background bar (inactive state) */}
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