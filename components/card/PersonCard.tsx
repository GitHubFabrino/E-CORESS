import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { router } from 'expo-router';

interface PersonCardProps {

    id: string;
    name: string;
    profilePic: any;
    lastMessage: string;
    isOnline: boolean;
    unreadCount: string;

}

const PersonCard: React.FC<PersonCardProps> = ({ id, name, profilePic, lastMessage, isOnline, unreadCount }) => {
    return (

        <TouchableOpacity onPress={() => router.push(`/Chat?userId=${id}&userName=${name}&profilePic=${profilePic}`)} // Utiliser router.push pour naviguer
            style={styles.personCard}>
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
            <View style={[styles.onlineIndicator, styles.indicator, { backgroundColor: !isOnline ? COLORS.green : '' }, { display: isOnline ? 'flex' : 'none' }]} >
            </View>
            <Text style={styles.personName}>{name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    onlineIndicator: {
        // width: 12,
        // height: 12,
        // borderRadius: 6,
        padding: 5,

    },
    indicator: {
        width: 5,
        height: 5,
        marginLeft: 10,
        borderRadius: 20
    },
    personCard: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.white,
        marginHorizontal: 8,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
    },
    personName: {
        marginTop: 5,
        fontSize: 12,
        color: COLORS.bg1,
    },
});

export default PersonCard;
