import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import PagerView from 'react-native-pager-view';
import { Colors } from '@/theme/Colors';
import Carousel from '@/components/carousel';
import RegBlob from '@/assets/images/light/regblob.svg';
import RegBlobDark from '@/assets/images/dark/regblob.svg';
import Button from '@/components/button';

const GoalsScreen = () => {
    const { theme, colors } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top Section */}
            <View style={{ alignItems: 'center', width: '60%' }}>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20, color: colors.text }}>What is your goal ?</Text>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: Colors.tintText1, textAlign: 'center', width: '80%' }}>It will help us to choose a best program for you</Text>
            </View>

            {/* Carousel */}
            <Carousel />

            {/* Button */}
            <TouchableOpacity>
                <Button text='Confirm' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 60, gap: 40,
    },
    text: {
        fontSize: 22,
        fontFamily: 'PoppinsBold',
        color: 'white',
    },
})

export default GoalsScreen;