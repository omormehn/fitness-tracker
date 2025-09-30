import { useTheme } from '@/context/ThemeContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const PersonalDataInfo = ({
    icon,
    label,
    value,
    editable = true,
    unit,
    iconComponent = MaterialCommunityIcons,
    handleEdit
}: any) => {
    const IconComponent = iconComponent;
    const { colors } = useTheme();


    return (
        <TouchableOpacity
            style={[styles.infoRow, { backgroundColor: colors.card }]}
            onPress={() => {
                if (editable && typeof handleEdit === 'function') {
                    handleEdit(label, value, unit);
                }
            }}
            disabled={!editable || typeof handleEdit !== 'function'}
        >
            <View style={styles.infoLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <IconComponent name={icon} size={20} color={colors.iconColor} />
                </View>
                <View>
                    <Text style={[styles.infoLabel, { color: colors.tintText3 }]}>{label}</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                        {value}{unit && ` ${unit}`}
                    </Text>
                </View>
            </View>
            {editable && (
                <MaterialIcons name="edit" size={20} color={colors.tintText3} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoLabel: {
        fontFamily: 'PoppinsRegular',
        fontSize: 12,
        marginBottom: 2,
    },
    infoValue: {
        fontFamily: 'PoppinsMedium',
        fontSize: 14,
    },
})

export default PersonalDataInfo;