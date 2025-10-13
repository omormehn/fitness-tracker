import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddTargetModalProps, TargetData, TargetItem } from '@/types/types';


const AddTargetModal: React.FC<AddTargetModalProps> = ({ visible, onClose, onSave }) => {
    const { colors, gradients, theme } = useTheme();

    const [targets, setTargets] = useState<TargetItem[]>([
        {
            id: 'steps',
            icon: 'shoe-print',
            iconFamily: 'MaterialCommunity',
            label: 'Steps',
            value: '',
            unit: 'steps',
            placeholder: '10000',
            keyboardType: 'numeric',
        },
        {
            id: 'water',
            icon: 'water',
            iconFamily: 'Ionicons',
            label: 'Water Intake',
            value: '',
            unit: 'L',
            placeholder: '8',
            keyboardType: 'numeric',
        },
        {
            id: 'calories',
            icon: 'local-fire-department',
            iconFamily: 'Material',
            label: 'Calories Burn',
            value: '',
            unit: 'kcal',
            placeholder: '2000',
            keyboardType: 'numeric',
        },
        {
            id: 'workoutMinutes',
            icon: 'timer-outline',
            iconFamily: 'Ionicons',
            label: 'Workout Time',
            value: '',
            unit: 'mins',
            placeholder: '60',
            keyboardType: 'numeric',
        },
    ]);

    const updateTargetValue = (id: string, value: string) => {
        setTargets(prev =>
            prev.map(target =>
                target.id === id ? { ...target, value } : target
            )
        );
    };

    const handleSave = () => {
        const targetData: TargetData = {};

        targets.forEach(target => {
            const numValue = parseFloat(target.value);
            if (!isNaN(numValue) && numValue > 0) {
                targetData[target.id as keyof TargetData] = numValue;
            }
        });

        onSave(targetData);

        // Reset values
        setTargets(prev => prev.map(t => ({ ...t, value: '' })));
        onClose();
    };

    const renderIcon = (item: TargetItem) => {
        const iconProps = {
            name: item.icon,
            size: 24,
            color: colors.text,
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

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Add Target</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <MaterialCommunityIcons name="close" size={24} color={colors.tintText3} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.modalSubtitle, { color: colors.tintText3 }]}>
                        Set your daily fitness goals
                    </Text>

                    {/* Target Inputs */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {targets.map((item) => (
                            <View key={item.id} style={[styles.targetInputCard, { backgroundColor: colors.background }]}>
                                <View style={styles.targetInputHeader}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
                                        {renderIcon(item)}
                                    </View>
                                    <Text style={[styles.targetLabel, { color: colors.text }]}>{item.label}</Text>
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.tintText3 }]}
                                        value={item.value}
                                        onChangeText={(value) => updateTargetValue(item.id, value)}
                                        placeholder={item.placeholder}
                                        placeholderTextColor={colors.tintText3}
                                        keyboardType={item.keyboardType}
                                    />
                                    <Text style={[styles.unitText, { color: colors.tintText3 }]}>{item.unit}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.tintText3 }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.tintText3 }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSave}>
                            <LinearGradient
                                colors={gradients.button}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>Save Target</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddTargetModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
        marginBottom: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    targetInputCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    targetInputHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    targetLabel: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
    },
    unitText: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
        marginLeft: 12,
        minWidth: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    cancelButton: {
        padding: '10%',
        borderWidth: 1,
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
    },
    saveButton: {
        padding: '20%',
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
        color: '#FFFFFF',
    },
});