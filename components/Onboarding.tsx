import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router';
import { OnboardingProps } from '@/types/types';


const Onboarding = ({ lightImage, darkImage, title, description, route }: OnboardingProps) => {
    const { theme, images, colors } = useTheme()

    const ImageComponent = theme === 'dark' ? darkImage : lightImage

    return (
        <View style={styles.container}>
            {/* Image */}
            <ImageComponent width="100%" height="50%" preserveAspectRatio="xMidYMid slice" />

            {/* Text-section */}
            <View style={{ padding: 40, marginTop: 15 }} className='text-center px-5'>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 24, color: colors.text }}>
                    {title}
                </Text>
                <Text style={[{ fontFamily: 'PoppinsRegular', fontSize: 14, }, theme === 'dark' ? { color: '#B6B4C1' } : { color: '#B6B4C2' }]}>
                    {description}

                </Text>
            </View>
            {/* Button */}
            <TouchableOpacity onPress={route} style={styles.buttonContainer}>
                <View style={styles.outer}>
                    <LinearGradient
                        colors={['#CC8FED', '#6B50F6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.button}
                    >
                        <MaterialIcons name="keyboard-arrow-right" size={28} color="white" />
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Onboarding

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        position: 'absolute',
        right: 30,
        bottom: 50,
    },
    outer: {
        borderRadius: 40,
        padding: 4,
        borderWidth: 1,
        borderBlockStartColor: '#983BCB',
        borderBlockEndColor: '#white'
    },
    button: {
        width: 70,
        borderRadius: 40,
        paddingVertical: 20,
        alignItems: 'center'
    }
})