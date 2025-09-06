import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Onboarding from '@/components/Onboarding'
import { useTheme } from '@/context/ThemeContext'
import { router } from 'expo-router'
import { onboardingData } from '@/data/onboardingData'



const OnboardingScreen = () => {
  const { theme, colors } = useTheme()
  const [step, setStep] = useState(0)
  const { lightImage, darkImage, title, description } = onboardingData[step]

  const handleNext = () => {
    if (step < onboardingData.length - 1) {
      setStep(step + 1)
    } else {
      router.back();
    }
  }


  return (
    <View style={[{ flex: 1 }, theme === 'dark' ? { backgroundColor: colors.background } : { backgroundColor: '#FFFFFF' }]} >
      <Onboarding
        lightImage={lightImage}
        darkImage={darkImage}
        title={title}
        description={description}
        route={handleNext}
      />
    </View>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({})