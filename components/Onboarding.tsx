import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getImages } from '@/theme/images'
import { useTheme } from '@/context/ThemeContext'


const Onboarding = () => {
    const { theme, images } = useTheme()

    return (
        <View style={styles.container}>
            {/* Image */}
            <View>
                <Image style={{ width: '100%', height: 442, resizeMode: 'contain' }} className='w-full' source={images.onboarding1} />
            </View>
            {/* Text-section */}

            {/* Button */}
            <Text>Onboarding</Text>
        </View>
    )
}

export default Onboarding

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})