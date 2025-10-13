import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/app/(activity)/sleepschedule';
import { WORKOUT_STORAGE_KEYS } from '@/app/(workout)/workoutschedule';
import { AppNotification, ScheduleItem, WorkoutScheduleItem, SleepNotification, WorkoutNotification } from '@/types/types';


const NOTIFICATION_KEYS = {
    NOTIFICATIONS: 'notifications',
};

export const NotificationService = {
    loadAllNotifications: async (): Promise<AppNotification[]> => {
        try {
            const [sleepSchedules, workoutSchedules] = await Promise.all([
                NotificationService.loadSleepSchedules(),
                NotificationService.loadWorkoutSchedules(),
            ]);

            const sleepNotifications = NotificationService.convertSleepToNotifications(sleepSchedules);
            const workoutNotifications = NotificationService.convertWorkoutToNotifications(workoutSchedules);

            return [...sleepNotifications, ...workoutNotifications].sort(
                (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
            );
        } catch (error) {
            console.error('Error loading notifications:', error);
            return [];
        }
    },

    loadSleepSchedules: async (): Promise<ScheduleItem[]> => {
        try {
            const storedSchedules = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULES);
            if (!storedSchedules) return [];

            const parsedSchedules: ScheduleItem[] = JSON.parse(storedSchedules);
            return parsedSchedules.map(schedule => ({
                ...schedule,
                bedtimeAlarm: schedule.bedtimeAlarm ? new Date(schedule.bedtimeAlarm) : undefined,
                wakeUpTime: schedule.wakeUpTime ? new Date(schedule.wakeUpTime) : undefined,
            }));
        } catch (error) {
            console.error('Error loading sleep schedules:', error);
            return [];
        }
    },

    loadWorkoutSchedules: async (): Promise<WorkoutScheduleItem[]> => {
        try {
            const storedSchedules = await AsyncStorage.getItem(WORKOUT_STORAGE_KEYS.SCHEDULES);
            if (!storedSchedules) return [];

            const parsedSchedules: WorkoutScheduleItem[] = JSON.parse(storedSchedules);
            return parsedSchedules.map(schedule => ({
                ...schedule,
                date: new Date(schedule.date),
                workoutTime: new Date(schedule.workoutTime),
            }));
        } catch (error) {
            console.error('Error loading workout schedules:', error);
            return [];
        }
    },

    // Convert sleep schedules to notifications
    convertSleepToNotifications: (schedules: ScheduleItem[]): SleepNotification[] => {
        return schedules.flatMap(schedule => {
            const notifications: SleepNotification[] = [];

            if (schedule.bedtimeAlarm) {
                notifications.push({
                    id: `sleep-bedtime-${schedule.id}`,
                    type: 'sleep',
                    title: 'Bedtime Reminder',
                    message: `Time to sleep! Your bedtime is scheduled for ${schedule.bedtimeAlarm.toLocaleTimeString()}`,
                    timestamp: schedule.bedtimeAlarm,
                    read: false,
                    data: {
                        scheduleId: schedule.id,
                        bedtimeAlarm: schedule.bedtimeAlarm,
                        wakeUpTime: schedule.wakeUpTime,
                    },
                });
            }

            if (schedule.wakeUpTime) {
                notifications.push({
                    id: `sleep-wakeup-${schedule.id}`,
                    type: 'sleep',
                    title: 'Wake Up Reminder',
                    message: `Good morning! Time to wake up at ${schedule.wakeUpTime.toLocaleTimeString()}`,
                    timestamp: schedule.wakeUpTime,
                    read: false,
                    data: {
                        scheduleId: schedule.id,
                        bedtimeAlarm: schedule.bedtimeAlarm,
                        wakeUpTime: schedule.wakeUpTime,
                    },
                });
            }

            return notifications;
        });
    },

    // Convert workout schedules to notifications
    convertWorkoutToNotifications: (schedules: WorkoutScheduleItem[]): WorkoutNotification[] => {
        return schedules.map(schedule => ({
            id: `workout-${schedule.id}`,
            type: 'workout',
            title: 'Workout Reminder',
            message: `Time for your workout! You have ${schedule.exerciseLength} exercises scheduled.`,
            timestamp: schedule.workoutTime,
            read: false,
            data: {
                scheduleId: schedule.id,
                workoutTime: schedule.workoutTime,
                exerciseCount: schedule.exerciseLength || 0,
            },
        }));
    },

    // Mark notification as read
    markAsRead: async (notificationId: string): Promise<void> => {
       //to do clear notification from device tray if possible
        console.log('Marking notification as read:', notificationId);
    },

    // Clear all notifications
    clearAll: async (): Promise<void> => {
        // todo: for clearing notifications
    },
};