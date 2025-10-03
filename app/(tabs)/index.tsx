// HomeScreen.js
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Pressable, Platform } from "react-native";
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
import { TargetProgress } from "@/types/types";



const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const { theme, colors, gradients } = useTheme()
  const { user } = useAuthStore();
  const { targetSteps, targetWater, targetCalories, targetWorkoutMinutes, fetchTarget, fetchHealthData, todaysSteps, todaysCalories } = useHealthStore()
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isInitialized, setIsInitialized] = useState(false)

  // Activity data states

  const [heartRate, setHeartRate] = useState<{ bpm: number; timeAgo: string } | null>(null);
  const [stepGoal] = useState(10000); // Default goal, would be customized later
  const [bmi, setBmi] = useState<number>();
  const [targetModalVisible, setTargetModalVisible] = useState(false);

  const ImageComponent = theme === 'dark' ? SleepGraphDark : SleepGraphLight;
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const graphBg = theme === 'dark' ? '#2A2C38' : '#FFFFFF';
  const lineChartBg = theme === 'dark' ? '#2a2940' : '#e5daf5';
  const notificationBg = theme === 'dark' ? '#161818' : '#F7F8F8';
  const notificationColor = theme === 'dark' ? '#FFFFFF' : '#000000';




  // Initialize Health Connect and fetch data
  const fetchHealth = useCallback(async () => {
    await fetchHealthData();
    await fetchTarget();
  }, [])

  const initializeHealthTracking = useCallback(async () => {
    if (Platform.OS === 'android') {
      const initialized = await healthconnectService.initialize();
      if (initialized) {
        setIsInitialized(true)
        const hasPermissions = await healthconnectService.requestPermissions();
        if (hasPermissions) {
          await fetchHealth();
        }
      }
    }
    setLoading(false);
  }, [fetchHealth])

  useEffect(() => {
    void initializeHealthTracking();
    calculateBMI();
  }, [initializeHealthTracking, user]);

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

  const stepProgress = (todaysSteps! / stepGoal) * 100;
  console.log('st', todaysSteps)

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
      current: 4,
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
      current: 45,
      target: targetWorkoutMinutes,
      unit: 'mins',
      gradient: ['#FFA726', '#FB8C00'],
    },
  ];

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

          <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.heartRate, { color: colors.text }]}>Heart Rate</Text>
            <Text style={[styles.heartRateValue, theme === 'dark' ? { color: '#C050F6' } : { color: '#C150F6' }]}>78 BPM</Text>
            <LinearGradient
              colors={['#983BCB', '#4023D7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.timeAgo}
            >
              <Text style={styles.timeAgoText}>3 mins ago</Text>
            </LinearGradient>

            {/* Chart */}
            <LineChartComponent theme={theme} graphFrom={lineChartBg} graphTo={lineChartBg} width={width * 0.80} />
          </View>
        </View>

        {/* Water & Sleep */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, theme === 'dark' ? { backgroundColor: "#2A2C38" } : { backgroundColor: 'white' }]}>
            <Text style={[styles.statTitle, { color: colors.text }]}>Water Intake</Text>
            <Text style={styles.statWaterValue}>4 Liters</Text>
            <Text style={styles.statSub}>Real-time updates</Text>
          </View>
          <View style={[styles.statCard, theme === 'dark' ? { backgroundColor: "#2A2C38" } : { backgroundColor: 'white' }]}>
            <Text style={[styles.statTitle, { color: colors.text }]}>Sleep</Text>
            <Text style={styles.statSleepValue}>9h 20m</Text>
            <View className="justify-center items-center">
              <ImageComponent />
            </View>
          </View>
        </View>

        {/* Workout */}
        <View style={{ margin: 20 }}>
          <View style={styles.workoutHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Workout Progress</Text>
            <TouchableOpacity >
              {/* Todo: add drop down for filter */}
              <LinearGradient
                colors={gradients.onboarding}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.checkBtn, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
              >
                <Text style={[styles.checkText, { color: colors.text }]}>Weekly</Text>
                <MaterialIcons size={23} name="keyboard-arrow-down" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.workoutGraph}>
            <LineChartComponent theme={theme} graphFrom={graphBg} graphTo={graphBg} />
          </View>
        </View>


        {/* Latest Workout */}
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
            {workouts.map((workout, index) => (
              <WorkoutCard
                key={workout.title + index}
                title={workout.title}
                calories={workout.calories}
                time={workout.time} />
            ))}
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


  statsRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, marginBottom: 20, gap: 0 },
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



