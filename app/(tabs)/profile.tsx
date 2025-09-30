import { StyleSheet, Switch, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '@/components/CustomHeader'
import { useTheme } from '@/context/ThemeContext'
import LinearGradientComponent from '@/components/linearGradient'
import { Colors, COLORS } from '@/theme/Colors'
import ProfileCard from '@/components/ProfileCard'
import AccountOptions from '@/components/AccountOptions'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useAuthStore } from '@/store/useAuthStore'
import { router } from 'expo-router'


const ProfileScreen = () => {
  const { theme, colors, gradients } = useTheme();
  const { user } = useAuthStore()
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title='Profile' />

      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <View style={{ width: 70, height: 70, backgroundColor: 'black', borderRadius: 40 }} />
            <View>
              <Text style={{ color: colors.text, fontFamily: 'PoppinsMedium', fontSize: 14 }}>{user?.fullName}</Text>
              <Text style={{ color: colors.tintText3, fontFamily: 'PoppinsRegular', fontSize: 12 }}>Lose a Fat Program</Text>
            </View>
          </View>
          <LinearGradientComponent style={{ paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 }} gradient={gradients.button}>
            <TouchableOpacity onPress={() => router.push('/(profile)/PersonalData')}>
              <Text style={{ color: colors.text }}>Edit</Text>
            </TouchableOpacity>
          </LinearGradientComponent>
        </View>

        <View style={{ gap: 40 }}>
          <View style={styles.header}>
            <ProfileCard
              text={user?.height != null ? `${user.height}cm` : '--'}
              type='Height'
            />
            <ProfileCard
              text={user?.weight != null ? `${user.weight}kg` : '--'}
              type='Weight'
            />

            <ProfileCard text='22yo' type='Age' />
          </View>

          {/* Account */}
          <View style={[styles.account, { backgroundColor: colors.background }]}>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16, color: colors.text }}>Account</Text>
            {/* Options */}
            <AccountOptions route={'/(profile)/PersonalData'} option='Personal Data' iconName='pac-man' />
            <AccountOptions option='Achievement' iconName='clipboard-list-outline' />
            <AccountOptions option='Achievement History' iconName='history' />
            <AccountOptions option='Workout Progress' iconName='progress-star-four-points' />
          </View>


          {/* Notification */}
          <View style={[styles.account, { backgroundColor: colors.background }]}>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16, color: colors.text }}>Notification</Text>
            {/* Options */}
            <View style={styles.notification}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MaterialCommunityIcons name='bell-outline' size={24} color={colors.iconColor} />
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: Colors.tintText1 }}>Pop-up Notification</Text>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#00FF66' }}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          {/* Other */}
          <View style={[styles.account, { backgroundColor: colors.background }]}>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16, color: colors.text }}>Other</Text>
            {/* Options */}
            <AccountOptions option='Contact Us' iconName={'email-outline'} />
            <AccountOptions option='Privacy Policy' iconName={'shield-check-outline'} />
            <AccountOptions route={'/(tabs)/settings'} option='Settings' iconName={'settings-outline'} isSetting />
          </View>
        </View>
      </ScrollView>
    </View >
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    gap: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  account: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: '#2A2C38',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  }
})