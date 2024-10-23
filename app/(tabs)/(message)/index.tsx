import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/assets/style/style.color';
import PersonCard from '@/components/card/PersonCard';
import MessageCard from '@/components/card/MessageCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getChats } from '@/request/ApiRest';
import { setAllChats } from '@/store/userSlice';
import { translations } from '@/service/translate';

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

const MessageScreen: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        if (auth.idUser) {
            getMessage();
        }
    }, [auth.newM]);

    const getMessage = async () => {
        try {
            const response = await getChats(auth.idUser);
            dispatch(setAllChats(response));
            const { matches } = response;
            setPeople(matches);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Messages</ThemedText>
            </ThemedView>
            <FlatList
                horizontal
                data={people}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PersonCard
                        name={item.name}
                        profilePic={item.photo}
                        id={item.id}
                        lastMessage={item.last_m}
                        isOnline={item.online !== 0}
                        unreadCount={item.unreadCount}
                    />
                )}
                contentContainerStyle={styles.personList}
            />
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="subtitle">{t.recent}</ThemedText>
            </ThemedView>
            <FlatList
                data={people}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageCard
                        id={item.id}
                        name={item.name}
                        profilePic={item.photo}
                        lastMessage={item.last_m}
                        isOnline={item.online !== 0}
                        unreadCount={item.unreadCount}
                    />
                )}
                contentContainerStyle={styles.messageList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingTop: 50,

    },
    titleContainer: {
        marginBottom: 10,
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
    messageList: {
        flexGrow: 1,
        padding: 10,
    },
});

export default MessageScreen;
