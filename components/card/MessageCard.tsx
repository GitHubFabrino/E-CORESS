import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { useRouter } from 'expo-router'; // Utiliser useRouter pour expo-router

interface GifImage {
    url: string;
}

// Type pour un objet dans le tableau `data`
interface GifData {
    images: {
        fixed_height_small?: GifImage;
    };
}

// Type pour le tableau des résultats
type GifArray = GifData[];
type DataImage = {
    id: number;
    Image: string | null;
}[];

interface MessageCardProps {
    id: string;
    name: string;
    profilePic: any;
    lastMessage: string;
    isOnline: boolean;
    unreadCount: string;
    lastM: string;
    dataImages: DataImage

}

const MessageCard: React.FC<MessageCardProps> = ({ id, name, profilePic, lastMessage, isOnline, unreadCount, lastM, dataImages }) => {
    const router = useRouter(); // Utiliser useRouter

    return (
        <TouchableOpacity
            style={styles.messageCard}
            onPress={() => router.push(`/Chat?userId=${id}&userName=${name}&profilePic=${profilePic}&dataImages=${dataImages}`)} // Utiliser router.push pour naviguer
        >
            <Image source={{ uri: profilePic }} style={styles.messageProfilePic} />
            <View style={styles.messageContent}>
                <View style={styles.indic}>
                    <Text style={styles.messageName}>{name}</Text>
                    <View style={[styles.onlineIndicator, styles.indicator, { backgroundColor: isOnline ? COLORS.green : '' }, { display: isOnline ? 'flex' : 'none' }]} >
                    </View>
                </View>
                <Text style={styles.messageText}>
                    {lastMessage.length > 10 ? `${lastMessage.slice(0, 10)}...` : lastMessage}
                </Text>

            </View>



            <View style={[styles.onlineIndicator]} >
                <Text style={styles.messageText}>{lastM}</Text>
            </View>
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
    indic: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center'
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
