// SettingsScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
// import Slider from '@react-native-community/slider';

const SettingsScreen = () => {
  const { theme, colors, gradients, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();

  // Settings states
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [notifications, setNotifications] = useState({
    workout: true,
    water: true,
    sleep: false,
    meal: true,
    achievement: true,
  });
  const [units, setUnits] = useState({
    weight: 'kg', // kg or lbs
    height: 'cm', // cm or ft
    distance: 'km', // km or miles
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    shareProgress: false,
    showActivity: true,
  });
  const [stepGoal, setStepGoal] = useState(10000);
  const [waterGoal, setWaterGoal] = useState(8);
  const [sleepGoal, setSleepGoal] = useState(8); 
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    toggleTheme();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };

  const SettingItem = ({
    icon,
    title,
    value,
    onPress,
    toggle = false,
    iconComponent = MaterialCommunityIcons
  }: any) => {
    const IconComponent = iconComponent;
    return (
      <TouchableOpacity
        style={[styles.settingItem, { backgroundColor: colors.card }]}
        onPress={toggle ? undefined : onPress}
        activeOpacity={toggle ? 1 : 0.7}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
            <IconComponent name={icon} size={20} color={colors.iconColor} />
          </View>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        </View>
        {toggle ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: '#767577', true: '#00FF66' }}
          />
        ) : (
          <View style={styles.settingRight}>
            {value && (
              <Text style={[styles.settingValue, { color: colors.tintText3 }]}>{value}</Text>
            )}
            <MaterialIcons name="chevron-right" size={24} color={colors.tintText3} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const NotificationItem = ({ title, subtitle, value, onToggle }: any) => (
    <View style={[styles.notificationItem, { backgroundColor: colors.card }]}>
      <View style={styles.notificationLeft}>
        <Text style={[styles.notificationTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.notificationSubtitle, { color: colors.tintText3 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#00FF66' }}
      />
    </View>
  );

  const GoalSlider = ({ title, value, setValue, min, max, unit }: any) => (
    <View style={[styles.goalContainer, { backgroundColor: colors.card }]}>
      <View style={styles.goalHeader}>
        <Text style={[styles.goalTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.goalValue, { color: colors.text }]}>
          {value.toLocaleString()} {unit}
        </Text>
      </View>
      {/* <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={unit === 'steps' ? 1000 : 1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor="#00FF66"
        maximumTrackTintColor={colors.tintText3}
        thumbTintColor="#00FF66"
      /> */}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Settings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <SettingItem
            icon="theme-light-dark"
            title="Dark Mode"
            value={darkMode}
            onPress={handleDarkModeToggle}
            toggle={true}
          />
          <SettingItem
            icon="translate"
            title="Language"
            value="English"
            onPress={() => { }}
          />
        </View>

        {/* Units & Measurements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Units & Measurements</Text>
          <SettingItem
            icon="weight-kilogram"
            title="Weight Unit"
            value={units.weight}
            onPress={() => setUnits({ ...units, weight: units.weight === 'kg' ? 'lbs' : 'kg' })}
          />
          <SettingItem
            icon="human-male-height"
            title="Height Unit"
            value={units.height}
            onPress={() => setUnits({ ...units, height: units.height === 'cm' ? 'ft' : 'cm' })}
          />
          <SettingItem
            icon="map-marker-distance"
            title="Distance Unit"
            value={units.distance}
            onPress={() => setUnits({ ...units, distance: units.distance === 'km' ? 'miles' : 'km' })}
          />
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Goals</Text>
          <GoalSlider
            title="Step Goal"
            value={stepGoal}
            setValue={setStepGoal}
            min={5000}
            max={25000}
            unit="steps"
          />
          <GoalSlider
            title="Water Goal"
            value={waterGoal}
            setValue={setWaterGoal}
            min={4}
            max={16}
            unit="glasses"
          />
          <GoalSlider
            title="Sleep Goal"
            value={sleepGoal}
            setValue={setSleepGoal}
            min={5}
            max={12}
            unit="hours"
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          <NotificationItem
            title="Workout Reminders"
            subtitle="Daily at 7:00 AM"
            value={notifications.workout}
            onToggle={() => setNotifications({ ...notifications, workout: !notifications.workout })}
          />
          <NotificationItem
            title="Water Intake"
            subtitle="Every 2 hours"
            value={notifications.water}
            onToggle={() => setNotifications({ ...notifications, water: !notifications.water })}
          />
          <NotificationItem
            title="Sleep Reminder"
            subtitle="Daily at 10:00 PM"
            value={notifications.sleep}
            onToggle={() => setNotifications({ ...notifications, sleep: !notifications.sleep })}
          />
          <NotificationItem
            title="Meal Planning"
            subtitle="Before meal times"
            value={notifications.meal}
            onToggle={() => setNotifications({ ...notifications, meal: !notifications.meal })}
          />
          <NotificationItem
            title="Achievements"
            subtitle="When you reach a milestone"
            value={notifications.achievement}
            onToggle={() => setNotifications({ ...notifications, achievement: !notifications.achievement })}
          />
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy</Text>
          <SettingItem
            icon="account-lock"
            title="Public Profile"
            value={privacy.profilePublic}
            onPress={() => setPrivacy({ ...privacy, profilePublic: !privacy.profilePublic })}
            toggle={true}
          />
          <SettingItem
            icon="share-variant"
            title="Share Progress"
            value={privacy.shareProgress}
            onPress={() => setPrivacy({ ...privacy, shareProgress: !privacy.shareProgress })}
            toggle={true}
          />
          <SettingItem
            icon="eye-outline"
            title="Show Activity Status"
            value={privacy.showActivity}
            onPress={() => setPrivacy({ ...privacy, showActivity: !privacy.showActivity })}
            toggle={true}
          />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <SettingItem
            icon="lock-reset"
            title="Change Password"
            onPress={handleChangePassword}
          />
          <SettingItem
            icon="two-factor-authentication"
            iconComponent={MaterialCommunityIcons}
            title="Two-Factor Authentication"
            value="Off"
            onPress={() => { }}
          />
          <SettingItem
            icon="devices"
            iconComponent={MaterialIcons}
            title="Connected Devices"
            value="2 devices"
            onPress={() => { }}
          />
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data & Storage</Text>
          <SettingItem
            icon="backup-restore"
            title="Backup Data"
            value="Last: 2 days ago"
            onPress={() => { }}
          />
          <SettingItem
            icon="cached"
            iconComponent={MaterialIcons}
            title="Clear Cache"
            value="124 MB"
            onPress={() => {
              Alert.alert(
                'Clear Cache',
                'This will delete temporary files. Your data will remain safe.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive' }
                ]
              );
            }}
          />
          <SettingItem
            icon="database-export"
            title="Export Data"
            onPress={() => { }}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => { }}
          />
          <SettingItem
            icon="bug-outline"
            title="Report a Problem"
            onPress={() => { }}
          />
          <SettingItem
            icon="star-outline"
            title="Rate App"
            onPress={() => { }}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <SettingItem
            icon="information-outline"
            title="App Version"
            value="1.0.0"
            onPress={() => { }}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => { }}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() => { }}
          />
          <SettingItem
            icon="code-slash-outline"
            title="Open Source Licenses"
            onPress={() => { }}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF4444' }]}>Danger Zone</Text>

          <TouchableOpacity
            style={[styles.dangerItem, { backgroundColor: colors.card, borderColor: '#FF4444' }]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}>
                <Ionicons name="log-out-outline" size={20} color="#FF4444" />
              </View>
              <Text style={[styles.settingTitle, { color: '#FF4444' }]}>Logout</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FF4444" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerItem, { backgroundColor: colors.card, borderColor: '#FF4444' }]}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'This action is irreversible. All your data will be permanently deleted.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete Account',
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert(
                        'Are you absolutely sure?',
                        'Type "DELETE" to confirm',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Confirm', style: 'destructive' }
                        ]
                      );
                    }
                  }
                ]
              );
            }}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}>
                <MaterialCommunityIcons name="delete-forever" size={20} color="#FF4444" />
              </View>
              <Text style={[styles.settingTitle, { color: '#FF4444' }]}>Delete Account</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.tintText3 }]}>
            FitTrack v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.tintText3 }]}>
            Made with ❤️ for your fitness journey
          </Text>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModal}
        onRequestClose={() => setChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordModal(false)}>
                <Ionicons name="close" size={24} color={colors.tintText3} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Current Password</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.tintText3 }]}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor={colors.tintText3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>New Password</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.tintText3 }]}
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor={colors.tintText3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.tintText3 }]}
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor={colors.tintText3}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                setChangePasswordModal(false);
                Alert.alert('Success', 'Password changed successfully');
              }}
            >
              <LinearGradient
                colors={gradients.button}
                style={styles.changePasswordButton}
              >
                <Text style={styles.changePasswordButtonText}>Update Password</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PoppinsSemiBold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  notificationLeft: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  goalContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
  },
  goalValue: {
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  dangerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PoppinsSemiBold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
  },
  changePasswordButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
  },
});