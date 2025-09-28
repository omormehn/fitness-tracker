import { useTheme } from "@/context/ThemeContext";
import { EditModalProps } from "@/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const EditModal: React.FC<EditModalProps> = ({
    visible,
    onClose,
    field,
    value,
    onSave,
}) => {
    const { colors, gradients, theme } = useTheme();
    const [gender, setGender] = useState(value || null);

    const handleSave = () => {
        onSave(gender!);
        onClose();
    };

    const OPTIONS = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ];

    // Simple test - remove all complex styling first
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: 'white' }]}>
                    <Text style={styles.modalTitle}>Edit {field}</Text>

                    {/* Minimal dropdown test */}
                    <Dropdown
                        data={OPTIONS}
                        labelField="label"
                        valueField="value"
                        value={gender}
                        onChange={item => {
                            console.log('Dropdown selected:', item); // Check if this logs
                            setGender(item.value);
                        }}
                        style={styles.testDropdown}
                        placeholder="Select gender"
                    />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text>Save</Text>
                        </TouchableOpacity>
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
        width: 300,
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    testDropdown: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
});

export default EditModal;