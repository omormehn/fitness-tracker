
// services/healthConnect.service.ts
import {
    initialize,
    requestPermission,
    readRecords,
    insertRecords,
    Permission,
    SdkAvailabilityStatus,
    getSdkStatus,

} from 'react-native-health-connect';
import { Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StepData {
    date: string;
    steps: number;
    distance?: number;
    calories?: number;
}

export interface ActivityData {
    steps: number;
    distance: number;
    calories: number;
    activeMinutes: number;
    floors?: number;
}

class HealthConnectService {
    private initialized = false;
    private permissions: Permission[] = [
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'write', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'write', recordType: 'Distance' },
        { accessType: 'read', recordType: 'TotalCaloriesBurned' },
        { accessType: 'write', recordType: 'TotalCaloriesBurned' },
        { accessType: 'read', recordType: 'HeartRate' },
        { accessType: 'read', recordType: 'ExerciseSession' },
        { accessType: 'write', recordType: 'ExerciseSession' },
    ];

    async initialize() {
        if (Platform.OS !== 'android') {
            ToastAndroid.show('Health Connect is only available on Android.', ToastAndroid.LONG);
            console.log('Health Connect is only available on Android');
            return false;
        }

        try {
            const status = await getSdkStatus();
            if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
                ToastAndroid.show('Health Connect SDK is not available, Please install to continue.', ToastAndroid.LONG);
                console.log('Health Connect SDK is not available');
                return false;
            }

            const result = await initialize();
            this.initialized = result;
            return result;
        } catch (error) {
            console.error('Failed to initialize Health Connect:', error);
            return false;
        }
    }

    async requestPermissions() {
        if (!this.initialized) {
            ToastAndroid.show('Health Connect is not initialized yet.', ToastAndroid.LONG);
            console.warn("Health Connect is not initialized yet. Call initialize() first.");
            return false;
        }
        try {
            const granted = await requestPermission(this.permissions);
            const allRequestedGranted = this.permissions.every(requestedPerm =>
                granted.some(grantedPerm =>
                    grantedPerm.recordType === requestedPerm.recordType &&
                    grantedPerm.accessType === requestedPerm.accessType
                )
            );
            return allRequestedGranted;
        } catch (error) {
            console.error('Failed to request permissions:', error);
            return false;
        }
    }

    async getTodaySteps(): Promise<number> {
        try {
            const startTime = new Date();
            startTime.setHours(0, 0, 0, 0);

            const endTime = new Date();

            const { records } = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });

            const totalSteps = records.reduce((sum, record) => {
                return sum + (record.count || 0);
            }, 0);

            // Cache the data
            await this.cacheStepData(totalSteps);

            return totalSteps;
        } catch (error) {
            console.error('Failed to get steps:', error);
            // Return cached data if available
            return await this.getCachedSteps();
        }
    }

    async getWeeklySteps(): Promise<StepData[]> {
        try {
            const endTime = new Date();
            const startTime = new Date();
            startTime.setDate(startTime.getDate() - 7);
            startTime.setHours(0, 0, 0, 0);

            const { records } = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });

            // Group by day
            const stepsByDay = new Map<string, number>();

            records.forEach(record => {
                const date = new Date(record.startTime).toDateString();
                const current = stepsByDay.get(date) || 0;
                stepsByDay.set(date, current + (record.count || 0));
            });

            // Convert to array and fill missing days
            const weeklyData: StepData[] = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toDateString();

                weeklyData.push({
                    date: dateStr,
                    steps: stepsByDay.get(dateStr) || 0,
                });
            }

            return weeklyData;
        } catch (error) {
            console.error('Failed to get weekly steps:', error);
            return [];
        }
    }

    async getTodayActivity(): Promise<ActivityData> {
        try {
            const startTime = new Date();
            startTime.setHours(0, 0, 0, 0);
            const endTime = new Date();

            // Get steps
            const { records: stepsRecords } = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });

            // Get distance
            const { records: distanceRecords } = await readRecords('Distance', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });

            // Get calories
            const { records: caloriesRecords } = await readRecords('TotalCaloriesBurned', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });

            const steps = stepsRecords.reduce((sum, r) => sum + (r.count || 0), 0);
            const distance = distanceRecords.reduce((sum, r) => sum + (r.distance?.inMeters || 0), 0);
            const calories = caloriesRecords.reduce((sum, r) => sum + (r.energy?.inKilocalories || 0), 0);

            // Calculate active minutes based on steps (rough estimate)
            const activeMinutes = Math.floor(steps / 100); // ~100 steps per minute

            return {
                steps,
                distance: distance / 1000, // Convert to km
                calories: Math.round(calories),
                activeMinutes,
            };
        } catch (error) {
            console.error('Failed to get activity data:', error);
            return {
                steps: 0,
                distance: 0,
                calories: 0,
                activeMinutes: 0,
            };
        }
    }

    async getHeartRate() {
        try {
            const endTime = new Date();
            const startTime = new Date();
            startTime.setMinutes(startTime.getMinutes() - 30); // Last 30 minutes

            const { records } = await readRecords('HeartRate', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });

            if (records.length > 0) {
                // Get the most recent reading
                const latestRecord = records[records.length - 1];
                const latestSample = latestRecord.samples[latestRecord.samples.length - 1];
                return {
                    bpm: latestSample.beatsPerMinute,
                    time: latestSample.time,
                    timeAgo: this.getTimeAgo(new Date(latestSample.time)),
                };
            }

            return null;
        } catch (error) {
            console.error('Failed to get heart rate:', error);
            return null;
        }
    }

    // Manual step tracking (for when Health Connect is not available)
    async manuallyRecordSteps(steps: number) {
        try {
            const now = new Date();
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            await insertRecords([
                {
                    recordType: 'Steps',
                    count: steps,
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
            ]);

            return true;
        } catch (error) {
            console.error('Failed to record steps:', error);
            return false;
        }
    }

    // Helper methods
    private async cacheStepData(steps: number) {
        try {
            const key = `steps_${new Date().toDateString()}`;
            await AsyncStorage.setItem(key, steps.toString());
        } catch (error) {
            console.error('Failed to cache steps:', error);
        }
    }

    private async getCachedSteps(): Promise<number> {
        try {
            const key = `steps_${new Date().toDateString()}`;
            const cached = await AsyncStorage.getItem(key);
            return cached ? parseInt(cached, 10) : 0;
        } catch (error) {
            console.error('Failed to get cached steps:', error);
            return 0;
        }
    }

    private getTimeAgo(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;

        return `${Math.floor(diffHours / 24)} days ago`;
    }
}

export default new HealthConnectService();