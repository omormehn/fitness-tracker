// HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const { theme, colors, gradients } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Welcome Section */}
        <View style={styles.header}>
          <View style={{ flexDirection: "column" }}>
            <Text style={[styles.welcome, { color: colors.tintText3 }]}>Welcome Back,</Text>
            <Text style={[styles.username, { color: colors.text }]}>John Doe</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* BMI Card */}
        <LinearGradient
          colors={gradients.onboarding}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>BMI (Body Mass Index)</Text>
          <Text style={styles.cardSubtitle}>You have a normal weight</Text>
          <View style={styles.bmiRow}>
            <Text style={styles.bmiValue}>20.1</Text>
            <TouchableOpacity >
              <LinearGradient
                colors={gradients.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.viewMoreBtn}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Today Target */}
        <View style={styles.targetCard}>
          <Text style={styles.cardTitle}>Today Target</Text>
          <TouchableOpacity >
            <LinearGradient
              colors={gradients.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkBtn}
            >
              <Text style={[styles.checkText, { color: colors.text }]}>Check</Text>

            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Activity Status */}
        <Text style={styles.sectionTitle}>Activity Status</Text>
        <View style={styles.chartCard}>
          <Text style={[styles.heartRate, { color: colors.text }]}>Heart Rate</Text>
          <Text style={[styles.heartRateValue, theme === 'dark' ? { color: '#C050F6' } : { color: '#C150F6' }]}>78 BPM</Text>
          <LinearGradient
            colors={['#983BCB', '#4023D7']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 1 }}
            style={styles.timeAgo}
          >
            <Text style={styles.timeAgoText}>3 mins ago</Text>
          </LinearGradient>

          {/* Chart */}
          <LineChart
            data={{
              labels: ["", "", "", "", "", ""],
              datasets: [
                {
                  data: [65, 72, 78, 75, 80, 78],
                },
              ],
            }}
            width={screenWidth * 0.85}
            height={180}
            chartConfig={{
              backgroundColor: "#2a2940",
              backgroundGradientFrom: "#2a2940",
              backgroundGradientTo: "#2a2940",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
              labelColor: () => "#aaa",
              propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: "#fff",
              },
            }}
            bezier
            style={{ marginVertical: 10, borderRadius: 12 }}
          />
        </View>

        {/* Water & Sleep */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Water Intake</Text>
            <Text style={styles.statValue}>4 Liters</Text>
            <Text style={styles.statSub}>Real-time updates</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Sleep</Text>
            <Text style={styles.statValue}>8h 20m</Text>
          </View>
        </View>
      </ScrollView>


    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  welcome: { fontFamily: "PoppinsRegular", fontSize: 13 },
  username: { fontFamily: "PoppinsBold", fontSize: 20, },
  notificationButton: { backgroundColor: "#161818", padding: 10, borderRadius: 10 },

  card: { backgroundColor: "#2a2940", margin: 15, padding: 15, borderRadius: 16 },
  cardTitle: { fontFamily: "PoppinsSemiBold", color: '#FFFFFF', fontSize: 16 },
  cardSubtitle: { fontFamily: "PoppinsRegular", color: "#FFFFFF", fontSize: 13, marginVertical: 4 },
  bmiRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bmiValue: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  viewMoreBtn: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 20 },
  viewMoreText: { fontFamily: "PoppinsSemiBold", color: "#FFFFFF", fontSize: 10 },

  targetCard: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', backgroundColor: "#35334f", margin: 15, padding: 15, borderRadius: 16 },
  checkBtn: { backgroundColor: "#5e3fff", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  checkText: { fontFamily: "PoppinsMedium", fontSize: 13 },

  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 20, marginTop: 10 },
  chartCard: { backgroundColor: "#35334f", margin: 15, padding: 15, borderRadius: 16, },
  heartRate: { fontFamily: "PoppinsMedium", fontSize: 13 },
  heartRateValue: { fontFamily: "PoppinsMedium", fontSize: 18, },
  timeAgo: { backgroundColor: "#5e3fff", width: 90, paddingVertical: 5, borderRadius: 8, marginTop: 5, },
  timeAgoText: { textAlign: 'center', fontSize: 12, color: '#FFFFFF' },


  statsRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, marginBottom: 80 },
  statCard: { backgroundColor: "#2a2940", flex: 1, margin: 5, padding: 15, borderRadius: 16 },
  statTitle: { color: "#aaa", fontSize: 14 },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "bold", marginVertical: 4 },
  statSub: { color: "#aaa", fontSize: 12 },

  tabBar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, backgroundColor: "#2a2940", borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "absolute", bottom: 0, left: 0, right: 0 },
  centerTab: { backgroundColor: "#5e3fff", padding: 14, borderRadius: 30, marginTop: -30 },
});
