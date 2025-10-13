import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import CustomHeader from '@/components/CustomHeader';
import { ScheduleItem, SleepData } from '@/types/types';
import { useAuthStore } from '@/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './sleepschedule';

const { width } = Dimensions.get('window');


const SleepTrackerScreen = () => {
  const { colors, gradients, theme } = useTheme();

  const [schedules, setSchedules] = useState<ScheduleItem[]>();

  useEffect(() => {
    loadSchedules();
  }, [])

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

  const sleepData: SleepData[] = [
    { day: 'Sun', hours: 6.5 },
    { day: 'Mon', hours: 7 },
    { day: 'Tue', hours: 5.5 },
    { day: 'Wed', hours: 7.5 },
    { day: 'Thu', hours: 8.5 },
    { day: 'Fri', hours: 6 },
    { day: 'Sat', hours: 8 },
  ];

  const lastNightSleep = '8h 20m';
  const chartHeight = 120;
  const maxHours = 10;

  const toggleSchedule = (id: string) => {
    setSchedules(prev =>
      prev?.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  // Generate smooth curve path for sleep chart
  const generateSleepCurve = () => {
    const points = sleepData.map((data, index) => ({
      x: (index / (sleepData.length - 1)) * (width - 80),
      y: chartHeight - (data.hours / maxHours) * chartHeight,
    }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;

      path += ` Q ${current.x} ${current.y}, ${midX} ${(current.y + next.y) / 2}`;
      path += ` Q ${next.x} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <CustomHeader title='Sleep Tracker' />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sleep Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <View style={styles.yAxisLabels}>
            {[10, 8, 6, 4, 2, 0].map((hour) => (
              <Text key={hour} style={[styles.yAxisLabel, { color: colors.tintText3 }]}>
                {hour}h
              </Text>
            ))}
          </View>

          <View style={styles.chartContent}>
            <View style={styles.increaseLabel}>
              <Text style={styles.increaseLabelText}>43% increase</Text>
            </View>

            <Svg height={chartHeight} width={width - 80}>
              <Defs>
                <SvgGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={gradients.greenLinear[0]} stopOpacity="0.3" />
                  <Stop offset="1" stopColor={gradients.greenLinear[1]} stopOpacity="0.1" />
                </SvgGradient>
              </Defs>

              {/* Area under curve */}
              <Path
                d={`${generateSleepCurve()} L ${width - 80} ${chartHeight} L 0 ${chartHeight} Z`}
                fill="url(#sleepGradient)"
              />

              {/* Curve line */}
              <Path
                d={generateSleepCurve()}
                stroke={gradients.greenLinear[0]}
                strokeWidth="3"
                fill="none"
              />
            </Svg>

            {/* Day labels */}
            <View style={styles.xAxisLabels}>
              {sleepData.map((data, index) => (
                <Text
                  key={data.day}
                  style={[
                    styles.dayLabel,
                    { color: colors.tintText3 },
                    data.day === 'Thu' && [styles.activeDayLabel, { color: gradients.greenLinear[0] }]
                  ]}
                >
                  {data.day}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Last Night Sleep Card */}
        <LinearGradient
          colors={gradients.greenLinear}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.lastNightCard}
        >
          <Text style={styles.lastNightLabel}>Last Night Sleep</Text>
          <Text style={styles.lastNightValue}>{lastNightSleep}</Text>

          {/* Wave */}
          <Svg height={60} width={width - 80} style={styles.waveDecoration}>
            <Path
              d="M0,30 Q50,20 100,30 T200,30 T300,30"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M0,35 Q50,25 100,35 T200,35 T300,35"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M0,40 Q50,30 100,40 T200,40 T300,40"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </LinearGradient>

        {/* Daily Sleep Schedule */}
        <TouchableOpacity style={[styles.scheduleCard, { backgroundColor: colors.card }]}>
          <View style={styles.scheduleHeader}>
            <Text style={[styles.scheduleTitle, { color: colors.text }]}>
              Daily Sleep Schedule
            </Text>
            <TouchableOpacity onPress={() => router.push('/(activity)/sleepschedule')}>
              <LinearGradient
                colors={gradients.button}
                style={styles.checkButton}
              >
                <Text style={styles.checkButtonText}>Check</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Today Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today Schedule</Text>

          {schedules?.map((item) => (
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
                    {item.countdown}
                  </Text>
                </View>
              </View>
              {/* TODO: ADD REMOVE SCHEDULE */}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SleepTrackerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  chartCard: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    height: 120,
    marginRight: 10,
  },
  yAxisLabel: {
    fontSize: 10,
    fontFamily: 'PoppinsRegular',
  },
  chartContent: {
    flex: 1,
  },
  increaseLabel: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  increaseLabelText: {
    fontSize: 10,
    fontFamily: 'PoppinsRegular',
    color: '#1AE56B',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  activeDayLabel: {
    fontFamily: 'PoppinsSemiBold',
  },
  lastNightCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  lastNightLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    marginBottom: 8,
  },
  lastNightValue: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PoppinsMedium',
  },
  waveDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scheduleCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
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
});