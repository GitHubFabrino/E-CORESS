import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '@/assets/style/style.color';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import ParseHtmlToComponents from '@/components/ParseHtmlComponent';
import { getMessage, sendMessage } from '@/request/ApiRest';
import { setNewmessage } from '@/store/userSlice';

interface Message {
    id: string;
    isMe: boolean;
    seen: string;
    type: string;  // 'text', 'image', 'story'
    body: string;
    story: string;
    storyData: any[];
    avatar: string;
    gif: string;
    gift: string;
    photo: string;
    timestamp: string;
}

const ChatScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const route = useRoute();
    const navigation = useNavigation();
    const { userId, userName, profilePic } = route.params as { userId: string; userName: string; profilePic: any };

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    console.log('USER ID IN CHAT', userId);


    // Simuler la réponse de l'API
    useEffect(() => {
        getMessageAll()
    }, [auth.idUser, userId]);

    const getMessageAll = async () => {
        const dataMessage = await getMessage(auth.idUser, userId)
        console.log('DATA RESPONSE MESSAGE', dataMessage);
        setMessages(dataMessage.chat);
    }

    const handleSend = async () => {
        if (newMessage.trim()) {
            // Créer le nouveau message localement
            const newMsg: Message = {
                id: (messages.length + 1).toString(),
                isMe: true,
                seen: '0',
                type: 'text',
                body: newMessage,
                story: '0',
                storyData: [],
                avatar: profilePic,
                gif: '0',
                gift: '0',
                photo: '0',
                timestamp: new Date().toLocaleDateString()
            };

            // Mettre à jour l'UI immédiatement
            setMessages([...messages, newMsg]);
            setNewMessage('');
            const query = `${auth.idUser}[message]${userId}[message]${newMessage}[message]text`;

            console.log("QUERY", query);

            const dataResponseSendMessage = await sendMessage(query)
            if (dataResponseSendMessage.status === 200) {

            }
            dispatch(setNewmessage(!auth.newM))

        }
    };


    const renderItem = ({ item }: { item: Message }) => (
        <View style={[styles.messageContainer, item.isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
            {item.isMe ? '' : <Image source={{ uri: item.avatar }} style={styles.avatar} />}
            <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.otherMessage]}>
                {item.type === 'image' && <Image source={{ uri: item.body }} style={styles.messageImage} />}
                {item.type === 'text' && <ParseHtmlToComponents html={item.body} />}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <View style={styles.messageCard}>
                    <Image source={{ uri: profilePic }} style={styles.profilePic} />
                    <Text style={styles.personName}>{userName}</Text>
                </View>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
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
    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        padding: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMessage: {
        backgroundColor: COLORS.jaune,
        color: COLORS.red,
    },
    otherMessage: {
        backgroundColor: COLORS.lightGray,
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        padding: 10,
        backgroundColor: COLORS.white,
    },
    iconButton: {
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
    },
});

export default ChatScreen;
