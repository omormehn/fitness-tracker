import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Onboarding from '@/components/Onboarding'
import { useTheme } from '@/context/ThemeContext'
import Onboarding1 from '@/assets/images/dark/onboarding1.svg'
import Onboarding1light from '@/assets/images/light/onboarding1.svg'
import { router, useLocalSearchParams } from 'expo-router'
import { onboardingData } from '@/data/onboardingData'



const OnboardingScreen = () => {
  const { theme } = useTheme()
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
    <View style={[{ flex: 1 }, theme === 'dark' ? { backgroundColor: '#2A2C38' } : { backgroundColor: '#FFFFFF' }]} >
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