import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, Image, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '@/assets/style/style.color';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import ParseHtmlToComponents from '@/components/ParseHtmlComponent';
import { getMessage, sendMessage } from '@/request/ApiRest';
import Video from 'react-native-video';
import * as ImagePicker from 'expo-image-picker';
import { setNewmessage } from '@/store/userSlice';
interface Message {
    id: string;
    isMe: boolean;
    seen: string;
    type: string;  // 'text', 'image', 'video', 'gif', 'story', etc.
    body: string;  // Peut être un texte ou une URL d'image/vidéo
    story: string; // Utilisé uniquement pour le type 'story'
    storyData: any[]; // Utilisé uniquement pour le type 'story'
    avatar: string;
    gif: string;   // Utilisé uniquement pour le type 'gif'
    gift: string;  // Utilisé uniquement pour le type 'gift'
    photo: string; // Utilisé uniquement pour le type 'image'
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
    const [selectedImage, setSelectedImage] = useState<string | undefined>();
    const flatListRef = useRef<FlatList>(null);


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
        // Envoyer l'image si elle est sélectionnée
        // if (selectedImage) {
        //     const imageMsg: Message = {
        //         id: (messages.length + 1).toString(),
        //         isMe: true,
        //         seen: '0',
        //         type: 'image',
        //         body: selectedImage, // URL de l'image 
        //         story: '0',
        //         storyData: [],
        //         avatar: profilePic,
        //         gif: '0',
        //         gift: '0',
        //         photo: selectedImage,
        //         timestamp: new Date().toLocaleDateString()
        //     };

        //     // Mettre à jour l'UI avec le message image
        //     setMessages([...messages, imageMsg]);

        //     // Créer la query pour l'image
        //     const queryImage = `${auth.idUser}[message]${userId}[message]${selectedImage}[message]image`;
        //     const responseImage = await sendMessage(queryImage);
        //     if (responseImage.status !== 200) {
        //         console.error('Erreur lors de l\'envoi de l\'image');
        //         return;
        //     }

        //     // Réinitialiser l'image sélectionnée après l'envoi
        //     setSelectedImage(undefined);
        // }

        // Envoyer le texte si présent
        if (newMessage.trim()) {
            const textMsg: Message = {
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

            // Mettre à jour l'UI avec le message texte
            setMessages([...messages, textMsg]);
            scrollToEnd();

            // Créer la query pour le texte
            const queryText = `${auth.idUser}[message]${userId}[message]${newMessage}[message]text`;
            console.log('query ', queryText);

            const responseText = await sendMessage(queryText);
            if (responseText !== 200) {
                console.error('Erreur lors de l\'envoi du texte');
            }

            // Réinitialiser le champ de texte après l'envoi
            setNewMessage('');
            dispatch(setNewmessage(newMessage))
        }
    };
    const scrollToEnd = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };


    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Désolé, nous avons besoin des permissions pour accéder à vos photos !');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View style={[styles.messageContainer, item.isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
            {item.isMe ? '' : <Image source={{ uri: item.avatar }} style={styles.avatar} />}
            <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.otherMessage]}>
                {item.type === 'image' && <Image source={{ uri: item.body }} style={styles.messageImage} />}
                {item.type === 'video' && <Video source={{ uri: item.body }} style={styles.messageVideo} />}
                {item.type === 'gif' && <Image source={{ uri: item.gif }} style={styles.messageImage} />}
                {item.type === 'story' && (
                    <View>
                        {/* Rendre l'histoire en fonction des données */}
                        {item.storyData.map((data, index) => (
                            <Text key={index}>{data}</Text>
                        ))}
                    </View>
                )}
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
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContainer}
                onContentSizeChange={scrollToEnd}
            />
            <View style={styles.footer}>
                {
                    selectedImage &&
                    <Pressable onPress={() => openImagePicker()}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: 250, height: 250, borderRadius: 125, }}
                            resizeMode="cover"
                        />
                    </Pressable>


                }
                <TouchableOpacity style={styles.iconButton} onPress={() => openImagePicker()}>
                    <MaterialIcons name="photo-library" size={24} color={COLORS.bg1} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <TouchableOpacity style={styles.iconButton} onPress={() => handleSend()}>
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
    messageVideo: {
        width: 200,           // Adjust width as needed
        height: 150,          // Adjust height as needed
        borderRadius: 8,      // Optional: to match your design
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
