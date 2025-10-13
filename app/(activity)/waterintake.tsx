import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import CustomHeader from '@/components/CustomHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/theme/Colors';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import LinearGradientComponent from '@/components/linearGradient';
import Svg, { Circle } from 'react-native-svg';
import { useHealthStore } from '@/store/useHealthStore';

const screenWidth = Dimensions.get('window').width;

const WaterIntakeScreen = () => {
    const { colors, gradients, theme } = useTheme();
    const { targetWater, updateActivitySummary, todaysWater } = useHealthStore();
    const [newIntake, setNewIntake] = useState('');

    const progress = todaysWater != null && targetWater != null ? Math.min((todaysWater / targetWater) * 100, 100) : 0;



    const handleAddWater = async () => {
        const intakeValue = parseFloat(newIntake);
        await updateActivitySummary({ water: intakeValue })
        setNewIntake('')
    };

    const renderProgressRing = (gradient: string[] = gradients.onboarding) => {
        const progress = todaysWater != null && targetWater != null ? Math.min((todaysWater / targetWater) * 100, 100) : 0;
        const size = 120;
        const strokeWidth = 12;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const progressOffset = circumference - (progress / 100) * circumference;

        return (
            <View style={styles.progressRingContainer}>
                <Svg width={size} height={size}>
                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={theme === 'dark' ? '#2A2C38' : '#E0E0E0'}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={gradient[0]}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
                <View style={styles.progressTextContainer}>
                    <Text style={[styles.progressPercentage, { color: colors.text }]}>
                        {Math.round(progress)}%
                    </Text>
                </View>
            </View>
        );
    };


    console.log('tod', todaysWater)

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title="Water Intake" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                {/* Target Card */}
                <View style={[styles.targetCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Today's Water Goal</Text>
                    <Text style={[styles.cardValue, { color: Colors.linearText }]}>
                        {(todaysWater ?? 0).toFixed(1)} / {(targetWater ?? 0)} L
                    </Text>
                    {renderProgressRing()}
                </View>

                {/* Add Intake */}
                <View style={[styles.addCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Water Intake</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            value={newIntake}
                            onChangeText={(v) => setNewIntake(v)}
                            keyboardType="decimal-pad"
                            placeholder="Enter amount (L)"
                            placeholderTextColor={colors.tintText3}
                            style={[styles.input, { color: colors.text, borderColor: colors.tintText3 }]}
                        />
                        <TouchableOpacity onPress={handleAddWater}>
                            <LinearGradientComponent gradient={gradients.button} style={styles.addBtn}>
                                <Ionicons name="add" size={22} color={theme === 'dark' ? '#000' : '#fff'} />
                            </LinearGradientComponent>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Summary */}
                <View style={{ marginTop: 30, paddingHorizontal: 30 }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Summary</Text>
                    <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
                        <Text style={{ color: colors.tintText3, fontFamily: 'PoppinsRegular' }}>
                            Target: {targetWater} L
                        </Text>
                        <Text style={{ color: colors.tintText3, fontFamily: 'PoppinsRegular' }}>
                            Remaining: {(Math.max(targetWater! - todaysWater!, 0)).toFixed(1)} L
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default WaterIntakeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    targetCard: {
        marginTop: 35,
        padding: 20,
        borderRadius: 16,
        marginHorizontal: 30,
        alignItems: 'center',
    },
    cardTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
        marginBottom: 8,
    },
    cardValue: {
        fontFamily: 'PoppinsBold',
        fontSize: 22,
        marginBottom: 16,
    },
    addCard: {
        marginTop: 25,
        marginHorizontal: 30,
        borderRadius: 16,
        padding: 20,
    },
    sectionTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
        marginBottom: 15,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontFamily: 'PoppinsRegular',
    },
    addBtn: {
        borderRadius: 12,
        padding: 10,
    },
    summaryCard: {
        marginTop: 10,
        borderRadius: 16,
        padding: 20,
    },
    progressRingContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    progressTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
    },
});
