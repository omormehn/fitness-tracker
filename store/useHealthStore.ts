import api from "@/lib/axios";
import healthconnectService from "@/services/healthconnect.service";
import { HealthState } from "@/types/types";
import { create } from "zustand";




export const useHealthStore = create<HealthState>((set, get) => ({
    targetSteps: null,
    targetWater: null,
    targetCalories: null,
    targetWorkoutMinutes: null,
    todaysWater: null,
    todaysCalories: null,
    todaysWorkoutMinutes: null,
    todaysSteps: null,
    addTarget: async (data: any) => {
        try {
            const res = await api.post('/health/add-target', data)
            const { steps, water, calories, workoutMinutes } = res.data
            set({ targetSteps: steps, targetWater: water, targetCalories: calories, targetWorkoutMinutes: workoutMinutes })
            console.log('response', res.data)
            return true
        } catch (error) {
            console.log('err', error)
            return false
        }
    },
    fetchTarget: async () => {
        try {
            const res = await api.get('/health/today-target')
            const { steps, water, calories, workoutMinutes } = res.data
            set({ targetSteps: steps, targetWater: water, targetCalories: calories, targetWorkoutMinutes: workoutMinutes })
            return res.data
        } catch (error) {
            console.log('error in fetch', error)
        }
    },
    fetchHealthData: async () => {
        try {
            // Fetch today's activity data
            const { steps, calories } = await healthconnectService.getTodayActivity();
            set({ todaysSteps: steps, todaysCalories: calories, })

            // Fetch heart rate
            const hrData = await healthconnectService.getHeartRate();
            if (hrData) {
                //todo: set heart rate
            }
        } catch (error) {
            console.error('Error fetching health data:', error);
        }
    },
    fetchTodaySummary: async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await api.get('/health/daily-activity', {
                params: { date: today }
            });
            set({
                todaysSteps: data.steps || 0,
                todaysWater: data.water || 0,
                todaysCalories: data.calories || 0,
                todaysWorkoutMinutes: data.workoutMinutes || 0,
            });
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    },
    fetchWeeklySummary: async () => {
        try {
            const { data } = await api.get('/health/weekly-activity');
            return data;
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    },
    updateActivitySummary: async (updates) => {
        try {
            const current = get()
            const payload = {
                water: updates.water ?? current.todaysWater,
                workoutMinutes: updates.workoutMinutes ?? current.todaysWorkoutMinutes,
            };
            const { data } = await api.post('/health/add-activity', payload);
            set({
                todaysWater: data.water,
                todaysWorkoutMinutes: data.workoutMinutes,
            });
            return data;
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    },
}))

