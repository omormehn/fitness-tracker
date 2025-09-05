import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Onboarding from '@/components/Onboarding'
import { useTheme } from '@/context/ThemeContext'


const onboardingscreen1 = () => {
  const { theme } = useTheme()
  return (
    <View style={[{ flex: 1 }, theme === 'dark' ? { backgroundColor: '#2A2C38' } : { backgroundColor: '#FFFFFF' }]} >
      <Onboarding />
    </View>
  )
}

export default onboardingscreen1

const styles = StyleSheet.create({})