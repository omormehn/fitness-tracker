import { useTheme } from "@/context/ThemeContext";
import { EditModalProps } from "@/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const EditModal: React.FC<EditModalProps> = ({
    visible,
    onClose,
    field,
    value,
    onSave,
    inputType = 'text',
    unit
}) => {
    const { colors, gradients, theme } = useTheme();
    const [inputValue, setInputValue] = useState(value || '');
    const [gender, setGender] = useState(value || null);

    useEffect(() => {
        setInputValue(value || '');
        setGender(value || null);
    }, [value, visible]);

    const handleSave = () => {
        const saveValue = field.toLowerCase() === 'gender' ? gender : inputValue
        onSave(saveValue!);
        onClose();
    };
  
    const OPTIONS = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Edit {field}</Text>


                    {field.toLowerCase() === 'gender' ? (
                        <Dropdown
                            style={[styles.dropdown, { borderColor: colors.tintText3, }]}
                            placeholderStyle={[styles.placeholderStyle, { color: theme === 'dark' ? '#ACA3A5' : '#A5A3B0' }
                            ]}
                            selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }
                            ]}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={[styles.iconStyle, { tintColor: colors.text }
                            ]}
                            itemTextStyle={[styles.itemTextStyle, { color: colors.text }
                            ]}
                            itemContainerStyle={[styles.itemContainerStyle]}
                            data={OPTIONS}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Choose Gender"
                            value={gender}
                            onChange={item => {
                                setGender(item.value);
                            }}
                            renderItem={(item) => (
                                <View style={[
                                    styles.item,
                                    { backgroundColor: theme === 'dark' ? '#161818' : '#F7F8F8' }
                                ]}>
                                    <Text style={[
                                        styles.textItem,
                                        { color: colors.text }
                                    ]}>
                                        {item.label}
                                    </Text>
                                </View>
                            )}
                        />
                    ) : (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.modalInput, { color: colors.text, borderColor: colors.tintText3 }]}
                                value={inputValue}
                                onChangeText={setInputValue}
                                autoFocus
                                placeholder={`Enter ${field.toLowerCase()}`}
                                placeholderTextColor={colors.tintText3}
                                keyboardType={inputType === 'numeric' ? 'numeric' : 'default'}
                            />
                            {unit && (
                                <Text style={[styles.unitText, { color: colors.tintText3 }]}>{unit}</Text>
                            )}
                        </View>
                    )}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={[styles.cancelButtonText, { color: colors.tintText3 }]}>Cancel</Text>
                        </TouchableOpacity>

                        <LinearGradient
                            colors={gradients.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButton}
                        >
                            <TouchableOpacity onPress={handleSave} style={styles.saveButtonTouchable}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        padding: 20,
        borderRadius: 20,
    },
    modalTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    modalInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
    },
    unitText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        marginLeft: 10,
    },
    dropdown: {
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 55,
        borderWidth: 1,
        marginBottom: 30,
    },
    placeholderStyle: {
        fontSize: 13,
        fontFamily: 'PoppinsRegular',
    },
    selectedTextStyle: {
        fontSize: 13,
        fontFamily: 'PoppinsRegular',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 13,
        fontFamily: 'PoppinsRegular',
    },
    itemTextStyle: {
        fontFamily: 'PoppinsRegular',
    },
    itemContainerStyle: {
        borderRadius: 8,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'PoppinsRegular',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        marginRight: 10,
    },
    cancelButtonText: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14,
    },
    saveButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        marginLeft: 10,
    },
    saveButtonTouchable: {
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default EditModal;