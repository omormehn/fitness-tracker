import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomHeader from '@/components/CustomHeader'
import { useTheme } from '@/context/ThemeContext'
import LinearGradientComponent from '@/components/linearGradient'


const ProfileScreen = () => {
  const { theme, colors, gradients } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title='Profile' />

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <View style={{ width: 70, height: 70, backgroundColor: 'black', borderRadius: 40 }} />
          <View>
            <Text style={{ color: colors.text, fontFamily: 'PoppinsMedium', fontSize: 14 }}>dhdhdh</Text>
            <Text style={{ color: colors.tintText3, fontFamily: 'PoppinsRegular', fontSize: 12 }}>dhdhdh</Text>
          </View>
        </View>
        <LinearGradientComponent style={{ paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 }} gradient={gradients.button}>
          <Text style={{ color: colors.text }}>Edit</Text>
        </LinearGradientComponent>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    gap: 30
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})