import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { useRouter } from 'expo-router'; // Utiliser useRouter pour expo-router

interface MessageCardProps {
    id: string;
    name: string;
    profilePic: any;
    lastMessage: string;
    isOnline: boolean;
    unreadCount: string;

}

const MessageCard: React.FC<MessageCardProps> = ({ id, name, profilePic, lastMessage, isOnline, unreadCount }) => {
    const router = useRouter(); // Utiliser useRouter

    return (
        <TouchableOpacity
            style={styles.messageCard}
            onPress={() => router.push(`/Chat?userId=${id}&userName=${name}&profilePic=${profilePic}`)} // Utiliser router.push pour naviguer
        >
            <Image source={{ uri: profilePic }} style={styles.messageProfilePic} />
            <View style={styles.messageContent}>
                <Text style={styles.messageName}>{name}</Text>
                <Text style={styles.messageText}>{lastMessage}</Text>
            </View>
            {unreadCount !== "0" && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{unreadCount}</Text>
                </View>
            )}
            <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? COLORS.green : COLORS.lightGray }]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    messageProfilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
    },
    messageContent: {
        flex: 1,
    },
    messageName: {
        fontSize: 16,
        color: COLORS.bg1,
        fontWeight: 'bold',
    },
    messageText: {
        fontSize: 14,
        color: COLORS.bg1,
    },
    onlineIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.green,
    },
    unreadBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.red,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    unreadCount: {
        fontSize: 12,
        color: COLORS.white,
        fontWeight: 'bold',
    },
});

export default MessageCard;
