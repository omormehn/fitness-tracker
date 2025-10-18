import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '@/components/CustomHeader'
import { useTheme } from '@/context/ThemeContext'
import { AppNotification } from '@/types/types'
import { NotificationService } from '@/services/notification'
import { router } from 'expo-router'

const NotificationScreen = () => {
    const { colors } = useTheme();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const allNotifications = await NotificationService.loadAllNotifications();
            setNotifications(allNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationPress = (notification: AppNotification) => {

        NotificationService.markAsRead(notification.id);


        switch (notification.type) {
            case 'sleep':
                router.push('/(activity)/sleepschedule');
                break;
            case 'workout':
                router.push('/(workout)/workoutschedule');
                break;
            default:
                break;
        }
    };

    const renderNotificationItem = ({ item }: { item: AppNotification }) => (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                {
                    backgroundColor: colors.card,
                    borderLeftColor: getNotificationColor(item.type)
                }
            ]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={styles.notificationHeader}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {item.title}
                </Text>
                {/* <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                    {(item.timestamp, 'MMM dd, yyyy • HH:mm')}
                </Text> */}
            </View>
            <Text style={[styles.notificationMessage, { color: colors.text }]}>
                {item.message}
            </Text>
            <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                    {item.type.toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const getNotificationColor = (type: string): string => {
        switch (type) {
            case 'sleep': return '#4A90E2';
            case 'workout': return '#50C878';
            default: return '#666';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title='Notification' />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.text }}>Loading notifications...</Text>
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        No notifications yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    listContainer: {
        padding: 16,
    },
    notificationItem: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    notificationTime: {
        fontSize: 12,
        marginLeft: 8,
    },
    notificationMessage: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    notificationBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },

})