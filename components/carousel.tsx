import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { CarouselProps } from '@/types/types';
import { useTheme } from '@/context/ThemeContext';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';
import Goal1Dark from '@/assets/images/dark/goal1.svg';
import Goal1Light from '@/assets/images/light/goal1.svg';
import Goal2Dark from '@/assets/images/dark/goal2.svg';
import Goal2Light from '@/assets/images/light/goal2.svg';
import Goal3Dark from '@/assets/images/dark/goal3.svg';
import Goal3Light from '@/assets/images/light/goal3.svg';
import GoalCard from './GoalCard';
import { GOALS } from '@/data/goals';
import Button from './button';

const { height } = Dimensions.get('window')
const Carousel = () => {
    return (
        <PagerView style={styles.pager} initialPage={0}>
            {/* Page 1 */}
            <View key="1" style={styles.page}>
                <GoalCard lightImage={Goal1Light} darkImage={Goal1Dark} title={GOALS.goal1.title} description={GOALS.goal1.description} />
            </View>

            {/* Page 2 */}
            <View key="2" style={styles.page}>
                <GoalCard lightImage={Goal2Light} darkImage={Goal2Dark} title={GOALS.goal2.title} description={GOALS.goal2.description} />
            </View>

            {/* Page 3 */}
            <View key="3" style={styles.page}>
                <GoalCard lightImage={Goal3Light} darkImage={Goal3Dark} title={GOALS.goal3.title} description={GOALS.goal3.description} />
            </View>
        </PagerView>
    );
};

export default Carousel;

const styles = StyleSheet.create({
    pager: {
        width: '100%',
        height: height * 0.65,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
