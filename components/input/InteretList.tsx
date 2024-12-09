
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InputText from './InputText';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { COLORS } from '@/assets/style/style.color';
import InputSelector from './InputSelector';
import { add_interest } from '@/request/ApiRest';


interface Interest {
    id: string;
    icon: string;
    name: string;
}
interface InterestsData {
    id: string; // Identifiant unique de l'intérêt
    name: string; // Nom de l'intérêt
    icon: string; // URL de l'icône
    count: string; // Nombre d'éléments associés
}

interface InterestListProps {
    title?: String;
    profileInfo: {
        interest: { [key: string]: Interest };
    };
    dataAllInterest: InterestsData[],
    userId: string,
    update: () => void;
}

const InterestList: React.FC<InterestListProps> = ({ title, profileInfo, dataAllInterest, userId, update }) => {

    const [modifApropos, setmodifApropos] = useState(false);

    const [selectedInterest, setSelectedInterest] = useState<string | null>(null); // État pour suivre l'intérêt sélectionné

    const addInterest = async (userId: string, idInterest: string) => {
        try {
            const response = await add_interest(userId, idInterest);
            console.log("RESPONSE Interest: ", response);
            update()
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <View>

            <View style={styles.itemTitre}>
                <ThemedText type='defaultSemiBold'>{title}</ThemedText>
                <TouchableOpacity onPress={() => setmodifApropos(!modifApropos)}>
                    <Icon name={!modifApropos ? "create-outline" : "checkmark-done-outline"} size={25} color={!modifApropos ? COLORS.darkBlue : COLORS.green} />
                </TouchableOpacity>
            </View>
            <ThemedView style={styles.containerInterest}>
                {modifApropos !== true ? (
                    // Affichage des anciens intérêts présents dans profileInfo.interest
                    Object.values(profileInfo.interest).map((item) => (
                        <View style={styles.cardInterest} key={item.id}>
                            <Image
                                source={{ uri: item.icon }}
                                style={styles.profilePic}
                            />
                            <ThemedText>{item.name}</ThemedText>
                        </View>
                    ))
                ) : (
                    // Affichage des nouveaux intérêts à partir de dataAllInterest
                    dataAllInterest?.length > 0 ? (
                        dataAllInterest.map((item) => {
                            // Vérifier si l'intérêt est déjà présent dans profileInfo.interest
                            const isExistingInterest = profileInfo.interest.hasOwnProperty(item.id);
                            return (
                                <TouchableOpacity key={item.id} onPress={() => { setSelectedInterest(item.id); addInterest(userId, item.id) }}>
                                    <View style={[styles.cardInterest]} >
                                        <Image
                                            source={{ uri: item.icon }}
                                            style={styles.profilePic}
                                        />
                                        {(selectedInterest === item.id || profileInfo.interest.hasOwnProperty(item.id)) && (
                                            <Icon style={styles.exist} name="checkmark-circle-outline" size={25} color={COLORS.jaune} />
                                        )}


                                        <ThemedText>{item.name}</ThemedText>

                                    </View>
                                </TouchableOpacity>

                            );
                        })
                    ) : (
                        <ThemedText>Aucune donnée d'intérêt disponible.</ThemedText>
                    )
                )}
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
    itemTitre: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
        backgroundColor: COLORS.bg3
    },
    infoCard: {
        width: '100%',
        padding: 10,

    },
    cardInterest: {
        alignItems: 'center',
        margin: 5,
        width: 100,
        // backgroundColor: "blue"
    },
    existingInterest: {
        backgroundColor: COLORS.grayOne, // Couleur pour marquer un intérêt existant
        borderColor: COLORS.darkBlue, // Changer la couleur de la bordure si nécessaire
        borderWidth: 2,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5,
    },
    exist: {
        position: 'absolute',
        top: 0,
        right: 0

    },
    cardInteret: {
        backgroundColor: '#fff',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
