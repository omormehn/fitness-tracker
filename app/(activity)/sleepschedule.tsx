import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Switch, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '@/components/CustomHeader';
import CalendarDays from '@/components/CalendarDays';
import MoonSvg from '@/assets/moon.svg'
import { Colors } from '@/theme/Colors';
import { ScheduleItem, SleepSchedule } from '@/types/types';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';




Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const STORAGE_KEYS = {
    SCHEDULES: 'sleep_schedules',
    NOTIFICATION_IDS: 'schedule_notification_ids'
}

const SleepScheduleScreen = () => {
    const { colors, gradients, theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<SleepSchedule | null>(null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [bedtime, setBedtime] = useState(new Date());
    const [sleepHours, setSleepHours] = useState(8.5);
    const [showDurationPicker, setShowDurationPicker] = useState(false);
    const [sleepDuration, setSleepDuration] = useState({ hours: 8, minutes: 30 });
    const [repeatDays, setRepeatDays] = useState(['Mon', 'Tue', 'Wed']);


    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        loadSchedules();
        restoreNotifications();
    }, []);

    useEffect(() => {
        saveSchedules();
    }, [schedules]);

    const loadSchedules = async () => {
        try {
            const storedSchedules = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULES);
            if (storedSchedules) {
                const parsedSchedules: ScheduleItem[] = JSON.parse(storedSchedules);
                const schedulesWithDates = parsedSchedules.map((schedule: any) => ({
                    ...schedule,
                    bedtimeAlarm: schedule.bedtimeAlarm ? new Date(schedule.bedtimeAlarm) : undefined,
                    wakeUpTime: schedule.wakeUpTime ? new Date(schedule.wakeUpTime) : undefined
                }));
                setSchedules(schedulesWithDates);
            }
        } catch (error) {
            console.error('Error loading schedules:', error);
        }
    }
    const saveSchedules = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
        } catch (error) {
            console.error('Error saving schedules:', error);
        }
    };

    const restoreNotifications = async () => {
        try {
            // Cancel all existing notifications
            await Notifications.cancelAllScheduledNotificationsAsync();

            const storedSchedules = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULES);
            if (storedSchedules) {
                const parsedSchedules = JSON.parse(storedSchedules);

                for (const schedule of parsedSchedules) {
                    if (schedule.enabled && schedule.bedtimeAlarm && schedule.wakeUpTime) {
                        const bedtimeAlarm = new Date(schedule.bedtimeAlarm);
                        const wakeUpTime = new Date(schedule.wakeUpTime);

                        if (bedtimeAlarm > new Date()) {
                            await scheduleBedtimeNotification(bedtimeAlarm);
                        }
                        if (wakeUpTime > new Date()) {
                            await scheduleWakeUpNotification(wakeUpTime);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error restoring notifications:', error);
        }
    };

    const scheduleBedtimeNotification = async (bedtimeAlarm: Date) => {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title: "🛏️ Time for Bed!",
                body: `Your bedtime is set for ${bedtimeAlarm.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: bedtimeAlarm
            },
        });
    };

    const scheduleWakeUpNotification = async (wakeUpTime: Date) => {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title: "☀️ Good Morning!",
                body: "It's time to wake up! Hope you slept well.",
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: wakeUpTime
            },
        });
    };

    const toggleDay = (day: any) => {
        setRepeatDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };



    // Generate time slots
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 6; hour <= 20; hour++) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : hour;
            slots.push(`${displayHour.toString().padStart(2, '0')}:00 ${period}`);
        }
        return slots;
    };


    const handleMarkAsDone = () => {
        // Implement mark as done logic
        setDetailModalVisible(false);
    };
    const addSchedule = async () => {
        try {
            // Create bedtime alarm time
            const bedtimeAlarm = new Date(selectedDate);
            bedtimeAlarm.setHours(bedtime.getHours());
            bedtimeAlarm.setMinutes(bedtime.getMinutes());
            bedtimeAlarm.setSeconds(0);

            // Create wake-up time (bedtime + sleep duration)
            const wakeUpTime = new Date(bedtimeAlarm);
            wakeUpTime.setHours(bedtimeAlarm.getHours() + sleepDuration.hours);
            wakeUpTime.setMinutes(bedtimeAlarm.getMinutes() + sleepDuration.minutes);

            // Schedule bedtime notification
            const bedtimeNotificationId = await scheduleBedtimeNotification(bedtimeAlarm);
            console.log('Bedtime notification scheduled with ID:', bedtimeNotificationId);

            // Schedule wake-up notification
            const wakeUpNotificationId = await scheduleWakeUpNotification(wakeUpTime);

            // Create new schedule item
            const newSchedule: ScheduleItem = {
                id: Date.now().toString(),
                type: 'bedtime',
                bedTime: bedtime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                countdown: `Bedtime at ${bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                enabled: true,
                notificationIds: [bedtimeNotificationId, wakeUpNotificationId],
                bedtimeAlarm: bedtimeAlarm,
                wakeUpTime: wakeUpTime,

            };

            setSchedules(prev => [...prev, newSchedule]);
            setAddModalVisible(false);

            setBedtime(new Date());
            setSleepDuration({ hours: 8, minutes: 30 });
            setRepeatDays(['Mon', 'Tue', 'Wed']);


        } catch (error) {
            console.error('Error scheduling notifications:', error);
            Alert.alert('Error', 'Failed to schedule notifications');
        }
    };

    // Function to cancel notifications when a schedule is disabled
    const cancelScheduleNotifications = async (schedule: ScheduleItem) => {
        if (schedule.notificationIds) {
            for (const notificationId of schedule.notificationIds) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            }
        }
    };

    const toggleSchedule = async (id: string) => {
        setSchedules(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, enabled: !item.enabled };

                    // Cancel notifications if disabling
                    if (!updatedItem.enabled && item.notificationIds) {
                        cancelScheduleNotifications(item);
                    }

                    return updatedItem;
                }
                return item;
            })
        );
    };

    // Test notification function
    const testNotification = async () => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Test Alarm",
                    body: "This is a test notification from Sleep Schedule",
                    sound: 'default'
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: new Date(Date.now() + 5000)
                },
            });
            Alert.alert('Test', 'Test notification scheduled for 5 seconds from now!');
        } catch (error) {
            console.error('Error scheduling test notification:', error);
        }
    };

    console.log('schedules', schedules)

    console.log('ss', selectedDate)
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <CustomHeader title='Sleep Schedule' />

            {/* Month Navigation */}
            <View style={[styles.targetCard, { opacity: 0.7, }, { backgroundColor: colors.card }]}>
                <View style={{ flexDirection: 'column', gap: 6 }}>
                    <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: colors.text }}>Ideal Hours for Sleep</Text>
                    <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 14, color: Colors.linearText }}>8hrs 30minutes</Text>
                    <TouchableOpacity onPress={() => { }} >
                        <LinearGradient
                            colors={gradients.button}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={[styles.checkBtn,]}
                        >
                            <Text style={[styles.checkText]}>Check</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View>
                    <MoonSvg />
                </View>
            </View>

            {/* Calendar Days */}
            <View style={{ marginTop: 20, marginHorizontal: 20, gap: 12 }}>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16, color: colors.text }}>Your Schedule</Text>
                <CalendarDays selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </View>

            <View style={styles.section}>
                {schedules.length === 0 && (
                    <Text style={[styles.sectionLabel, { color: colors.tintText3 }]}>
                        No sleep schedules yet. Tap the + button to add one.
                    </Text>
                )}
                {schedules.map((item) => (
                    <View key={item.id} style={[styles.scheduleItem, { backgroundColor: colors.card }]}>
                        <View style={styles.scheduleLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                                {item.type === 'bedtime' ? (
                                    <MaterialCommunityIcons name="moon-waning-crescent" size={24} color={gradients.button[0]} />
                                ) : (
                                    <MaterialCommunityIcons name="alarm" size={24} color="#FF6B6B" />
                                )}
                            </View>
                            <View>
                                <View style={styles.scheduleItemHeader}>
                                    <Text style={[styles.scheduleType, { color: colors.text }]}>
                                        {item.type === 'bedtime' ? 'Bedtime' : 'Alarm'}
                                    </Text>
                                    <Text style={[styles.scheduleTime, { color: colors.text }]}>{item.bedTime}</Text>
                                </View>
                                <Text style={[styles.countdown, { color: colors.tintText3 }]}>
                                    {item.countdown}nn{item.sleepHours}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.scheduleRight}>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.tintText3} />
                            </TouchableOpacity>
                            <Switch
                                value={item.enabled}
                                onValueChange={() => toggleSchedule(item.id)}
                                trackColor={{ false: colors.tintText3, true: gradients.greenLinear[0] }}
                                thumbColor={item.enabled ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                    </View>
                ))}
            </View>


            {/* Add Button */}
            <TouchableOpacity
                onPress={() => setAddModalVisible(true)}
                style={styles.addButton}
            >
                <LinearGradient
                    colors={gradients.button}
                    style={styles.addButtonGradient}
                >
                    <Ionicons name="add" size={32} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Workout Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={detailModalVisible}
                onRequestClose={() => setDetailModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.detailModal, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Workout Schedule</Text>
                            <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.tintText3} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.tintText3, opacity: 0.2 }]} />

                        <Text style={[styles.workoutDetailTitle, { color: colors.text }]}>
                            Bedtime
                        </Text>

                        <View style={styles.workoutDetailTime}>
                            <Ionicons name="time-outline" size={20} color={colors.tintText3} />
                            <Text style={[styles.workoutDetailTimeText, { color: colors.tintText3 }]}>
                                Today | {selectedWorkout?.bedTime}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={handleMarkAsDone}>
                            <LinearGradient
                                colors={gradients.greenLinear}
                                style={styles.doneButton}
                            >
                                <Text style={styles.doneButtonText}>Mark as Done</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add Sleep Alarm Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addModalVisible}
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.addModal, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Alarm</Text>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Date Selector */}
                            <TouchableOpacity
                                style={[styles.dateSelector, { backgroundColor: colors.background }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Ionicons name="calendar-outline" size={24} color={colors.tintText3} />
                                <Text style={[styles.dateSelectorText, { color: colors.tintText3 }]}>
                                    {selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </TouchableOpacity>

                            {/* Date Picker */}
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (date) setSelectedDate(date);
                                    }}
                                />
                            )}

                            {/* Bedtime Selector */}
                            <TouchableOpacity
                                style={[styles.detailOption, { backgroundColor: colors.background }]}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <View style={styles.detailOptionLeft}>
                                    <MaterialCommunityIcons name="bed" size={24} color={colors.tintText3} />
                                    <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>Bedtime</Text>
                                </View>
                                <View style={styles.detailOptionRight}>
                                    <Text style={[styles.detailOptionValue, { color: colors.text }]}>
                                        {bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.tintText3} />
                                </View>
                            </TouchableOpacity>

                            {/* Bedtime Picker */}
                            {showTimePicker && (
                                <DateTimePicker
                                    value={bedtime}
                                    mode="time"
                                    is24Hour={false}
                                    display="spinner"
                                    onChange={(event, time) => {
                                        setShowTimePicker(false);
                                        if (time) setBedtime(time);
                                    }}
                                />
                            )}

                            {/* Hours of Sleep */}
                            <TouchableOpacity
                                style={[styles.detailOption, { backgroundColor: colors.background }]}
                                onPress={() => setShowDurationPicker(true)}
                            >
                                <View style={styles.detailOptionLeft}>
                                    <Ionicons name="time" size={24} color={colors.tintText3} />
                                    <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>Hours of Sleep</Text>
                                </View>
                                <View style={styles.detailOptionRight}>
                                    <Text style={[styles.detailOptionValue, { color: colors.text }]}>
                                        {sleepDuration.hours}hr {sleepDuration.minutes}min
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.tintText3} />
                                </View>
                            </TouchableOpacity>

                            {showDurationPicker && (
                                <DateTimePicker
                                    value={new Date(Date.UTC(1970, 0, 0, sleepDuration.hours, sleepDuration.minutes))}
                                    mode="time"
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={(event, date) => {
                                        if (date) {
                                            setSleepDuration({
                                                hours: date.getHours(),
                                                minutes: date.getUTCMinutes(),
                                            });
                                        }
                                        setShowDurationPicker(false);
                                    }}
                                />
                            )}

                            {/* Repeat */}
                            <View style={{ marginTop: 16 }}>
                                <Text style={[styles.detailOptionLabel, { color: colors.tintText3, marginBottom: 8 }]}>
                                    Repeat
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {days.map((day) => (
                                        <TouchableOpacity
                                            key={day}
                                            onPress={() => toggleDay(day)}
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 20,
                                                backgroundColor: repeatDays.includes(day)
                                                    ? colors.primary
                                                    : colors.background,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: repeatDays.includes(day)
                                                        ? colors.white
                                                        : colors.tintText3,
                                                }}
                                            >
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                        </ScrollView>

                        {/* Add Button */}
                        <TouchableOpacity onPress={addSchedule}>
                            <LinearGradient
                                colors={gradients.button}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>Add</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SleepScheduleScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    targetCard: {
        flexDirection: "row",
        marginTop: 25,
        padding: 20,
        paddingVertical: 25,
        borderRadius: 16,
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
    },
    checkBtn: {
        backgroundColor: "#5e3fff",
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center'
    },
    checkText: {
        color: 'white',
        fontFamily: "PoppinsRegular",
        fontSize: 12, marginTop: 2,
        textAlign: 'center'
    },

    section: {
        marginTop: 40,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 16,
    },
    scheduleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    scheduleLeft: {
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
    scheduleItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    scheduleType: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
    },
    scheduleTime: {
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
    },
    countdown: {
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
    },
    scheduleRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
    addButtonGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    detailModal: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
    },
    addModal: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'PoppinsSemiBold',
    },
    divider: {
        height: 1,
        marginBottom: 20,
    },
    workoutDetailTitle: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 12,
    },
    workoutDetailTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    workoutDetailTimeText: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
    },
    doneButton: {
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'PoppinsSemiBold',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    dateSelectorText: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
    },
    sectionLabel: {
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 16,
    },
    timePicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginBottom: 32,
        paddingVertical: 20,
    },
    timeColumn: {
        alignItems: 'center',
    },
    timeValue: {
        fontSize: 32,
        fontFamily: 'PoppinsSemiBold',
    },
    detailOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    detailOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailOptionLabel: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
    },
    detailOptionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailOptionValue: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
    },
    saveButton: {
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
    },
});