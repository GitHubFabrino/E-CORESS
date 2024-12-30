import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/assets/style/style.color';
import PersonCard from '@/components/card/PersonCard';
import MessageCard from '@/components/card/MessageCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getChats, getGif, getUserCredits, spotlight, unreadMessageCount, userProfil } from '@/request/ApiRest';
import { setAllChats } from '@/store/userSlice';
import { translations } from '@/service/translate';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

interface Person {
    id: string;
    name: string;
    firstName: string;
    age: string;
    city: string;
    photo: string;
    error: number;
    last_a: string;
    status: number;
    online: number;
    unread: number;
    premium: string;
    story: string;
    stories: string;
    unreadCount: string;
    last_m: string;
    last_m_time: string | null;
    credits: string;
    lang_prefix: string;
    last_m_t: string;
    check_m: number;
    gift: number;
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


const MessageScreen: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [people, setPeople] = useState<Person[]>([]);
    const [Spotlight, setSpotlight] = useState();
    const [dataImage, setdataImages] = useState<DataImage>([]);
    const [loading, setLoading] = useState(true);
    const [Solde, setSolde] = useState<number>(0);
    const [unread, setUnread] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        console.log('useEffect Message');
        setLoading(true);
        fetchData();
    }, []);
    useFocusEffect(
        useCallback(() => {
            fetchData();
            console.log('useFocuse Message');

        }, [auth.idUser])
    );

    const fetchData = async () => {

        try {
            const [chats, unreadMessages, credits, gifts, spotlightData] = await Promise.all([
                getChats(auth.idUser),
                unreadMessageCount(auth.idUser),
                getUserCredits(auth.idUser),
                getGif(),
                spotlight(auth.idUser)
            ]);
            dispatch(setAllChats(chats));
            setPeople(chats.matches);
            setUnread(unreadMessages.unreadMessageCount)
            setdataImages(findIndexAndImage(gifts));
            setSolde(credits.credits)
            setSpotlight(spotlightData.spotlight.filter((item: { id: any; }, index: any, self: any[]) =>
                index === self.findIndex((t) => t.id === item.id)
            ));

        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };


    const findIndexAndImage = (data: GifArray) => {
        return data.map((item, index) => ({
            id: index + 1, // Index de l'objet (commence à 1)
            Image: item.images?.fixed_height_small?.url || null, // URL de l'image ou null si non disponible
        }));
    };

    const selectType = (type: string) => {
        setSelectedType(type);
    };

    // Filtrage dynamique
    const filterPeople = () => {
        switch (selectedType) {
            case 'notread':
                return people.filter(person => person.unread === 0);
            case 'online':
                return people.filter(person => person.online !== 0);
            default: // 'all'
                return people;
        }
    };
    const filteredData = filterPeople()

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.jaune} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={{ color: COLORS.bg1 }}>Messages</ThemedText>

            </ThemedView>
            <TouchableOpacity onPress={() => fetchData()} style={[styles.filterButton, { position: 'absolute', top: 50, right: 0 }]}>
                <Icon name="refresh-circle" size={25} color={COLORS.darkBlue} />
            </TouchableOpacity>
            {Spotlight && (
                <FlatList
                    horizontal
                    data={Spotlight}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        item.id !== auth.idUser ? (
                            <PersonCard
                                name={item.name}
                                profilePic={item.photo}
                                id={item.id}
                                lastMessage={item.last_m}
                                isOnline={item.status}
                                unreadCount={item.unreadCount}
                            />
                        ) : null // Vous pouvez retourner null si l'utilisateur est le même que auth.idUser 
                    )}
                    contentContainerStyle={styles.personList}
                />
            )}
            <ThemedView style={styles.type}>
                <View style={styles.center}>
                    <TouchableOpacity onPress={() => selectType('all')} style={styles.filterButton}>
                        <ThemedText type="defaultSemiBold">{t.all}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectType('notread')} style={styles.filterButton}>
                        <ThemedText type="defaultSemiBold">{t.notread}</ThemedText>

                        {unread && unread !== '0' && <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>{unread}</Text>
                        </View>}


                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectType('online')} style={styles.filterButton}>
                        <ThemedText type="defaultSemiBold">{t.online}</ThemedText>
                    </TouchableOpacity>
                </View>

            </ThemedView>
            <View style={styles.mess}>
                {filteredData.length !== 0 ? (

                    <FlatList
                        data={filterPeople()}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <MessageCard
                                id={item.id}
                                name={item.name}
                                profilePic={item.photo}
                                lastMessage={item.last_m}
                                isOnline={item.online !== 0}
                                unreadCount={item.unreadCount}
                                lastM={item.last_m_t}
                                dataImages={dataImage}
                                premium={item.premium}
                            />
                        )}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={styles.messageList}
                        style={{ flex: 1 }}
                        keyboardShouldPersistTaps="handled" // Permet au clavier d’être ignoré lors de l’interaction
                    />


                ) : (
                    <View style={styles.emptyMessageText}>
                        <ThemedText >{t.noMessages}</ThemedText>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingTop: 50,

    },
    container1: {

        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingTop: 50,

    },
    titleContainer: {
        marginBottom: 10,
    },
    type: {
        // backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    center: {
        // backgroundColor: 'red',
        width: '65%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 5,
        paddingBottom: 5,
        borderBlockColor: COLORS.bg1
    },
    filterButton: {
        width: '32%',
        // backgroundColor: 'blue',
        padding: 5
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
    personList: {
        paddingVertical: 20,
        height: 120,
        elevation: 0.2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        marginBottom: 5,
        // backgroundColor: 'blue',

    },
    messageList: {
        flexGrow: 1,
        padding: 10,
    },
    mess: {
        height: screenWidth * 0.8,
        flex: 20,
        // backgroundColor: 'green'
    },
    emptyMessageText: {
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: 100,
        top: 10,
        elevation: 0.2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        borderRadius: 10,

    }
});

export default MessageScreen;
