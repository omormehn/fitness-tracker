// HomeScreen.js
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Pressable, Platform, ToastAndroid } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import SleepGraphDark from '@/assets/images/dark/sleepgraph.svg';
import SleepGraphLight from '@/assets/images/light/sleepgraph.svg';
import LineChartComponent from "@/components/LineChart";
import WorkoutCard from "@/components/WorkoutCard";
import { workouts } from "@/data/workout";
import { router, useNavigation } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import healthconnectService from "@/services/healthconnect.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHealthStore } from "@/store/useHealthStore";
import ViewTargetModal from "@/components/ViewTargetModal";
import { TargetProgress, WorkoutProgram } from "@/types/types";
import axios from "axios";



const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const { theme, colors, gradients } = useTheme()
  const { user, refreshToken, token } = useAuthStore();
  const { targetSteps, targetWater, targetCalories, targetWorkoutMinutes, fetchTarget, fetchHealthData, todaysSteps, todaysCalories, fetchTodaySummary, todaysWater, todaysWorkoutMinutes } = useHealthStore()
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isInitialized, setIsInitialized] = useState(false)

  // Activity data states

  const [heartRate, setHeartRate] = useState<{ bpm: number; timeAgo: string } | null>(null);
  const [stepGoal] = useState(10000); // Default goal, would be customized later
  const [bmi, setBmi] = useState<number>();
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [exercises, setExercises] = useState<WorkoutProgram[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  const ImageComponent = theme === 'dark' ? SleepGraphDark : SleepGraphLight;
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const graphBg = theme === 'dark' ? '#2A2C38' : '#FFFFFF';
  const lineChartBg = theme === 'dark' ? '#2a2940' : '#e5daf5';
  const notificationBg = theme === 'dark' ? '#161818' : '#F7F8F8';
  const notificationColor = theme === 'dark' ? '#FFFFFF' : '#000000';


  // Initialize Health Connect and fetch data
  const fetchHealth = useCallback(async () => {
    if (!user) return;
    await fetchHealthData();
    await fetchTarget();
    await fetchTodaySummary();
    const { steps, calories } = await healthconnectService.getTodayActivity();
    console.log(steps, calories, 'steps and cal')
  }, [fetchHealthData, fetchTarget, fetchTodaySummary, user]);

  useEffect(() => {
    const initialize = async () => {
      const rtk = await AsyncStorage.getItem('refreshToken');
      if (!user || !rtk) return;

      if (Platform.OS === 'android') {
        const initialized = await healthconnectService.initialize();
        if (initialized) {
          setIsInitialized(true);
          const hasPermissions = await healthconnectService.requestPermissions();
          if (hasPermissions) {
            console.log('Fetching health data...');
            await fetchHealthData();
            await fetchTarget();
            await fetchTodaySummary();
          }
        }
      } else {
        ToastAndroid.show('Health Connect is not available on this device.', ToastAndroid.LONG);
      }

      setLoading(false);
    };

    initialize();
  }, [user]);

  useEffect(() => {
    calculateBMI();
  }, [user]);

  useEffect(() => {
    if (user?.weight && user?.height) {
      const heightInMeters = user.height / 100;
      const nextBmi = user.weight / (heightInMeters * heightInMeters);
      setBmi(nextBmi);
    } else {
      setBmi(undefined);
    }
  }, [user?.weight, user?.height]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHealth();
    setRefreshing(false);
  };
  const calculateBMI = () => {
    if (user?.weight && user?.height) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      setBmi(bmi)
    } else {
      setBmi(undefined)
    }

  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  function estimateDuration(instructions: string[], sets: number = 3, reps: number = 12): number {
    const avgStepTime = 5;
    const timePerRep = instructions.length * avgStepTime;
    const totalTime = timePerRep * reps * sets;


    return Math.ceil(totalTime / 60);
  }
  // Fetch random exercises
  const fetchRandomExercises = async () => {
    if (!user) return;
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

  const todayTargets: TargetProgress[] = [
    {
      id: 'steps',
      icon: 'shoe-print',
      iconFamily: 'MaterialCommunity' as const,
      label: 'Steps',
      current: todaysSteps,
      target: targetSteps,
      unit: 'steps',
      gradient: gradients.button,
    },
    {
      id: 'water',
      icon: 'water',
      iconFamily: 'Ionicons' as const,
      label: 'Water',
      current: todaysWater,
      target: targetWater,
      unit: 'L',
      gradient: gradients.greenLinear,
    },
    {
      id: 'calories',
      icon: 'local-fire-department',
      iconFamily: 'Material' as const,
      label: 'Calories',
      current: todaysCalories,
      target: targetCalories,
      unit: 'kcal',
      gradient: ['#FF6B6B', '#FF4757'],
    },
    {
      id: 'workout',
      icon: 'timer-outline',
      iconFamily: 'Ionicons' as const,
      label: 'Workout',
      current: todaysWorkoutMinutes,
      target: targetWorkoutMinutes,
      unit: 'mins',
      gradient: ['#FFA726', '#FB8C00'],
    },
  ];

  const routeToDetail = (id: string) => {
    if (!id) return;
    router.push({
      pathname: '/[id]',
      params: {
        id
      }
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Welcome Section */}
      <View style={styles.header}>
        <View style={{ flexDirection: "column" }}>
          <Text style={[styles.welcome, { color: colors.tintText3 }]}>Welcome Back,</Text>
          <Text style={[styles.username, { color: colors.text }]}>{user?.fullName}</Text>
        </View>
        <Pressable onPress={() => router.push('/notification')} style={[styles.notificationButton, { backgroundColor: notificationBg }]}>
          <Ionicons name="notifications-outline" size={20} color={notificationColor} />
        </Pressable>
      </View>



      <ScrollView showsVerticalScrollIndicator={false}>

        {/* BMI Card */}
        <LinearGradient
          colors={gradients.onboarding}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>BMI (Body Mass Index)</Text>
          <Text style={styles.cardSubtitle}>You have a status: {bmi ? getBMIStatus(bmi) : 'N/A'}</Text>
          {!user?.weight || !user?.height ? (
            <Text style={styles.cardSubtitle}>Please <Text onPress={() => router.push('/(profile)/PersonalData')} style={{ color: 'blue' }}>update</Text> profile to calculate BMI.</Text>
          ) : null}
          <View style={styles.bmiRow}>
            <Text style={styles.bmiValue}>{bmi?.toFixed(1)}</Text>
            <TouchableOpacity >
              <LinearGradient
                colors={gradients.button}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={styles.viewMoreBtn}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Today Target */}
        <View style={[styles.targetCard, { opacity: 0.7, }, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Today Target</Text>
          <TouchableOpacity onPress={() => setTargetModalVisible(true)} >
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

        {/* Activity Status */}
        <View style={{ margin: 20 }}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Activity Status</Text>

        </View>

        {/* Water & Sleep */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, theme === 'dark' ? { backgroundColor: "#2A2C38" } : { backgroundColor: 'white' }]}>
            <Text style={[styles.statTitle, { color: colors.text }]}>Water Intake</Text>
            <Text style={styles.statWaterValue}>{todaysWater || 0} Liters</Text>
            <Text style={styles.statSub}></Text>
          </View>
          <View style={[styles.statCard, theme === 'dark' ? { backgroundColor: "#2A2C38" } : { backgroundColor: 'white' }]}>
            <Text style={[styles.statTitle, { color: colors.text }]}>Steps</Text>
            <Text style={styles.statWaterValue}>{todaysSteps || 0}</Text>
            <Text style={styles.statSub}></Text>
          </View>
          <View style={[styles.statCard, theme === 'dark' ? { backgroundColor: "#2A2C38" } : { backgroundColor: 'white' }]}>
            <Text style={[styles.statTitle, { color: colors.text }]}>Calories</Text>
            <Text style={styles.statWaterValue}>{todaysCalories || 0}</Text>
            <Text style={styles.statSub}></Text>
          </View>
          <View style={[styles.statCard, theme === 'dark' ? { backgroundColor: "#2A2C38" } : { backgroundColor: 'white' }]}>
            <Text style={[styles.statTitle, { color: colors.text }]}>Sleep (Avg)</Text>
            <Text style={styles.statSleepValue}>9h 20m</Text>
            <View className="justify-center items-center">
              <ImageComponent />
            </View>
          </View>
        </View>

        {/* Latest Workouts */}
        <View style={{ margin: 20 }}>
          <View style={styles.workoutHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Latest Workout</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="See more workouts"
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              onPress={() => {
                router.push('/(workout)')
              }}
            >
              <View
                style={[{ flexDirection: 'row', alignItems: 'center', gap: 4 }]}
              >
                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: colors.tintText3 }}>See more</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.workoutCardContainer}>
            {exercises.map((workout, index) => {
              const duration = estimateDuration(workout.instructions);
              const id = workout.exerciseId
              return (
                <WorkoutCard
                  key={workout.exerciseId}
                  title={workout.name}
                  gif={workout.gifUrl}
                  onpress={() => routeToDetail(id)}
                  time={duration} />
              )

            })}
          </View>
        </View>
      </ScrollView >

      <ViewTargetModal
        visible={targetModalVisible}
        onClose={() => setTargetModalVisible(false)}
        targets={todayTargets}
      />
    </View >
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  welcome: { fontFamily: "PoppinsRegular", fontSize: 13 },
  username: { fontFamily: "PoppinsBold", fontSize: 20, },
  notificationButton: { padding: 10, borderRadius: 10 },

  card: { backgroundColor: "#2a2940", margin: 15, padding: 15, marginTop: 20, borderRadius: 16 },
  cardTitle: { fontFamily: "PoppinsSemiBold", color: '#FFFFFF', fontSize: 16 },
  cardSubtitle: { fontFamily: "PoppinsRegular", color: "#FFFFFF", fontSize: 13, marginVertical: 4 },
  bmiRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bmiValue: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  viewMoreBtn: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 20 },
  viewMoreText: { fontFamily: "PoppinsSemiBold", color: "#FFFFFF", fontSize: 10, textAlign: 'center' },

  targetCard: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', margin: 15, padding: 15, borderRadius: 16 },
  checkBtn: { backgroundColor: "#5e3fff", paddingHorizontal: 18, paddingVertical: 6, borderRadius: 20 },
  checkText: { color: 'white', fontFamily: "PoppinsRegular", fontSize: 12, marginTop: 2 },

  sectionTitle: { fontSize: 16, fontFamily: "PoppinsSemiBold", marginTop: 10 },
  chartCard: { marginTop: 10, padding: 15, borderRadius: 20, },
  heartRate: { fontFamily: "PoppinsMedium", fontSize: 12 },
  heartRateValue: { fontFamily: "PoppinsMedium", fontSize: 18, },
  timeAgo: { backgroundColor: "#5e3fff", width: 90, paddingVertical: 8, borderRadius: 20, marginTop: 5, },
  timeAgoText: { textAlign: 'center', fontSize: 12, color: '#FFFFFF' },


  statsRow: {
    flexDirection: 'column', marginHorizontal: 15, marginBottom: 20, gap: 0
  },
  statCard: {
    flex: 1, margin: 5, padding: 15, borderRadius: 16, backgroundColor: "#2a2940", shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  statTitle: { fontFamily: "PoppinsMedium", fontSize: 14 },
  statSleepValue: { fontFamily: "PoppinsSemiBold", color: "#1AE56B", fontSize: 18, fontWeight: "bold", marginVertical: 4 },
  statWaterValue: { color: "#C050F6", fontSize: 18, fontWeight: "bold", marginVertical: 4 },
  statSub: { color: "#aaa", fontSize: 12 },


  workoutHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  workoutGraph: { borderRadius: 16, },
  workoutCardContainer: { flexDirection: 'column', },
});



