import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import CustomHeader from '@/components/CustomHeader'
import { LinearGradient } from 'expo-linear-gradient'
import LinearGradientComponent from '@/components/linearGradient'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Glass from '@/assets/glass1.svg'
import Boot from '@/assets/boots1.svg'
import { Colors } from '@/theme/Colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import LineChartComponent from '@/components/LineChart'
import ActivityBarChart from '@/components/ActivityBarChart'
import WorkoutCard from '@/components/WorkoutCard'

const ActivityScreen = () => {
  const { colors, gradients, theme } = useTheme();
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title='Activity Tracker' />
      {/* Target card */}
      <View style={[styles.targetCard, { opacity: 0.7, }, { backgroundColor: colors.card }]}>
        <View style={styles.targetCardTop}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Today Target</Text>
          <TouchableOpacity >
            <LinearGradientComponent style={styles.plusButton} gradient={gradients.button}>
              <MaterialCommunityIcons name='plus' size={20} color={theme === 'dark' ? '#000' : '#fff'} />
            </LinearGradientComponent>
          </TouchableOpacity>
        </View>

        <View style={styles.targetSubCardContainer}>
          <View style={[styles.targetSubCard, { backgroundColor: colors.background }]}>
            <Glass />
            <View className='flex-col'>
              <Text style={{ color: Colors.linearText }}>8L</Text>
              <Text style={{ color: colors.tintText3 }}>Water Intake</Text>
            </View>
          </View>
          <View style={[styles.targetSubCard, { backgroundColor: colors.background }]}>
            <Boot />
            <View className='flex-col'>
              <Text style={{ color: Colors.linearText }}>2400</Text>
              <Text style={{ color: colors.tintText3 }}>Foot Steps</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Activity */}
      <View style={{ marginTop: 30 }}>
        <View style={styles.activityHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Activity Progress</Text>
          <TouchableOpacity>
            <LinearGradient
              colors={gradients.greenLinear}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.activityBtn, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
            >
              <Text style={[styles.activityBtnText, { color: colors.text }]}>Weekly</Text>
              <MaterialIcons size={23} name="keyboard-arrow-down" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <ActivityBarChart />
      </View>

      {/* Latest Activity */}
      <View style={{ marginTop: 20 }}>
        <View style={styles.activityHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Latest Activity</Text>
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
        {/* Activity details */}
        <View style={styles.activityDetailsContainer}>
          <View style={[styles.activityDetails, { backgroundColor: colors.background }]}>
            {/* First col */}
            <LinearGradientComponent gradient={gradients.card} style={{ padding: 30, borderRadius: 35, }} >
              {/* TODO: Add your card content here */}
            </LinearGradientComponent>

            {/* 2nd col */}
            <View style={styles.activityDetailsContainer}>
              <Text style={[styles.title, { color: colors.text }]}>Eat snacks</Text>
              <Text style={[styles.subTitle, { color: colors.tintText3 }]}>About 10 minutes ago</Text>
            </View>

            {/* 3rd col */}
            <View style={styles.circle} />
          </View>
        </View>

        <View style={styles.activityDetailsContainer}>
          <View style={[styles.activityDetails, { backgroundColor: colors.background }]}>
            {/* First col */}
            <LinearGradientComponent gradient={gradients.card} style={{ padding: 30, borderRadius: 35, }} >
              {/* TODO: Add your card content here */}
            </LinearGradientComponent>

            {/* 2nd col */}
            <View style={styles.activityDetailsContainer}>
              <Text style={[styles.title, { color: colors.text }]}>Drinking 300ml of water</Text>
              <Text style={[styles.subTitle, { color: colors.tintText3 }]}>About 3 minutes ago</Text>
            </View>

            {/* 3rd col */}
            <View style={styles.circle} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({
  workoutHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },


  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  targetCard: {
    flexDirection: "column",
    marginTop: 35,
    padding: 20,
    borderRadius: 16
  },
  targetCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14
  },
  plusButton: {
    borderRadius: 6,
    padding: 3
  },
  targetSubCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  targetSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderRadius: 15,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    marginTop: 10
  },
  activityBtnText: {
    color: 'white',
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    marginTop: 2
  },
  activityBtn: {
    backgroundColor: "#5e3fff",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20
  },
  activityDetailsContainer: {
    flexDirection: 'column',

  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 10
  },
  title: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium'
  },
  subTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    width: 200,
  },
  circle: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: '#9C23D7',
  },



})