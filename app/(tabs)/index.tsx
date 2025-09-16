// HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import SleepGraphDark from '@/assets/images/dark/sleepgraph.svg';
import SleepGraphLight from '@/assets/images/light/sleepgraph.svg';
import { Colors } from "@/theme/Colors";
import LineChartComponent from "@/components/LineChart";
import WorkoutCard from "@/components/WorkoutCard";
import { workouts } from "@/data/workout";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const { theme, colors, gradients } = useTheme()
  const ImageComponent = theme === 'dark' ? SleepGraphDark : SleepGraphLight;
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const graphBg = theme === 'dark' ? '#2A2C38' : '#FFFFFF';
  const lineChartBg = theme === 'dark' ? '#2a2940' : '#e5daf5';
  const notificationBg = theme === 'dark' ? '#161818' : '#F7F8F8';
  const notificationColor = theme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Welcome Section */}
      <View style={styles.header}>
        <View style={{ flexDirection: "column" }}>
          <Text style={[styles.welcome, { color: colors.tintText3 }]}>Welcome Back,</Text>
          <Text style={[styles.username, { color: colors.text }]}>John Doe</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notification')} style={[styles.notificationButton, { backgroundColor: notificationBg }]}>
          <Ionicons name="notifications-outline" size={20} color={notificationColor} />
        </TouchableOpacity>
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
          <Text style={styles.cardSubtitle}>You have a normal weight</Text>
          <View style={styles.bmiRow}>
            <Text style={styles.bmiValue}>20.1</Text>
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
          <TouchableOpacity >
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
            <LineChartComponent theme={theme} graphFrom={lineChartBg} graphTo={lineChartBg} width={screenWidth * 0.85} />
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
            <Text style={styles.statSleepValue}>8h 20m</Text>
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

        {/* TODO: FIX THIS GUYS INLINE PADDING ISSUES ✅✅✅*/}
        {/* Latest Workout */}
        <View style={{ margin: 20 }}>
          <View style={styles.workoutHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Latest Workout</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="See more workouts"
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              onPress={() => {
                // TODO: navigate to workout history
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
  checkText: { color: 'white', fontFamily: "PoppinsRegular", fontSize: 13, marginTop: 2 },

  sectionTitle: { fontSize: 16, fontFamily: "PoppinsSemiBold", marginTop: 10 },
  chartCard: { marginTop: 10, padding: 15, borderRadius: 20, },
  heartRate: { fontFamily: "PoppinsMedium", fontSize: 13 },
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
  workoutGraph: { borderRadius: 16, right: 20 },
  workoutCardContainer: { flexDirection: 'column', },
});
