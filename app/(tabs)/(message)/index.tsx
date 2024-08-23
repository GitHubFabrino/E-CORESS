import React from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/assets/style/style.color';
import PersonCard from '@/components/card/PersonCard';
import MessageCard from '@/components/card/MessageCard';

const { width: screenWidth } = Dimensions.get('window');

interface Person {
    id: string;
    name: string;
    profilePic: any;
    lastMessage: string;
    isOnline: boolean;
    unreadCount: number;
}

const people: Person[] = [
    { id: '1', name: 'Alice', profilePic: require('@/assets/images/img1.jpeg'), lastMessage: 'Hey there!', isOnline: true, unreadCount: 2 },
    { id: '2', name: 'Bob', profilePic: require('@/assets/images/img2.jpeg'), lastMessage: 'How are you?', isOnline: false, unreadCount: 0 },
    { id: '3', name: 'Charlie', profilePic: require('@/assets/images/img1.jpeg'), lastMessage: 'I\'m fine, thanks!', isOnline: true, unreadCount: 0 },
    { id: '4', name: 'David', profilePic: require('@/assets/images/img2.jpeg'), lastMessage: 'I\'m busy now, sorry!', isOnline: false, unreadCount: 0 },
    { id: '5', name: 'Eve', profilePic: require('@/assets/images/img1.jpeg'), lastMessage: 'What about you?', isOnline: true, unreadCount: 1 },

];

const MessageScreen: React.FC = () => {
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
                        profilePic={item.profilePic} id={item.id} lastMessage={item.lastMessage} isOnline={item.isOnline} unreadCount={item.unreadCount} />
                )}
                contentContainerStyle={styles.personList}
            />
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="subtitle">Récents</ThemedText>
            </ThemedView>
            <FlatList
                data={people}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageCard

                        id={item.id}
                        name={item.name}
                        profilePic={item.profilePic}
                        lastMessage={item.lastMessage}
                        isOnline={item.isOnline}
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
        marginBottom: 5
    },
    messageList: {
        flexGrow: 1,
        padding: 10,
    },
});

export default MessageScreen;
