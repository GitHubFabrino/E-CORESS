
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InputText from './InputText';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { COLORS } from '@/assets/style/style.color';
import InputSelector from './InputSelector';


interface Interest {
    id: string;
    icon: string;
    name: string;
}

interface InterestListProps {
    title?: String;
    profileInfo: {
        interest: { [key: string]: Interest };
    };
}

const InterestList: React.FC<InterestListProps> = ({ title, profileInfo }) => {
    return (
        <View>
            <View style={styles.itemTitle}>
                <ThemedText type='defaultSemiBold'>{title}</ThemedText>
            </View>
            <ThemedView style={styles.containerInterest}>
                {Object.values(profileInfo.interest).map((item) => (
                    <View style={styles.cardInterest} key={item.id}>
                        <Image
                            source={{ uri: item.icon }}
                            style={styles.profilePic}
                        />
                        <ThemedText>{item.name}</ThemedText>
                    </View>
                ))}
            </ThemedView>
        </View>
    );
};

export default InterestList;

const styles = StyleSheet.create({
    itemTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
        backgroundColor: COLORS.bg3,
    },
    containerInterest: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10,
        // backgroundColor: "red",
        width: 370
    },
    cardInterest: {
        alignItems: 'center',
        margin: 5,
        width: 100,
        // backgroundColor: "blue"
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5,
    },
    cardInteret: {
        backgroundColor: '#fff',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
