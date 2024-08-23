import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '@/assets/style/style.color';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface Message {
    id: string;
    text: string;
    senderId: string;
}

const ChatScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { userId, userName, profilePic } = route.params as { userId: string; userName: string; profilePic: any };

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello!', senderId: userId },
        { id: '2', text: 'How are you?', senderId: 'me' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: (messages.length + 1).toString(), text: newMessage, senderId: 'me' }]);
            setNewMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <View style={styles.messageCard} >
                    <Image source={profilePic} style={styles.profilePic} />
                    <Text style={styles.personName}>{userName}</Text>
                </View>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.senderId === 'me' ? styles.myMessage : styles.otherMessage]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="photo-library" size={24} color={COLORS.bg1} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
                    <FontAwesome name="send" size={24} color={COLORS.bg1} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: 25
    },

    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bg1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: 10,
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        marginRight: 10
    },
    personName: {
        marginTop: 5,
        fontSize: 16,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        color: COLORS.white,
        flex: 1,
        textAlign: 'center',
    },
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#f6cf444f',
        marginRight: 10
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#43539251',
        marginLeft: 10
    },
    messageText: {
        color: COLORS.bg1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: COLORS.lightGray,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },
    iconButton: {
        padding: 10,
    },
});

export default ChatScreen;
