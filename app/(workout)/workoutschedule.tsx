import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '@/components/CustomHeader';

interface WorkoutSchedule {
  id: string;
  title: string;
  date: Date;
  time: string;
  difficulty?: string;
}

const WorkoutScheduleScreen = () => {
  const { colors, gradients, theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSchedule | null>(null);

  // Add workout form state
  const [newWorkout, setNewWorkout] = useState({
    date: new Date(),
    time: new Date(),
    workout: 'Upperbody Workout',
    difficulty: 'Beginner',
  });

  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([
    { id: '1', title: 'Ab Workout', date: new Date(2022, 4, 14), time: '7:30am', difficulty: 'Advanced' },
    { id: '2', title: 'Upperbody Workout', date: new Date(2022, 4, 14), time: '9:00am', difficulty: 'Beginner' },
    { id: '3', title: 'Lowerbody Workout', date: new Date(2022, 4, 14), time: '3:00pm', difficulty: 'Intermediate' },
  ]);

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

  const timeSlots = generateTimeSlots();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleWorkoutClick = (workout: WorkoutSchedule) => {
    setSelectedWorkout(workout);
    setDetailModalVisible(true);
  };

  const handleMarkAsDone = () => {
    // Implement mark as done logic
    setDetailModalVisible(false);
  };

  const handleSaveWorkout = () => {
    const newSchedule: WorkoutSchedule = {
      id: Date.now().toString(),
      title: newWorkout.workout,
      date: newWorkout.date,
      time: newWorkout.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      difficulty: newWorkout.difficulty,
    };
    setSchedules([...schedules, newSchedule]);
    setAddModalVisible(false);
  };

  const getWorkoutsForTimeSlot = (timeSlot: string) => {
    return schedules.filter(schedule => {
      const isSameDate = schedule.date.toDateString() === selectedDate.toDateString();
      const scheduleTime = schedule.time.toLowerCase().replace(/\s/g, '');
      const slotTime = timeSlot.toLowerCase().replace(/\s/g, '');
      return isSameDate && scheduleTime === slotTime;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <CustomHeader title='Workout Schedule' />

      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color={colors.tintText3} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: colors.tintText3 }]}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color={colors.tintText3} />
        </TouchableOpacity>
      </View>

      {/* Calendar Days */}
      <View style={{ height: 120 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.calendarScroll}
        >
          {calendarDays.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(date)}
                style={[
                  styles.dayCard,
                  { backgroundColor: colors.card },
                  isSelected && { backgroundColor: 'transparent' }
                ]}
              >
                {isSelected && (
                  <LinearGradient
                    colors={gradients.button}
                    style={styles.selectedDayGradient}
                  />
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

      {/* Schedule Timeline */}
      <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
        {timeSlots.map((slot, index) => {
          const workouts = getWorkoutsForTimeSlot(slot);

          return (
            <View key={index} style={styles.timeSlotContainer}>
              <Text style={[styles.timeText, { color: colors.tintText3 }]}>{slot}haldhd</Text>
              <View style={styles.slotContent}>
                {workouts.map((workout) => (
                  <TouchableOpacity
                    key={workout.id}
                    onPress={() => handleWorkoutClick(workout)}
                    style={styles.workoutBubble}
                  >
                    <LinearGradient
                      colors={gradients.button}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.workoutBubbleGradient}
                    >
                      <Text style={styles.workoutBubbleText}>d,sdjhdhkjmiuhi;{workout.title}, {workout.time}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

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
              {selectedWorkout?.title}
            </Text>

            <View style={styles.workoutDetailTime}>
              <Ionicons name="time-outline" size={20} color={colors.tintText3} />
              <Text style={[styles.workoutDetailTimeText, { color: colors.tintText3 }]}>
                Today | {selectedWorkout?.time}
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Schedule</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Date Picker */}
              <TouchableOpacity style={[styles.dateSelector, { backgroundColor: colors.background }]}>
                <Ionicons name="calendar-outline" size={24} color={colors.tintText3} />
                <Text style={[styles.dateSelectorText, { color: colors.tintText3 }]}>
                  {newWorkout.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </TouchableOpacity>

              {/* Time Section */}
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Time</Text>
              <View style={styles.timePicker}>
                <View style={styles.timeColumn}>
                  <Text style={[styles.timeValue, { color: colors.tintText3 }]}>3</Text>
                </View>
                <View style={styles.timeColumn}>
                  <Text style={[styles.timeValue, { color: colors.text }]}>30</Text>
                </View>
                <View style={styles.timeColumn}>
                  <Text style={[styles.timeValue, { color: colors.text }]}>PM</Text>
                </View>
              </View>

              {/* Details Section */}
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Details Workout</Text>

              <TouchableOpacity style={[styles.detailOption, { backgroundColor: colors.background }]}>
                <View style={styles.detailOptionLeft}>
                  <MaterialCommunityIcons name="dumbbell" size={24} color={colors.tintText3} />
                  <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>Choose Workout</Text>
                </View>
                <View style={styles.detailOptionRight}>
                  <Text style={[styles.detailOptionValue, { color: colors.text }]}>{newWorkout.workout}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.tintText3} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.detailOption, { backgroundColor: colors.background }]}>
                <View style={styles.detailOptionLeft}>
                  <Ionicons name="swap-vertical" size={24} color={colors.tintText3} />
                  <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>Difficulty</Text>
                </View>
                <View style={styles.detailOptionRight}>
                  <Text style={[styles.detailOptionValue, { color: colors.text }]}>{newWorkout.difficulty}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.tintText3} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.detailOption, { backgroundColor: colors.background }]}>
                <View style={styles.detailOptionLeft}>
                  <MaterialCommunityIcons name="chart-bar" size={24} color={colors.tintText3} />
                  <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>Custom Repetitions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.tintText3} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.detailOption, { backgroundColor: colors.background }]}>
                <View style={styles.detailOptionLeft}>
                  <MaterialCommunityIcons name="weight-kilogram" size={24} color={colors.tintText3} />
                  <Text style={[styles.detailOptionLabel, { color: colors.tintText3 }]}>Custom Weights</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.tintText3} />
              </TouchableOpacity>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSaveWorkout}>
              <LinearGradient
                colors={gradients.button}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PoppinsSemiBold',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  monthText: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
  },
  calendarScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  timeline: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    minHeight: 40,
  },
  timeText: {
    width: 80,
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
    paddingTop: 8,
  },
  slotContent: {
    flex: 1,
    marginLeft: 20,
  },
  workoutBubble: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  workoutBubbleGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  workoutBubbleText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
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