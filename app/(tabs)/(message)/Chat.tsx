import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, Image, Pressable, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '@/assets/style/style.color';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import ParseHtmlToComponents from '@/components/ParseHtmlComponent';
import { getGif, getGifts, getMessage, getUserCredits, message, rt, sendImage, sendMessage, today, updateCredits, uploadBase64Image, userProfil } from '@/request/ApiRest';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import * as ImagePicker from 'expo-image-picker';
import { setNewmessage } from '@/store/userSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { translations } from '@/service/translate';
import Modal from 'react-native-modal/dist/modal';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');
const itemWidth = 60;
const getNumColumns = () => Math.floor(width / itemWidth);
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

const ChatScreen: React.FC = () => {

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [dataImages, setdataImages] = useState<DataImage>([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { userId, userName, profilePic, premium } = route.params as { userId: string; userName: string; profilePic: any; premium: string };

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | undefined>();

    const [isImageSelect, setisImageSelect] = useState(false);

    const closeImageselect = () => { setisImageSelect(!isImageSelect) }
    const [dataGifts, setDataGifts] = useState();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        getMessageAll()
        getSolde()
        getSoldeChat()
        getAllGift()
        getAllGifts()
    }, [auth.idUser, userId]);

    useFocusEffect(
        useCallback(() => {
            getSolde()
            getSoldeChat()
            getAllGifts()
        }, [])
    );

    const [soldeChat, setSolde] = useState<number>(0);
    const [soldeUser, setsoldeUser] = useState<number>(0);

    const [SoldeUserInsuffisant, setSoldeUserInsuffisant] = useState(false);
    const [State, setState] = useState('');

    const closeTarif = () => {
        setSoldeUserInsuffisant(false);
    };

    const getAllGift = async () => {
        // Fonction pour récupérer l'index et `downsized_medium`
        const findIndexAndImage = (data: GifArray) => {
            return data.map((item, index) => ({
                id: index + 1, // Index de l'objet (commence à 1)
                Image: item.images?.fixed_height_small?.url || null, // URL de l'image ou null si non disponible
            }));
        };

        // Appeler la fonction avec des données
        const resultData = await getGif(); // Typiquement, cela renvoie un tableau
        const result = findIndexAndImage(resultData);
        setdataImages(result); // Mettre à jour l'état avec des données typées

        // Afficher le résultat
        console.log(result);
    };

    const getAllGifts = async () => {
        try {
            const resultData = await getGifts();
            setDataGifts(resultData.gifts)
        } catch (error) {

        }



    };


    const getSoldeChat = async () => {
        const resultData = await userProfil(userId);
        setSolde(resultData.user.credits)
        setState(resultData.user.online)
        console.log('SOLDE', resultData.user.credits);

    };

    const getSolde = async () => {
        const resultData = await getUserCredits(auth.idUser);
        setsoldeUser(resultData.credits)
        console.log('SOLDE', resultData.credits);

    };

    const getMessageAll = async () => {
        const dataMessage = await getMessage(auth.idUser, userId)
        console.log('DATA RESPONSE MESSAGE', dataMessage);
        setMessages(dataMessage.chat);
    }

    const [option, setOption] = useState(false);

    const showOption = () => {
        if (showGif || showGift) {
            setShowGif(false);
            setShowGift(false);
            setOption(false); // Ensure `option` is turned off if either `showGif` or `showGift` is true
        } else {
            setOption((prevOption) => !prevOption); // Toggle `option` only if both `showGif` and `showGift` are false
        }
    };


    const handleSend = async () => {
        if (soldeUser <= 1) {
            // setSoldeUserInsuffisant(true);
            router.navigate('/(profil)/MostPopular')
            return;
        }

        if (!newMessage.trim()) return;

        const createMessage = (): Message => ({
            id: (messages?.length || 0).toString(),
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
            timestamp: new Date().toLocaleDateString(),
        });
        setNewMessage('');


        const textMsg = createMessage();

        // Mettre à jour l'UI avec le message texte
        setMessages([...(messages || []), textMsg]);
        scrollToEnd();

        const queryText = `${auth.idUser}[message]${userId}[message]${newMessage}[message]text`;
        console.log('query ', queryText);

        try {
            const upDateCredit = await updateCredits(auth.idUser, '10', '1', 'Credits for send chat message');

            if (upDateCredit === 200) {
                const responseText = await sendMessage(queryText);
                console.log('idrecev', userId);
                console.log('idsend', auth.idUser);


                if (responseText === 200) {
                    const query = `${auth.idUser}[rt]${userId}[rt]${auth.user.user.profile_photo}[rt]${auth.user.user.name}[rt]${newMessage}[rt]text`

                    const response = await rt(query);
                    if (response === 200) {
                        // Réinitialiser le champ de texte après l'envoi
                        setNewMessage('');
                        dispatch(setNewmessage(newMessage));
                        getMessageAll()
                    }

                }


            } else {
                console.error("Erreur lors de la mise à jour des crédits");
            }
        } catch (error) {
            console.error("Erreur : ", error);
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
            allowsEditing: false,
            aspect: [4, 3],
            base64: true,
        });

        if (!result.canceled) {
            // console.log("original:", result.assets[0].mimeType);

            const imageType = result.assets[0].mimeType; // Ex : "image/jpeg" ou "image/png"
            const base64Image = `data:${imageType};base64,${result.assets[0].base64}`;
            setSelectedImage(base64Image);
            setisImageSelect(true)
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
                {item.type === 'text' && <ParseHtmlToComponents html={item.body} isMe={item.isMe} />}
            </View>
        </View>
    );

    const dataImage = [
        { id: 1, Image: require('../../../assets/images/tarif/img1.png') },
        { id: 2, Image: require('../../../assets/images/tarif/img2.png') },
        { id: 3, Image: require('../../../assets/images/tarif/img3.png') },
        { id: 4, Image: require('../../../assets/images/tarif/img4.png') },
        { id: 5, Image: require('../../../assets/images/tarif/img5.png') },
        { id: 6, Image: require('../../../assets/images/tarif/img6.png') },
        { id: 7, Image: require('../../../assets/images/tarif/img7.png') },
    ];

    const [creditSend, setcreditSend] = useState<number | null>(null);

    const [isAlert, setisAlert] = useState(false);
    const closeAlert = () => {
        setisAlert(false);
    };

    const [showGift, setShowGift] = useState(false);
    const [showGif, setShowGif] = useState(false);
    const [giftSelect, setgiftSelect] = useState(false);
    const selectOption = (type: string) => {
        type === 'gift' ? setShowGift(true) : setShowGift(false)
        type === 'gif' ? setShowGif(true) : setShowGif(false)
        showOption()
    };
    const [giftPrix, setGiftPrix] = useState('');
    const [giftImage, setGiftImage] = useState('');

    const showGiftSelect = (prix: string, image: string) => {
        setgiftSelect(true);
        setGiftPrix(prix)
        setGiftImage(image)

    };
    const closeGiftSelect = () => {
        setgiftSelect(false);
        // setGiftPrix('')
        // setGiftImage('')
    };


    const sendGiftConfirm = (idReceve: string, prix: string, image: string) => {
        console.log('idSend:', auth.idUser);
        console.log('idReceve : ', idReceve);
        console.log('image : ', image);
        console.log('prix', prix);

        const prixNumber = parseFloat(prix);

        if (soldeUser <= (10 + prixNumber)) {
            // setSoldeUserInsuffisant(true);
            router.navigate('/(profil)/MostPopular')
            return;
        }

        // Update credit receve 
        const updateCreditReceve = async () => {
            try {
                const upDateCredit = await updateCredits(idReceve, '10', '2', 'Credits for message recieved');

                if (upDateCredit === 200) {
                    const queryText = `${auth.idUser}[message]${idReceve}[message]${image}[message]gift[message]${prix}`;
                    const responseText = await sendMessage(queryText);
                    if (responseText === 200) {
                        const upDateCredit = await updateCredits(idReceve, prix, '2', 'Credits for like');
                        if (upDateCredit === 200) {
                            setcreditSend(prixNumber)
                            getSoldeChat()
                            setisAlert(true)
                            setTimeout(() => {
                                setisAlert(false)
                            }, 2000);

                            const query = `${auth.idUser}[rt]${idReceve}[rt]${auth.user.user.profile_photo}[rt]${auth.user.user.name}[rt]${image}[rt]image`
                            const responseMessage = await message(query)
                            if (responseMessage === 200) {
                                console.log('GIT ENVOYER *************');
                                const createMessage = (): Message => ({
                                    id: (messages?.length || 0).toString(),
                                    isMe: true,
                                    seen: '0',
                                    type: 'image',
                                    body: image,
                                    story: '0',
                                    storyData: [],
                                    avatar: profilePic,
                                    gif: '0',
                                    gift: '0',
                                    photo: '0',
                                    timestamp: new Date().toLocaleDateString(),
                                });

                                const textMsg = createMessage();

                                // Mettre à jour l'UI avec le message texte
                                setMessages([...(messages || []), textMsg]);
                                scrollToEnd();
                                setShowGift(false)

                            }
                        }

                    } else {
                        console.error("Erreur lors de la mise à jour des crédits");
                    }
                } else {
                    console.error("Erreur lors de la mise à jour des crédits");
                }
            } catch (error) {
                console.error("Erreur : ", error);
            }
        };
        updateCreditReceve()
        closeGiftSelect()

    };


    const sendGiftMessage = (idReceve: string, image: string) => {
        console.log('idSend:', auth.idUser);
        console.log('idReceve : ', idReceve);
        console.log('image : ', image);
        setShowGif(false)

        if (soldeUser < (20)) {
            console.log('SOLDE E', soldeUser);

            // setSoldeUserInsuffisant(true);
            router.navigate('/(profil)/MostPopular')
            return;
        }

        // Update credit receve 
        const updateCreditReceve = async () => {
            try {
                const upDateCredit = await updateCredits(idReceve, '10', '2', 'Credits for message recieved');

                if (upDateCredit === 200) {

                    const upDateCreditSend = await updateCredits(auth.idUser, '10', '1', 'Credits for send chat message');
                    if (upDateCreditSend === 200) {
                        const upDateToday = await today(auth.idUser);
                        if (upDateToday === 200) {

                        }
                        const queryText = `${auth.idUser}[message]${idReceve}[message]${image}[message]gif`;
                        const responseText = await sendMessage(queryText);
                        if (responseText === 200) {

                            const createMessage = (): Message => ({
                                id: (messages?.length || 0).toString(),
                                isMe: true,
                                seen: '0',
                                type: 'gif',
                                body: image,
                                story: '0',
                                storyData: [],
                                avatar: profilePic,
                                gif: '0',
                                gift: '0',
                                photo: '0',
                                timestamp: new Date().toLocaleDateString(),
                            });

                            const textMsg = createMessage();

                            // Mettre à jour l'UI avec le message texte
                            // setMessages([...(messages || []), textMsg]);
                            setShowGif(false)
                            getMessageAll()
                            scrollToEnd();


                        } else {
                            console.error("Erreur lors de la mise à jour des crédits");
                        }
                    }


                } else {
                    console.error("Erreur lors de la mise à jour des crédits");
                }
            } catch (error) {
                console.error("Erreur : ", error);
            }
        };
        updateCreditReceve()
        closeGiftSelect()

    };

    const [idReceveMessage, setidReceveMessage] = useState('');

    const sendImageMessage = (idReceve: string) => {

        setidReceveMessage(idReceve)

        openImagePicker()

    };

    const sendImageMessageConfirm = () => {

        console.log('idSend:', auth.idUser);
        console.log('idReceve : ', idReceveMessage);

        if (soldeUser < (20)) {
            console.log('SOLDE E', soldeUser);

            setSoldeUserInsuffisant(true);
            return;
        }


        // Update credit receve 
        const updateCreditReceve = async () => {
            try {


                const upDateCredit = await updateCredits(idReceveMessage, '10', '2', 'Credits for message recieved');

                if (upDateCredit === 200) {

                    const upDateCreditSend = await updateCredits(auth.idUser, '10', '1', 'Credits for send chat message');
                    if (upDateCreditSend === 200) {

                        if (!selectedImage) {
                            // alert("Aucune image sélectionnée !");
                            return;
                        }




                        // ICI 
                        console.log(selectedImage);

                        const send = async () => {
                            const responseSendImage = await uploadBase64Image(selectedImage);
                            console.log('reponse Upload ', responseSendImage);
                            if (responseSendImage && responseSendImage.path && responseSendImage.thumb) {

                                // 49[rt]32[rt]y[rt]ManManayy[rt]t[rt]image
                                const image = `https://www.e-coress.com/assets/sources/${responseSendImage.path}`


                                const query = `${auth.idUser}[rt]${idReceveMessage}[rt]${auth.user.user.profile_photo}[rt]${auth.user.user.name}[rt]${image}[rt]image`
                                const responseMessage = await message(query)
                                if (responseMessage === 200) {

                                    const queryText = `${auth.idUser}[message]${idReceveMessage}[message]${image}[message]image`;
                                    const responseText = await sendMessage(queryText);
                                    if (responseText === 200) {
                                        getMessageAll()
                                    }
                                }



                            }
                        }
                        send()

                        const responseSendImage = await sendImage(selectedImage, auth.idUser, idReceveMessage);

                        if (responseSendImage === 200) {
                            getMessageAll()
                            setOption(false)
                            setSelectedImage('')
                            scrollToEnd();
                        } else {
                            console.error("Erreur lors de la mise à jour des crédits");
                        }
                    }


                } else {
                    console.error("Erreur lors de la mise à jour des crédits");
                }
            } catch (error) {
                console.error("Erreur : ", error);
            }
        };
        if (selectedImage) {
            console.log('atttttttttt');

            updateCreditReceve()
        } else {
            console.log('pppppppppppppp');
            setSelectedImage('')
        }

        closeGiftSelect()
        setidReceveMessage('')
        setisImageSelect(false)

    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/(message)/')}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <View style={styles.between}>
                    <View style={styles.messageCard}>
                        <Image source={{ uri: profilePic }} style={styles.profilePic} />
                        <View>
                            <View style={styles.flex}>
                                <Text style={styles.personName}>{userName}</Text>
                                {premium === '1' && <Icon name="medal-outline" size={15} color={COLORS.jaune} />}
                            </View>
                            <ThemedText style={styles.state} type="title">{State !== '0' ? t.on : t.off}</ThemedText>
                        </View>

                    </View>
                    <View style={styles.solde} >
                        <ThemedText style={styles.state} type="title">{soldeChat} {t.credit}</ThemedText>
                    </View>
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

            {showGift && dataGifts && <View style={styles.cadeau}>
                <FlatList
                    horizontal
                    data={dataGifts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (

                        <TouchableOpacity style={styles.giftContainer} onPress={() => showGiftSelect(item.prix, item.Image)}>
                            <Image source={{ uri: item.Image }} style={styles.giftImage} />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.personList}
                />
            </View>}
            <Modal
                // isVisible={true}
                isVisible={giftSelect}
                onBackdropPress={closeGiftSelect}
                style={styles.modal}
            >

                <View style={styles.conatinerGift}>


                    <Image
                        source={{ uri: giftImage }}
                        style={styles.imageGift}
                        resizeMode="contain"
                    />
                    <View style={styles.conatinerGiftText}>
                        <ThemedText type='subtitle'>{t.sendGift1} {userName}</ThemedText>
                        <ThemedText>{t.sendGift2} {giftPrix} {t.credit}</ThemedText>
                    </View>

                    <TouchableOpacity onPress={() => sendGiftConfirm(userId, giftPrix, giftImage)} style={styles.sendGift}>
                        <Text style={styles.sendGiftText}>{t.send}</Text>
                    </TouchableOpacity>



                </View>
            </Modal>

            {showGif && <View style={styles.cadeau1}>
                <FlatList
                    data={dataImages}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => { }}
                            style={styles.cardItem}
                            activeOpacity={0.7}
                        >
                            {item.Image ? (<View>
                                <TouchableOpacity style={styles.gifContainer} onPress={() => sendGiftMessage(userId, item.Image ?? '')}>
                                    <Image source={{ uri: item.Image }} style={styles.giftImage} />
                                </TouchableOpacity>
                            </View>) : null}

                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={getNumColumns()}
                    columnWrapperStyle={styles.columnWrapper}
                />
            </View>}
            {option && <View style={styles.other}>
                <TouchableOpacity style={styles.iconButton1} onPress={() => { sendImageMessage(userId) }}>
                    <MaterialIcons name="photo-library" size={40} color={COLORS.bg1} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton1} onPress={() => { selectOption('gift') }}>
                    <MaterialIcons name="card-giftcard" size={40} color={COLORS.bg1} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton1} onPress={() => { selectOption('gif') }}>
                    <MaterialIcons name="gif" size={40} color={COLORS.bg1} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton1} onPress={() => { }}>
                    <MaterialIcons name="video-chat" size={40} color={COLORS.bg1} />
                </TouchableOpacity>

            </View>}
            <View style={styles.footer}>

                <TouchableOpacity style={styles.iconButton} onPress={() => showOption()}>
                    <MaterialIcons name="format-list-bulleted" size={24} color={COLORS.bg1} />
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
            <Modal
                isVisible={SoldeUserInsuffisant}
                onBackdropPress={closeTarif}
                style={styles.modal}
            >

                <View style={styles.filterModalContent1}>
                    <TouchableOpacity onPress={closeTarif} style={styles.notNowBtn}>
                        <Text style={styles.notNow}>{t.notNow}</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={dataImage}
                        horizontal
                        renderItem={({ item }) => (
                            <View style={styles.containeImage}>
                                <Image
                                    source={item.Image} // Directement l'objet require()
                                    style={styles.stepImage1}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                    />
                    <View style={styles.notNowBtn}>
                        <Text style={styles.notNow}>{t.pack}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { }} style={styles.btnPack}>
                        <Text style={styles.notNow}>1001 Credits</Text>
                        <Text style={styles.notNow}>4.99Eur</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} style={styles.btnPack}>
                        <Text style={styles.notNow}>2501 Credits</Text>
                        <Text style={styles.notNow}>9.99Eur</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }} style={styles.btnPack}>
                        <Text style={styles.notNow}>5000 Credits</Text>
                        <Text style={styles.notNow}>14.99Eur</Text>
                    </TouchableOpacity>



                </View>
            </Modal>
            <Modal
                isVisible={isAlert}
                onBackdropPress={closeAlert}
                style={styles.modal}
            >
                <View style={styles.modalOverlay}>

                    <View style={styles.modalAlert}>
                        <Icon name="rocket-outline" size={30} color={COLORS.jaune} />
                        <ThemedText>{t.spend1} {creditSend} {t.spend2} </ThemedText>
                    </View>
                </View>

            </Modal>

            <Modal
                isVisible={isImageSelect}
                onBackdropPress={closeImageselect}
                style={styles.modal}
            >
                <View style={styles.modalOverlay}>

                    <View style={styles.modalContent}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: '100%', height: '100%', borderRadius: 10, }}
                            resizeMode="contain"
                        />
                    </View>
                    <TouchableOpacity onPress={() => sendImageMessageConfirm()} style={styles.sendGift}>
                        <Text style={styles.sendGiftText}>{t.send}</Text>
                    </TouchableOpacity>


                </View>

            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        width: '100%',
        height: '90%',
        backgroundColor: 'transparent',
        position: 'relative',
    },
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
        fontSize: 20,
        color: COLORS.white,
        fontWeight: 'bold',
        marginRight: 10
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    state: {
        fontSize: 16,
        color: COLORS.lightGray,
        // fontWeight: 'bold',
    },
    solde: {
        // backgroundColor: 'red',
        // width: '20%'

    },
    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    between: {
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '85%',

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
        backgroundColor: COLORS.white,
        color: COLORS.red,
    },
    otherMessage: {
        // backgroundColor: COLORS.lightGray,
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    cardItem: {
        width: itemWidth,
        marginBottom: 10,
    },
    other: {
        width: '20%',

        padding: 5,
        // backgroundColor: 'red',
        borderRadius: 5,
        position: 'absolute',
        bottom: 70

    },
    cadeau: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'


    },
    cadeau1: {
        // width: '90%',
        height: 200,

        // padding: 5,
        backgroundColor: COLORS.grayOne,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'


    },
    giftContainer: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.grayOne,
        marginHorizontal: 5,
        borderRadius: 5

    },
    giftImage: {
        width: '100%',
        height: '100%'
    },
    gifContainer: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.grayOne,
        marginHorizontal: 5,
        borderRadius: 5
    },
    personList: {
        paddingVertical: 20,
        height: 120,
        elevation: 0.2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        marginBottom: 5,
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
    iconButton1: {
        backgroundColor: COLORS.grayOne,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,



    },
    input: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
    },

    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    filterModalContent1: {
        backgroundColor: 'white',
        borderRadius: 10,

        width: '100%'
        // maxHeight: '80%',
    },
    conatinerGift: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',


    },
    notNow: {
        color: 'black',
        fontSize: 18,
    },
    sendGiftText: {
        color: 'white',
        fontSize: 18,
    },
    notNowBtn: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bg1,
        paddingBottom: 10,
        paddingVertical: 10
    },
    sendGift: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        backgroundColor: COLORS.bg1,
        marginTop: 20

    },
    conatinerGiftText: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingVertical: 10,
        // backgroundColor: 'red'
    },
    btnPack: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.bg1,
        paddingBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5
    },
    stepImage1: {

        width: 360,
        height: 250,
        margin: 3

    },
    imageGift: {

        width: 180,
        height: 180,
        margin: 3,
        // backgroundColor: 'red',
        marginTop: 10

    },
    containeImage: {

        // // height: 200,
        // backgroundColor: 'blue',
        // justifyContent: 'center', // Centre verticalement
        // alignItems: 'center',    // Centre horizontalement
    },
    modalAlert: {
        backgroundColor: "#fff",
        height: 100,
        width: "100%",
        borderRadius: 10,
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 10,
    },
});

export default ChatScreen;
