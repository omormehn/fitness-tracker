import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/store/useAuthStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import PersonalDataInfo from '@/components/PersonalDataInfo';
import EditModal from '@/components/EditModal';




const PersonalDataScreen = () => {
    const { colors, gradients } = useTheme();
    const { user, updateUser } = useAuthStore();
    const [editModal, setEditModal] = useState({ visible: false, field: '', value: '', unit: '' });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(user?.dob ? new Date(user.dob) : new Date(2000, 0, 1));

    useEffect(() => {
        if (user?.dob) {
            setDateOfBirth(new Date(user.dob));
        }
    }, [user?.dob]);
    const handleEdit = (field: string, value: string, unit?: string) => {
        if (field === 'Date of Birth') {
            setShowDatePicker(true)
        } else {
            setEditModal({ visible: true, field, value, unit: unit || '' });
        }
    };
    const handleSave = async (value: string) => {
        const fieldMap: { [key: string]: string } = {
            'Full Name': 'fullName',
            'Email': 'email',
            'Height': 'height',
            'Weight': 'weight',
            'Phone': 'phone',
            'Gender': 'gender'
        };

        const fieldKey = fieldMap[editModal.field];
        if (!fieldKey) return;
        const success = await updateUser({ [fieldKey]: value, userId: user?.id });
        if (success) {
            Alert.alert('Success', `${editModal.field} updated successfully`);
            setEditModal((prev) => ({ ...prev, visible: false }));
        } else {
            Alert.alert('Update failed', 'Please try again.');
        }
    }

    const calculateAge = (birthDate: Date) => {
        console.log('b', typeof birthDate)
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (isoDate: Date) => {
        const date = new Date(isoDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formatted = `${day}/${month}/${year}`;
        return formatted;
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <CustomHeader title="Personal Data" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Section */}
                <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImage}>


                            <View style={{ width: 100, height: 100, backgroundColor: 'gray', borderRadius: 50 }} />

                            <MaterialCommunityIcons name="account" size={50} color={colors.tintText3} />

                        </View>
                        <TouchableOpacity style={styles.cameraButton}>
                            <LinearGradient
                                colors={gradients.button}
                                style={styles.cameraGradient}
                            >
                                <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.profileName, { color: colors.text }]}>{user?.fullName}</Text>
                    <Text style={[styles.profileProgram, { color: colors.tintText3 }]}>
                        Lose a Fat Program
                    </Text>
                </View>

                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="account-outline"
                        label="Full Name"
                        value={user?.fullName || 'Not set'}

                    />
                    <PersonalDataInfo
                        editable={false}
                        icon="email-outline"
                        label="Email"
                        value={user?.email || 'Not set'}
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="phone-outline"
                        label="Phone"
                        value={user?.phone || 'Not set'}
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="calendar-outline"
                        label="Date of Birth"
                        value={user?.dob
                            ? formatDate(user.dob)
                            : 'Not set'}
                    />
                    {/* gender */}
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="gender-male-female"
                        label="Gender"
                        value={user?.gender ? user?.gender?.charAt(0).toUpperCase() + user?.gender.slice(1) : 'Not specified'}
                    />
                </View>

                {/* Physical Information */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Physical Information</Text>
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="human-male-height"
                        label="Height"
                        value={user?.height?.toString() || '0'}
                        unit="cm"
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="weight-kilogram"
                        label="Weight"
                        value={user?.weight?.toString() || '0'}
                        unit="kg"
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="calculator"
                        label="BMI"
                        value={user?.weight && user?.height
                            ? ((user.weight / Math.pow(user.height / 100, 2)).toFixed(1))
                            : 'N/A'}
                        editable={false}
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="heart-pulse"
                        label="Target Heart Rate"
                        value="120-150"
                        unit="bpm"
                        editable={false}
                    />
                </View>

                {/* Goals & Preferences */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Goals & Preferences</Text>
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="target"
                        label="Fitness Goal"
                        value={'Lose Fat'}
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="fire"
                        label="Activity Level"
                        value={'Moderate'}
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="trophy-outline"
                        label="Target Weight"
                        value={user?.weight?.toString()}
                        unit="kg"
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="calendar-check"
                        label="Target Date"
                        value="3 months"
                        editable={false}
                    />
                </View>

                {/* Emergency Contact */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contact</Text>
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="account-heart-outline"
                        label="Contact Name"
                        value={'Not set'}
                    />
                    <PersonalDataInfo
                        handleEdit={handleEdit}
                        icon="phone-alert-outline"
                        label="Contact Phone"
                        value={'Not set'}
                    />
                </View>

                {/* Account Actions */}
                <View style={styles.section}>
                    <TouchableOpacity style={[styles.actionButton, { borderColor: colors.tintText3 }]}>
                        <MaterialCommunityIcons name="download-outline" size={20} color={colors.tintText3} />
                        <Text style={[styles.actionButtonText, { color: colors.tintText3 }]}>
                            Export My Data
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, { borderColor: '#FF4444' }]}>
                        <MaterialCommunityIcons name="delete-outline" size={20} color="#FF4444" />
                        <Text style={[styles.actionButtonText, { color: '#FF4444' }]}>
                            Delete Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <EditModal
                visible={editModal.visible}
                onClose={() => setEditModal({ ...editModal, visible: false })}
                field={editModal.field}
                value={editModal.value}
                onSave={handleSave}
                inputType={
                    editModal.field === 'Email' ? 'email-address' :
                        editModal.field === 'Height' || editModal.field === 'Weight' ? 'numeric' : 'text'
                }
                unit={editModal.unit}
            />

            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={async (event: any, selectedDate: any) => {
                        setShowDatePicker(false);

                        if (event.type === 'set' && selectedDate) {
                            console.log('Date selected:', selectedDate);
                            await updateUser({ dob: selectedDate, userId: user?.id });
                            setDateOfBirth(selectedDate);
                        } else {
                            console.log('Date picker dismissed without selection');

                        }
                    }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default PersonalDataScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    cameraGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 20,
        marginBottom: 5,
    },
    profileProgram: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
        marginBottom: 15,
    },

    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    actionButtonText: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14,
        marginLeft: 10,
    },
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
    saveButtonText: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});