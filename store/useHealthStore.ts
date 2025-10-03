import api from "@/lib/axios";
import healthconnectService from "@/services/healthconnect.service";
import { HealthState } from "@/types/types";
import { create } from "zustand";



export const useHealthStore = create<HealthState>((set) => ({
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
            console.log('steps', calories)
            set({ todaysSteps: steps, todaysCalories: calories, })

            // Fetch heart rate
            const hrData = await healthconnectService.getHeartRate();
            if (hrData) {
                //todo: set heart rate
            }
        } catch (error) {
            console.error('Error fetching health data:', error);
        }
    }
}))

