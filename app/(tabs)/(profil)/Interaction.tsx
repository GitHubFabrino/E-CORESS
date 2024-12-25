import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ActivityIndicator, Text, FlatList, ScrollView, Dimensions } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { addToSpotlight, discover100, getMatches, getVisitors, raiseUpF, userProfil } from '@/request/ApiRest';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { translations } from '@/service/translate';

import { ThemedView } from '@/components/ThemedView';
import { color } from 'react-native-elements/dist/helpers';
import { UserProfileInterface } from './interfaceProfile';
import { setLanguage } from '@/store/userSlice';
import Modal from 'react-native-modal/dist/modal';

import { useFocusEffect } from '@react-navigation/native';

export interface MyLike {
    id: string; // Identifiant unique de l'utilisateur
    name: string; // Nom de l'utilisateur
    firstName: string; // Prénom de l'utilisateur
    age: string; // Âge de l'utilisateur
    city: string; // Ville de l'utilisateur
    last_a: string; // Dernière activité (timestamp)
    premium: string; // Statut premium
    photo: string; // URL de la photo de profil
    error: number; // Indicateur d'erreur
    story: string; // Statut de l'histoire
    stories: string; // Histoires associées
    status: number; // Statut utilisateur
    last_m: string; // Dernier message
    last_m_time: string; // Temps du dernier message
    credits: string; // Crédits disponibles
    check_m: string; // Indicateur de vérification du message
    gift: number; // Cadeaux reçus
}

export interface MyLikesData {
    mylikes: MyLike[];
}

export interface Match {
    id: string; // Identifiant unique de l'utilisateur
    name: string; // Nom de l'utilisateur
    firstName: string; // Prénom de l'utilisateur
    age: string; // Âge de l'utilisateur
    city: string; // Ville de l'utilisateur
    last_a: string; // Dernière activité (timestamp)
    premium: string; // Statut premium
    photo: string; // URL de la photo de profil
    error: number; // Indicateur d'erreur
    story: string; // Statut de l'histoire
    stories: string; // Histoires associées
    status: number; // Statut utilisateur
    last_m: string; // Dernier message
    last_m_time: string; // Temps du dernier message
    credits: string; // Crédits disponibles
    check_m: string; // Indicateur de vérification du message
    gift: number; // Cadeaux reçus
}



export interface MatchesData {
    matches: Match[];
}

const { height: screenHeight } = Dimensions.get('window');

export interface Fan {
    id: string; // Identifiant unique de l'utilisateur
    name: string; // Nom de l'utilisateur
    firstName: string; // Prénom de l'utilisateur
    age: string; // Âge de l'utilisateur
    city: string; // Ville de l'utilisateur
    last_a: string; // Dernière activité (timestamp)
    premium: string; // Statut premium
    photo: string; // URL de la photo de profil
    error: number; // Indicateur d'erreur
    story: string; // Statut de l'histoire
    stories: string; // Histoires associées
    status: number; // Statut utilisateur
    last_m: string; // Dernier message
    last_m_time: string; // Temps du dernier message
    credits: string; // Crédits disponibles
    check_m: string; // Indicateur de vérification du message
    gift: number; // Cadeaux reçus
}

export interface FansData {
    myfans: Fan[];
}

export interface Visitor {
    id: string; // Identifiant unique du visiteur
    name: string; // Nom du visiteur
    firstName: string; // Prénom du visiteur
    age: string; // Âge du visiteur
    city: string; // Ville du visiteur
    last_a: string; // Dernière activité du visiteur (timestamp)
    premium: number; // Indique si le visiteur est premium (0 ou 1)
    photo: string; // URL de la photo du visiteur
    fan: number; // Indique si le visiteur est un fan (0 ou 1)
    match: number; // Indique si le visiteur est un match (0 ou 1)
    error: number; // Erreur éventuelle (0 ou 1)
    story: string; // Statut de story (généralement 0 si non utilisé)
    stories: string; // Liste des stories (sous forme de tableau JSON encodé en chaîne)
    status: number; // Statut en ligne (0 pour hors ligne, 1 pour en ligne)
    last_m: string; // Dernier message ou interaction
    last_m_time: string; // Temps écoulé depuis la dernière interaction
    credits: string; // Crédit restant du visiteur
    check_m: string; // Indicateur pour vérifier un message (0 ou autre)
}

