import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, ColorValue } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle } from 'react-native-svg';
import { TargetProgress, ViewTargetModalProps } from '@/types/types';


const ViewTargetModal: React.FC<ViewTargetModalProps> = ({ visible, onClose, targets }) => {
    const { colors, gradients, theme } = useTheme();

    const renderIcon = (item: TargetProgress) => {
        const iconProps = {
            name: item.icon,
            size: 28,
            color: '#fff',
        };

        switch (item.iconFamily) {
            case 'MaterialCommunity':
                return <MaterialCommunityIcons {...iconProps} />;
            case 'Material':
                return <MaterialIcons {...iconProps} />;
            case 'Ionicons':
                return <Ionicons {...iconProps} />;
            default:
                return null;
        }
    };

    const renderProgressRing = (progress: number, gradient: string[]) => {
        const size = 120;
        const strokeWidth = 12;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const progressOffset = circumference - (progress / 100) * circumference;

        return (
            <View style={styles.progressRingContainer}>
                <Svg width={size} height={size}>
                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={theme === 'dark' ? '#2A2C38' : '#E0E0E0'}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={gradient[0]}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
                <View style={styles.progressTextContainer}>
                    <Text style={[styles.progressPercentage, { color: colors.text }]}>
                        {Math.round(progress)}%
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Today's Target</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <MaterialCommunityIcons name="close" size={24} color={colors.tintText3} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.modalSubtitle, { color: colors.tintText3 }]}>
                        Track your daily fitness goals
                    </Text>

                    {/* Targets Grid */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.targetsGrid}>
                            {targets.map((item) => {
                                const progress = Math.min((item.current! / item.target!) * 100, 100);

                                return (
                                    <View key={item.id} style={[styles.targetCard, { backgroundColor: colors.background }]}>
                                        <LinearGradient
                                            colors={item.gradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.iconGradient}
                                        >
                                            {renderIcon(item)}
                                        </LinearGradient>

                                        <Text style={[styles.targetLabel, { color: colors.text }]}>{item.label}</Text>

                                        {renderProgressRing(progress, item.gradient)}

                                        <View style={styles.statsContainer}>
                                            <Text style={[styles.currentValue, { color: colors.text }]}>
                                                {item.current?.toLocaleString()}
                                            </Text>
                                            <Text style={[styles.targetValue, { color: colors.tintText3 }]}>
                                                / {item.target?.toLocaleString()} {item.unit}
                                            </Text>
                                        </View>

                                        {progress >= 100 && (
                                            <View style={styles.completedBadge}>
                                                <MaterialCommunityIcons name="check-circle" size={16} color="#1AE56B" />
                                                <Text style={styles.completedText}>Completed!</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Close Button */}
                    <TouchableOpacity onPress={onClose}>
                        <LinearGradient
                            colors={gradients.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ViewTargetModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '90%',
        borderRadius: 25,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'PoppinsSemiBold',
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
        marginBottom: 20,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    targetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    targetCard: {
        width: '48%',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    iconGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    targetLabel: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
        marginBottom: 12,
        textAlign: 'center',
    },
    progressRingContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    progressTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
    },
    statsContainer: {
        alignItems: 'center',
    },
    currentValue: {
        fontSize: 18,
        fontFamily: 'PoppinsSemiBold',
    },
    targetValue: {
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
        marginTop: 2,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(26, 229, 107, 0.1)',
    },
    completedText: {
        fontSize: 10,
        fontFamily: 'PoppinsMedium',
        color: '#1AE56B',
    },
    closeButton: {
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
        color: '#FFFFFF',
    },
});