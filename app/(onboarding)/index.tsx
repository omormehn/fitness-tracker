import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '@/context/ThemeContext'
import Button from '@/components/button'
import { typography } from '@/theme/typography'
import { router } from 'expo-router'


const Onboarding = () => {
  const { colors, gradients } = useTheme()


  return (
    <LinearGradient
      colors={gradients.onboarding}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View className='flex-col'>
        <Text style={{ color: colors.text, textAlign: 'center', fontFamily: 'PoppinsBold', fontSize: 32 }}>
          HITLER <Text style={{ color: 'black' }}>Fit</Text>
        </Text>
        <Text style={typography.body} className='text-white  text-center'>Everbody can train</Text>
      </View>
      {/* Button */}
      <TouchableOpacity onPress={() => router.push('/OnboardingScreen')} className='absolute bottom-20'>
        <Button  text='Get Started' />
      </TouchableOpacity>
    </LinearGradient>
  )
}

export default Onboarding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})