export interface VisitorsData {
    visitors: Visitor[]; // Tableau de visiteurs
}



const Interaction: React.FC = () => {
    const router = useRouter();
    const [soldeUser, setsoldeUser] = useState<number>(0);
    const auth = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [loading, setLoading] = useState(true);
    const [profil, setProfil] = useState<UserProfileInterface | null>(null);


    const [selectedOption, setSelectedOption] = useState('matches'); // Option affichée initialement
    const [showAllOptions, setShowAllOptions] = useState(false); // Si toutes les options sont visibles

    const [dataLike, setdataLike] = useState<MyLikesData | null>(null);
    const [dataMatches, setdataMatches] = useState<MatchesData | null>(null);
    const [dataFans, setdataFans] = useState<FansData | null>(null);

    const [activeView, setActiveView] = useState<string | null>('matches');
    const [preniumUser, setPreniumUser] = useState('');

    const [dataVisitors, setdataVisitors] = useState<VisitorsData | null>(null);


    const [isAlert, setisAlert] = useState(false);
    const closeAlert = () => {
        setisAlert(!isAlert);
    };

    useEffect(() => {
        getMatchesFunc()
        getVisitorsFunc()
        getProfils()
    }, []);
    useFocusEffect(
        useCallback(() => {
            getMatchesFunc()
            getVisitorsFunc()
            getProfils()
        }, [])
    );

    const getProfils = async () => {
        try {
            const response = await userProfil(auth.idUser);
            console.log('Response profile est :', response);

            const userProfile = response.user;
            setProfil(userProfile);

            if (userProfile) {

                const { premium } = userProfile;
                setPreniumUser(premium)

            }
            console.log('prenium', preniumUser);

        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };
    const getMatchesFunc = async () => {
        try {
            const response = await getMatches(auth.idUser);
            console.log('Response profile est :', response);

            if (response.mylikes) {
                setdataLike({ mylikes: response.mylikes });
            }
            if (response.matches) {
                setdataMatches({ matches: response.matches });
            }
            if (response.myfans) {
                setdataFans({ myfans: response.myfans });
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };

    const getVisitorsFunc = async () => {
        try {
            const response = await getVisitors(auth.idUser);
            console.log('Response profile est :', response);

            if (response.visitors) {
                setdataVisitors({ visitors: response.visitors })
            }

        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };
    // Mettre à jour les valeurs dérivées uniquement lorsque les données changent
    const valueMatches = dataMatches?.matches.length || 0;
    const valueVisited = dataVisitors?.visitors.length || 0;
    const valueLike = dataFans?.myfans.length || 0;
    const valueLikesMe = dataLike?.mylikes.length || 0;

    const options = [
        { key: 'matches', label: 'Matches', value: `${valueMatches}` },
        { key: 'visited', label: 'Visited', value: `${valueVisited}` },
        { key: 'likes', label: 'Likes', value: `${valueLike}` },
        { key: 'likesMe', label: 'Likes Me', value: `${valueLikesMe}` },
    ];

    const toggleOptions = () => {
        setShowAllOptions(!showAllOptions);
    };

    const selectOption = (key: string) => {
        setSelectedOption(key);
        setShowAllOptions(false);
    };



    const viewOption = (key: string) => {
        setActiveView(key);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(profil)/')}
            >
                <Ionicons name="arrow-back" size={24} color={COLORS.bg1} />
            </TouchableOpacity>

            <View>
                <View style={styles.cardOption}>
                    {options.map((option) =>
                        showAllOptions || selectedOption === option.key ? (
                            <TouchableOpacity
                                key={option.key}
                                style={styles.cardSelect}
                                onPress={() => {
                                    selectOption(option.key)
                                    viewOption(option.key)
                                }}
                            >
                                <View style={styles.number}>
                                    <ThemedText type="subtitle" style={styles.textWhite}>
                                        {option.value}
                                    </ThemedText>
                                </View>
                                <ThemedText type="subtitle" style={[styles.textWhite, { width: '80%' }]}>
                                    {option.label}
                                </ThemedText>
                            </TouchableOpacity>
                        ) : null
                    )}
                </View>

                <TouchableOpacity onPress={toggleOptions} style={styles.btnChoix}>
                    <Icon
                        name={showAllOptions ? 'caret-up-circle-outline' : 'caret-down-circle-outline'}
                        size={40}
                        color="orange" // Changez avec votre couleur préférée
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                {activeView === 'matches' && (dataMatches?.matches.length != 0 ? (dataMatches?.matches.map((data, index) => (

                    <TouchableOpacity key={index} onPress={() => {
                        if (profil?.premium === 1) {
                            // router.push(`/(profil)/ProfilDetail?userId=${data.id}`);
                            router.push(`/(profil)/ProfilDetail?userId=${data.id}`);
                        } else {
                            closeAlert(); // Exécute directement la fonction closeAlert
                        }
                    }} >

                        <View style={styles.containerCard} >
                            <View style={styles.cardImage}>
                                <Image
                                    source={{ uri: data.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                    style={styles.imageCard}
                                    resizeMode="cover"
                                />
                            </View>

                            <ThemedText type='midleText' style={{ color: COLORS.bg1 }}>{data.name}</ThemedText>
                            <ThemedText type='defaultSemiBold' style={{ color: '#58595be8' }}>{data.city}</ThemedText>
                        </View>
                    </TouchableOpacity>


                ))) : (
                    <View style={styles.conatinerNodata}>
                        <ThemedText type='midleText' style={{ color: COLORS.bg1, textAlign: 'center' }}>{t.noCorrespondance}</ThemedText>
                    </View>
                ))
                }


                {activeView === 'visited' &&
                    (preniumUser != '1' ? ((dataVisitors?.visitors.length != 0 ? (dataVisitors?.visitors.map((data, index) => (

                        <TouchableOpacity key={index} onPress={() => {
                            if (profil?.premium === 1) {
                                router.push(`/(profil)/ProfilDetail?userId=${data.id}`);
                            } else {
                                closeAlert(); // Exécute directement la fonction closeAlert
                            }
                        }}>
                            <View style={styles.containerCard} >
                                <View style={styles.cardImage}>
                                    <Image
                                        source={{ uri: data.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                        style={styles.imageCard}
                                        resizeMode="cover"
                                    />
                                </View>

                                <ThemedText type='midleText' style={{ color: COLORS.bg1 }}>{data.name}</ThemedText>
                                <ThemedText type='defaultSemiBold' style={{ color: '#58595be8' }}>{data.city}</ThemedText>
                            </View>

                        </TouchableOpacity>


                    ))) : (
                        <View style={styles.conatinerNodata}>
                            <ThemedText type='midleText' style={{ color: COLORS.bg1, textAlign: 'center' }}>{t.noCorrespondance}</ThemedText>
                        </View>
                    ))) : (
                        <View style={styles.conatinerModal} >
                            <Image
                                source={{ uri: profil?.profile_photo }}
                                style={styles.imageGift}
                                resizeMode="contain"
                            />
                            <ThemedText style={{ textAlign: 'center', color: COLORS.bg1, marginVertical: 10 }}>{t.textpremium}</ThemedText>


                            <TouchableOpacity
                                style={[styles.btn, styles.colorBtn1]}
                                onPress={() => { router.push('/(profil)/MostPopular') }}
                            >
                                <ThemedText type='subtitle' style={{ color: COLORS.bg1, textAlign: 'center' }}>{t.becomePremium}</ThemedText>
                            </TouchableOpacity>



                        </View>
                    ))
                }

                {activeView === 'likes' && (preniumUser != '0' ? ((dataFans?.myfans.length != 0 ? (dataFans?.myfans.map((data, index) => (

                    <TouchableOpacity key={index}
                        onPress={() => {
                            if (profil?.premium === 1) {
                                router.push(`/(profil)/ProfilDetail?userId=${data.id}`);
                            } else {
                                closeAlert(); // Exécute directement la fonction closeAlert
                            }
                        }}
                    >
                        <View style={styles.containerCard} >
                            <View style={styles.cardImage}>
                                <Image
                                    source={{ uri: data.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                    style={styles.imageCard}
                                    resizeMode="cover"
                                />
                            </View>

                            <ThemedText type='midleText' style={{ color: COLORS.bg1 }}>{data.name}</ThemedText>
                            <ThemedText type='defaultSemiBold' style={{ color: '#58595be8' }}>{data.city}</ThemedText>
                        </View>
                    </TouchableOpacity>


                ))) : (
                    <View style={styles.conatinerNodata}>
                        <ThemedText type='midleText' style={{ color: COLORS.bg1, textAlign: 'center' }}>{t.noCorrespondance}</ThemedText>
                    </View>
                ))) : (
                    <View style={styles.conatinerModal} >
                        <Image
                            source={{ uri: profil?.profile_photo }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />
                        <ThemedText style={{ textAlign: 'center' }}>{t.textpremium}</ThemedText>


                        <TouchableOpacity
                            style={[styles.btn, styles.colorBtn1]}
                            onPress={() => { router.push('/(profil)/MostPopular') }}
                        >
                            <ThemedText type='subtitle' style={{ color: 'white', textAlign: 'center' }}>{t.becomePremium}</ThemedText>
                        </TouchableOpacity>



                    </View>
                ))
                }


                {activeView === 'likesMe' && (dataLike?.mylikes.length != 0 ? (dataLike?.mylikes.map((data, index) => (

                    <TouchableOpacity key={index}
                        onPress={() => {
                            if (profil?.premium === 1) {
                                router.push(`/(profil)/ProfilDetail?userId=${data.id}`);
                            } else {
                                closeAlert(); // Exécute directement la fonction closeAlert
                            }
                        }}
                    >
                        <View style={styles.containerCard} >
                            <View style={styles.cardImage}>
                                <Image
                                    source={{ uri: data.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                    style={styles.imageCard}
                                    resizeMode="cover"
                                />
                            </View>

                            <ThemedText type='midleText' style={{ color: COLORS.bg1 }}>{data.name}</ThemedText>
                            <ThemedText type='defaultSemiBold' style={{ color: '#58595be8' }}>{data.city}</ThemedText>
                        </View>
                    </TouchableOpacity>
                ))) : (<View style={styles.conatinerNodata}>
                    <ThemedText type='midleText' style={{ color: COLORS.bg1, textAlign: 'center' }}>{t.noCorrespondance}</ThemedText>
                </View>))
                }

                <Modal
                    isVisible={isAlert}
                    onBackdropPress={closeAlert}
                    style={styles.modal}
                >
                    <View style={styles.modalOverlay}>

                        <View style={styles.conatinerModal} >
                            <Image
                                source={{ uri: profil?.profile_photo }}
                                style={styles.imageGift}
                                resizeMode="contain"
                            />
                            <ThemedText style={{ textAlign: 'center', color: COLORS.bg1, marginVertical: 10 }}>{t.textpremium}</ThemedText>


                            <TouchableOpacity
                                style={[styles.btn, styles.colorBtn1]}
                                onPress={() => { router.push('/(profil)/MostPopular') }}
                            >
                                <ThemedText type='subtitle' style={{ color: COLORS.bg1, textAlign: 'center' }}>{t.becomePremium}</ThemedText>
                            </TouchableOpacity>



                        </View>
                    </View>

                </Modal>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
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
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    conatinerModal: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: screenHeight * 0.7,
    },
    conatinerNodata: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: screenHeight * 0.7,
        textAlign: 'center'
    },
    btn: {

        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '70%',
        alignSelf: 'center',
        margin: 20,
        alignItems: 'center',
        padding: 10,
        textAlign: 'center',
        justifyContent: 'center'

    },
    colorBtn: {
        backgroundColor: '#C60696',
    },
    colorBtn1: {
        backgroundColor: '#F7EC31',
    },
    imageGift: {

        width: 180,
        height: 180,
        margin: 3,
        marginTop: 10,
        borderRadius: 90,


    },
    containerCard: {
        width: '85%',
        height: screenHeight * 0.5,
        alignSelf: 'center',
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20
    },
    cardImage: {
        width: '100%',
        height: '80%',
        alignSelf: 'center',
        backgroundColor: 'white',

        borderRadius: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.05,
        // shadowRadius: 2,
        // elevation: 1,
        marginBottom: 10

    },
    imageCard: {
        width: '100%',
        height: '100%',
        borderRadius: 10,

    },
    cardOption: {
        width: '95%',
        // height: 100,
        marginBottom: 10,
        padding: 5,
        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#080f37e8',
        borderRadius: 10
    },
    textWhite: {
        color: 'white',
    },
    cardSelect: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: COLORS.bg3,
        // height: 100,
    },
    number: {
        margin: 10,
        width: 50,
        height: 50,
        borderRadius: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3413db',


    },
    btnChoix: {
        width: '10%',
        // backgroundColor: COLORS.jaune,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 20,
        right: '5%'
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: 25
    },
    backButton: {
        padding: 10,
    },

});

export default Interaction;
