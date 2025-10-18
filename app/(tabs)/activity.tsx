import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import CustomHeader from '@/components/CustomHeader'
import { LinearGradient } from 'expo-linear-gradient'
import LinearGradientComponent from '@/components/linearGradient'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Glass from '@/assets/glass1.svg'
import Boot from '@/assets/boots1.svg'
import { Colors } from '@/theme/Colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import ActivityBarChart from '@/components/ActivityBarChart'
import healthconnectService from '@/services/healthconnect.service'
import AddTargetModal from '@/components/AddTargetModal'
import api from '@/lib/axios'
import { useHealthStore } from '@/store/useHealthStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Dropdown } from 'react-native-element-dropdown'


const ActivityScreen = () => {
  const { colors, gradients, theme } = useTheme();
  const { addTarget, targetSteps, targetWater, fetchTarget, targetCalories, targetWorkoutMinutes } = useHealthStore();
  const [filterOption, setFilterOption] = useState<string | null>('steps');


  const [modalVisible, setModalVisible] = useState(false);
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  useEffect(() => {
    async function init() {
      await fetchTarget();
    }
    init();
  }, []);


  const handleSaveTargets = async (targets: any) => {
    try {
      const ok = await addTarget(targets)
      if (!ok) {
        alert('Failed to add target')
        return
      }
      setModalVisible(false)
      alert('Target added successfully')

    } catch (error) {
      console.log('err', error)
    }
  };

  const OPTIONS = [
    { label: 'Steps', value: 'steps' },
    { label: 'Calories', value: 'calories' },
    { label: 'Workout Minutes', value: 'workoutMinutes' },
    { label: 'Water', value: 'water' },
  ]


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title='Activity Tracker' />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Target card */}
        <View style={[styles.targetCard, { opacity: 0.7, }, { backgroundColor: colors.card }]}>
          <View style={styles.targetCardTop}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Today Target</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} >
              <LinearGradientComponent style={styles.plusButton} gradient={gradients.button}>
                <MaterialCommunityIcons name='plus' size={20} color={theme === 'dark' ? '#000' : '#fff'} />
              </LinearGradientComponent>
            </TouchableOpacity>
          </View>

          <View style={styles.targetSubCardContainer}>
            <View style={[styles.targetSubCard, { backgroundColor: colors.background }]}>
              <Glass />
              <View className='flex-col'>
                <Text style={{ color: Colors.linearText }}>{targetWater || '- -/ - - '} <Text style={{ fontSize: 10 }}>L</Text></Text>
                <Text style={{ color: colors.tintText3 }}>Water Intake</Text>
              </View>
            </View>
            <View style={[styles.targetSubCard, { backgroundColor: colors.background }]}>
              <Boot />
              <View className='flex-col'>
                <Text style={{ color: Colors.linearText }}>{targetSteps || '- -/ - -'}</Text>
                <Text style={{ color: colors.tintText3 }}>Foot Steps</Text>
              </View>
            </View>
            <View style={[styles.targetSubCard, { backgroundColor: colors.background }]}>
              <Ionicons name='timer-outline' color={'white'} size={30} />
              <View className='flex-col'>
                <Text style={{ color: Colors.linearText }}>{targetWorkoutMinutes || '- -/ - -'}</Text>
                <Text style={{ color: colors.tintText3 }}>Workout Min</Text>
              </View>
            </View>
            <View style={[styles.targetSubCard, { backgroundColor: colors.background }]}>
              <MaterialIcons name='local-fire-department' color={'white'} size={30} />
              <View className='flex-col'>
                <Text style={{ color: Colors.linearText }}>{targetCalories || '- -/ - -'} <Text style={{ fontSize: 10 }}>kcal</Text></Text>
                <Text style={{ color: colors.tintText3 }}>Calories</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Activity */}
        <View style={{ marginTop: 30, paddingHorizontal: 30 }}>
          <View style={styles.activityHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Activity Progress</Text>
            <View style={styles.dropdownContainer}>
              <LinearGradient
                colors={gradients.greenLinear}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.dropdownWrapper]}
              >

                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={[styles.placeholderStyle, { color: theme === 'dark' ? '#ACA3A5' : '#A5A3B0' }]}
                  selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }]}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={OPTIONS}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Filter"
                  value={filterOption}
                  onChange={item => {
                    setFilterOption(item.value)
                  }}
                  renderLeftIcon={() => (
                    <MaterialCommunityIcons
                      name="filter"
                      size={20}
                      color={colors.text}
                      style={styles.filterIcon}
                    />
                  )}

                  itemTextStyle={{ color: colors.text }}
                  itemContainerStyle={{ backgroundColor: colors.card }}
                  containerStyle={[styles.dropdownListContainer, { backgroundColor: colors.card }]}
                  activeColor={colors.background}
                />
              </LinearGradient>
            </View>
          </View>
          <ActivityBarChart filter={filterOption} />
        </View>

        {/* Latest Activity */}
        <View style={{ marginTop: 20, paddingHorizontal: 30 }}>
          <View style={styles.activityHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Latest Activity</Text>
          </View>
          {/* Activity details */}
          <TouchableOpacity onPress={() => router.push('/(activity)/sleeptracker')} style={styles.activityDetailsContainer}>
            <View style={[styles.activityDetails, { backgroundColor: colors.background }]}>
              {/* First col */}
              <LinearGradientComponent gradient={gradients.card} style={{ padding: 15, borderRadius: 35, }} >
                {/* TODO: Add your card content here */}
                <Text style={{ fontSize: 25 }}>🛌</Text>
              </LinearGradientComponent>

              {/* 2nd col */}
              <View style={styles.activityDetailsContainer}>
                <Text style={[styles.title, { color: colors.text }]}>Sleep Tracker</Text>
                <Text style={[styles.subTitle, { color: colors.tintText3 }]}>Monitor sleep activity 😴</Text>
              </View>

              {/* 3rd col */}
              <View style={styles.circle} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(activity)/waterintake')} style={styles.activityDetailsContainer}>
            <View style={[styles.activityDetails, { backgroundColor: colors.background }]}>
              {/* First col */}
              <LinearGradientComponent gradient={gradients.card} style={{ padding: 15, borderRadius: 35, }} >
                {/* TODO: Add your card content here */}
                <Text style={{ fontSize: 25 }}>💧</Text>
              </LinearGradientComponent>


              {/* 2nd col */}
              <View style={styles.activityDetailsContainer}>
                <Text style={[styles.title, { color: colors.text }]}>Water Intake</Text>
                <Text style={[styles.subTitle, { color: colors.tintText3 }]}>View water intake 💦 </Text>
              </View>

              {/* 3rd col */}
              <View style={styles.circle} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(workout)')} style={styles.activityDetailsContainer}>
            <View style={[styles.activityDetails, { backgroundColor: colors.background }]}>
              {/* First col */}
              <LinearGradientComponent gradient={gradients.card} style={{ padding: 15, borderRadius: 35, }} >
                {/* TODO: Add your card content here */}
                <Text style={{ fontSize: 25 }}>🦾</Text>
              </LinearGradientComponent>


              {/* 2nd col */}
              <View style={styles.activityDetailsContainer}>
                <Text style={[styles.title, { color: colors.text }]}>Workout Tracker</Text>
                <Text style={[styles.subTitle, { color: colors.tintText3 }]}>Track your workout💪</Text>
              </View>

              {/* 3rd col */}
              <View style={styles.circle} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AddTargetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTargets}

      />
    </View>
  )
}

export default ActivityScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  targetCard: {
    flexDirection: "column",
    marginTop: 35,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 30
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    gap: 10,

  },
  targetSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderRadius: 15,
    minWidth: 150,
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

  dropdownContainer: {
    width: 130,
  },
  dropdownWrapper: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdown: {
    height: 30,
    backgroundColor: 'transparent',
  },
  placeholderStyle: {
    fontSize: 13,
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: 13,
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  filterIcon: {
    marginRight: 8,
  },
  dropdownListContainer: {
    borderRadius: 12,
    borderWidth: 0,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityBtnText: {
    color: 'white',
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    marginTop: 2
  },
  activityBtn: {
    flexDirection: 'row',
    paddingHorizontal: 38,
    paddingVertical: 0,
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