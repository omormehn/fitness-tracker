import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import CustomIcon from '@/components/CustomIcon';
import ActivityIcon from '@/assets/activityIcon.svg'
import CameraIcon from '@/assets/cameraIcon.svg'
import SearchIcon from '@/assets/SearchIcon.svg'
import HomeIcon from '@/assets/HomeIcon.svg'
import ProfileIcon from '@/assets/ProfileIcon.svg'
import { BottomTabsProps } from 'react-native-screens';
import { View } from 'react-native';
import LineChartComponent from '@/components/LineChart';
import LinearGradientComponent from '@/components/linearGradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context'


export default function TabLayout() {
  const { theme, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const bg = theme === 'dark' ? '#22242E' : '#FFFFFF';
  return (

    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80 + insets.bottom,
          borderTopWidth: 0,
          backgroundColor: bg,
          paddingBottom: insets.bottom,
        },
        tabBarIconStyle: {
          marginTop: 20,
          borderWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <CustomIcon name={HomeIcon} focused={focused} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused }) => <CustomIcon name={ActivityIcon} focused={focused} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <LinearGradientComponent
              gradient={gradients.button}
              style={[{
                width: 63,
                height: 63,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 50,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 6,
              }, theme === 'light' ? { shadowColor: '#000000' } : { shadowColor: '#95ADFE' }]}
            >
              <CustomIcon name={SearchIcon} />
            </LinearGradientComponent>
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ focused }) => <CustomIcon name={CameraIcon} focused={focused} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <CustomIcon name={ProfileIcon} focused={focused} />,
          headerShown: false
        }}
      />
    </Tabs>

  );
}
