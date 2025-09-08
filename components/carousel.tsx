import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CarouselProps } from '@/types/types';
import { useTheme } from '@/context/ThemeContext';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';

const Carousel = ({ lightImage, darkImage, title, description }: CarouselProps) => {
    const { theme, colors, images, gradients } = useTheme();
    const ImageComponent = theme === 'dark' ? darkImage : lightImage;

    return (
        <PagerView style={styles.pager} initialPage={0}>
            {/* Page 1 */}
            <View key="1" style={styles.page}>
                <LinearGradient
                    colors={gradients.onboarding}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <Image source={images.goal1} style={styles.image} resizeMode="contain" />
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.desc, { color: colors.text }]}>{description}</Text>
                </LinearGradient>
            </View>

            {/* Page 2 */}
            <View key="2" style={styles.page}>
                <LinearGradient
                    colors={gradients.onboarding}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <ImageComponent width={200} height={200} />
                    <Text style={[styles.title, { color: colors.text }]}>Another Goal</Text>
                    <Text style={[styles.desc, { color: colors.text }]}>
                        Example of another page
                    </Text>
                </LinearGradient>
            </View>
        </PagerView>
    );
};

export default Carousel;

const styles = StyleSheet.create({
    pager: {
        width: '100%',
        height: 600,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '90%',
        height: '100%',
        borderRadius: 20,
        
        alignItems: 'center',
        padding: 0,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    image: {
        width: 200,
        height: 400,
    },
    title: {
        fontSize: 18,
        fontFamily: 'PoppinsBold',
        marginTop: 12,
    },
    desc: {
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
        marginTop: 6,
        textAlign: 'center',
    },
});
