import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Alert, Switch, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '@/components/CustomHeader';
import CalendarDays from '@/components/CalendarDays';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHealthStore } from '@/store/useHealthStore';
import { WorkoutScheduleItem, WorkoutProgram } from '@/types/types';
import axios from 'axios';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const WORKOUT_STORAGE_KEYS = {
  SCHEDULES: 'workout_schedules',
  NOTIFICATION_IDS: 'workout_notification_ids'
};


const WORKOUT_TYPES = [
  'Upperbody Workout',
  'Lowerbody Workout',
  'Ab Workout',
  'Full Body',
  'Cardio',
  'Yoga',
  'HIIT',
  'Strength Training'
];

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const WorkoutScheduleScreen = () => {
  const { colors, gradients } = useTheme();
  const { addTarget } = useHealthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutScheduleItem | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(new Date());
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState(WORKOUT_TYPES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_LEVELS[0]);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);

  const [schedules, setSchedules] = useState<WorkoutScheduleItem[]>([]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [exercises, setExercises] = useState<WorkoutProgram[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Fetch random exercises
  const fetchRandomExercises = async () => {
    setLoadingExercises(true);
    const options = { method: 'GET', url: 'https://v1.exercisedb.dev/api/v1/exercises', params: { limit: 10, offset: 20 } };

    try {

      const { data } = await axios.request(options);

      const { data: allExercises } = data;
      const shuffled = allExercises.sort(() => 0.5 - Math.random());
      const randomExercises = shuffled.slice(0, 8);

      setExercises(randomExercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoadingExercises(false);
    }
  };

  useEffect(() => {
    fetchRandomExercises();
  }, []);


  useEffect(() => {
    loadSchedules();
    restoreNotifications();
  }, []);

  useEffect(() => {
    saveSchedules();
  }, [schedules]);

  const loadSchedules = async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem(WORKOUT_STORAGE_KEYS.SCHEDULES);
      if (storedSchedules) {
        const parsedSchedules: WorkoutScheduleItem[] = JSON.parse(storedSchedules);
        const schedulesWithDates = parsedSchedules.map((schedule: any) => ({
          ...schedule,
          date: new Date(schedule.date),
          workoutTime: new Date(schedule.workoutTime)
        }));
        setSchedules(schedulesWithDates);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const saveSchedules = async () => {
    try {
      await AsyncStorage.setItem(WORKOUT_STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    } catch (error) {
      console.error('Error saving schedules:', error);
    }
  };
                            
  const restoreNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const storedSchedules = await AsyncStorage.getItem(WORKOUT_STORAGE_KEYS.SCHEDULES);
      if (storedSchedules) {
        const parsedSchedules = JSON.parse(storedSchedules);

        for (const schedule of parsedSchedules) {
          if (schedule.enabled && schedule.workoutTime) {
            const workoutTime = new Date(schedule.workoutTime);

            if (workoutTime > new Date()) {
              await scheduleWorkoutNotification(
                workoutTime,
                schedule.workoutType,
                schedule.duration
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error restoring notifications:', error);
    }
  };

  const scheduleWorkoutNotification = async (
    workoutTime: Date,
    workoutType: string,
    duration: number
  ) => {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏋️ Workout Time!",
        body: `Time for your ${workoutType}! Duration: ${duration} minutes`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: workoutTime
      },
    });
  };

  const toggleDay = (day: string) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addSchedule = async () => {
    try {
      // Create workout time
      const scheduledWorkoutTime = new Date(selectedDate);
      scheduledWorkoutTime.setHours(workoutTime.getHours());
      scheduledWorkoutTime.setMinutes(workoutTime.getMinutes());
      scheduledWorkoutTime.setSeconds(0);

      const notificationId = await scheduleWorkoutNotification(
        scheduledWorkoutTime,
        selectedWorkoutType,
        workoutDuration
      );
      await addTarget({ workoutMinutes: workoutDuration });
      const selectedExercise = exercises.find(ex => ex.name === selectedWorkoutType);
      const newSchedule: WorkoutScheduleItem = {
        id: Date.now().toString(),
        workoutType: selectedWorkoutType,
        difficulty: selectedDifficulty,
        date: selectedDate,
        time: workoutTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        workoutTime: scheduledWorkoutTime,
        duration: workoutDuration,
        enabled: true,
        notificationId,
        repeatDays: repeatDays.length > 0 ? repeatDays : undefined,
        exerciseData: selectedExercise,
      };

      setSchedules(prev => [...prev, newSchedule]);
      setAddModalVisible(false);

      // Reset form
      setWorkoutTime(new Date());
      setWorkoutDuration(45);
      setSelectedWorkoutType(WORKOUT_TYPES[0]);
      setSelectedDifficulty(DIFFICULTY_LEVELS[0]);
      setRepeatDays([]);

      Alert.alert('Success', 'Workout scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling workout:', error);
      Alert.alert('Error', 'Failed to schedule workout');
    }
  };

  const cancelWorkoutNotification = async (schedule: WorkoutScheduleItem) => {
    if (schedule.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(schedule.notificationId);
    }
  };

  const toggleSchedule = async (id: string) => {
    setSchedules(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, enabled: !item.enabled };

          if (!updatedItem.enabled && item.notificationId) {
            cancelWorkoutNotification(item);
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const deleteSchedule = (id: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const schedule = schedules.find(s => s.id === id);
            if (schedule?.notificationId) {
              await cancelWorkoutNotification(schedule);
            }
            setSchedules(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const handleMarkAsDone = () => {
    if (selectedWorkout) {
      Alert.alert('Great Job!', 'Workout marked as completed! 💪');
      setDetailModalVisible(false);
    }
  };

  const getWorkoutsForDate = (date: Date) => {
    return schedules.filter(schedule =>
      schedule.date.toDateString() === date.toDateString()
    );
  };

  const routeToDetail = (id: string) => {
    if (!id) return;
    router.push({
      pathname: '/[id]',
      params: {
        id
      }
    })
  }

  const todaysWorkouts = getWorkoutsForDate(selectedDate);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title='Workout Schedule' />

      {/* Stats Card */}
      <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
        <View style={{ flexDirection: 'column', gap: 6 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: colors.text }}>
            Weekly Workouts
          </Text>
          <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 20, color: gradients.button[0] }}>
            {schedules.length} Scheduled
          </Text>
        </View>
        <MaterialCommunityIcons name="dumbbell" size={48} color={gradients.button[0]} />
      </View>

      {/* Calendar */}
      <View style={{ marginTop: 20, marginHorizontal: 20, gap: 12 }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16, color: colors.text }}>
          Your Schedule
        </Text>
        <CalendarDays selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </View>

      {/* Schedule List */}
      <ScrollView style={styles.section} showsVerticalScrollIndicator={false}>
        {todaysWorkouts.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.tintText3 }]}>
            No workouts scheduled for this day. Tap the + button to add one.
          </Text>
        ) : (
          todaysWorkouts.map((item) => (
            <View key={item.id} style={[styles.scheduleItem, { backgroundColor: colors.card }]}>
              <View style={styles.scheduleLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <MaterialCommunityIcons name="dumbbell" size={24} color={gradients.button[0]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.workoutType, { color: colors.text }]}>
                    {item.workoutType}
                  </Text>
                  <View style={styles.scheduleDetails}>
                    <Text style={[styles.scheduleTime, { color: colors.tintText3 }]}>
                      {item.time} • {item.duration} min
                    </Text>
                  </View>
                  <View style={styles.difficultyBadge}>
                    <Text style={[styles.difficultyText, { color: gradients.button[0] }]}>
                      {item.difficulty}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.scheduleRight}>
                <TouchableOpacity onPress={() => deleteSchedule(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        onPress={() => setAddModalVisible(true)}
        style={styles.addButton}
      >
        <LinearGradient colors={gradients.button} style={styles.addButtonGradient}>
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Workout Modal */}
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Workout</Text>
              <View style={{ width: 24 }} />
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

              {/* Time Selector */}
              <TouchableOpacity
                style={[styles.detailOption, { backgroundColor: colors.background }]}
                onPress={() => setShowTimePicker(true)}
              >
                <View style={styles.detailOptionLeft}>
                  <Ionicons name="time-outline" size={24} color={colors.tintText3} />
                  <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>
                    Workout Time
                  </Text>
                </View>
                <View style={styles.detailOptionRight}>
                  <Text style={[styles.detailOptionValue, { color: colors.text }]}>
                    {workoutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.tintText3} />
                </View>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={workoutTime}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={(event, time) => {
                    setShowTimePicker(false);
                    if (time) setWorkoutTime(time);
                  }}
                />
              )}

              {/* Duration Selector */}
              <View style={[styles.detailOption, { backgroundColor: colors.background }]}>
                <View style={styles.detailOptionLeft}>
                  <Ionicons name="timer-outline" size={24} color={colors.tintText3} />
                  <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>
                    Duration (minutes)
                  </Text>
                </View>
                <View style={styles.durationButtons}>
                  {[30, 45, 60, 90].map(duration => (
                    <TouchableOpacity
                      key={duration}
                      onPress={() => setWorkoutDuration(duration)}
                      style={[
                        styles.durationButton,
                        { backgroundColor: colors.card },
                        workoutDuration === duration && { backgroundColor: gradients.button[0] }
                      ]}
                    >
                      <Text style={[
                        styles.durationButtonText,
                        { color: colors.text },
                        workoutDuration === duration && { color: '#fff' }
                      ]}>
                        {duration}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Workout Type */}

              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>Select Exercise</Text>
                  <TouchableOpacity onPress={fetchRandomExercises}>
                    <Ionicons name="refresh" size={20} color={colors.tintText3} />
                  </TouchableOpacity>
                </View>

                {loadingExercises ? (
                  <ActivityIndicator size="small" color={gradients.button[0]} />
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {exercises.map(exercise => (
                      <TouchableOpacity
                        key={exercise.exerciseId}
                        onPress={() => {
                          routeToDetail(exercise.exerciseId)
                          setSelectedWorkoutType(exercise.name)
                        }}
                        style={[
                          styles.typeButton,
                          { backgroundColor: colors.background },
                          selectedWorkoutType === exercise.name && { backgroundColor: gradients.button[0] }
                        ]}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          { color: colors.text },
                          selectedWorkoutType === exercise.name && { color: '#fff' }
                        ]}>
                          {exercise.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Difficulty */}
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>Difficulty</Text>
                <View style={styles.difficultyButtons}>
                  {DIFFICULTY_LEVELS.map(level => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setSelectedDifficulty(level)}
                      style={[
                        styles.difficultyButton,
                        { backgroundColor: colors.background },
                        selectedDifficulty === level && { backgroundColor: gradients.button[0] }
                      ]}
                    >
                      <Text style={[
                        styles.difficultyButtonText,
                        { color: colors.text },
                        selectedDifficulty === level && { color: '#fff' }
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Repeat Days */}
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>Repeat</Text>
                <View style={styles.daysContainer}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.dayButton,
                        { backgroundColor: colors.background },
                        repeatDays.includes(day) && { backgroundColor: gradients.button[0] }
                      ]}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        { color: colors.text },
                        repeatDays.includes(day) && { color: '#fff' }
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Add Button */}
            <TouchableOpacity onPress={addSchedule}>
              <LinearGradient colors={gradients.button} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Add Workout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WorkoutScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  statsCard: {
    flexDirection: 'row',
    marginTop: 25,
    padding: 20,
    paddingVertical: 25,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyText: {
    fontFamily: 'PoppinsRegular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
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
  workoutType: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    marginBottom: 4,
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'PoppinsMedium',
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateSelectorText: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
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
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  durationButtonText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  typeButtonText: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  difficultyButtonText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dayButtonText: {
    fontSize: 12,
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