import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ActivityIndicator, Text, FlatList, ScrollView, Dimensions } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { addToSpotlight, discover100, getConfigAbonnement, getMatches, getVisitors, raiseUpF, userProfil } from '@/request/ApiRest';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { translations } from '@/service/translate';
import { ThemedView } from '@/components/ThemedView';
import { color } from 'react-native-elements/dist/helpers';
import { UserProfileInterface } from './interfaceProfile';
import { setLanguage } from '@/store/userSlice';
import Modal from 'react-native-modal/dist/modal';

import { useFocusEffect } from '@react-navigation/native';
import { DATAOFFER } from '@/service/dataService';

export interface Plan {
    package: string;
    duration: string;
    price: string;
    availability: string;
}

export interface Subscription {
    name: string;
    plans: Plan[];
}

export interface SubscriptionData {
    subscriptions: Subscription[];
}



const MostPopular: React.FC = () => {
    const router = useRouter();
    const [soldeUser, setsoldeUser] = useState<number>(0);
    const auth = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [loading, setLoading] = useState(true);
    const [profil, setProfil] = useState<UserProfileInterface | null>(null);
    const [dataOffres, setDataOffres] = useState<Subscription[]>([]);
    // const dataOffres = DATAOFFER


    useEffect(() => {

        getProfils()
        getDataOffre()
    }, []);
    useFocusEffect(
        useCallback(() => {

            getProfils()
            getDataOffre()
        }, [])
    );

    const getProfils = async () => {
        try {
            const response = await userProfil(auth.idUser);
            console.log('Response profile est :', response);

            const userProfile = response.user;
            setProfil(userProfile);

        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };

    const getDataOffre = async () => {
        setLoading(true)
        try {
            const response = await getConfigAbonnement();

            const data = response;
            setDataOffres(data);

        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false)
        }
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(profil)/')}
            >
                <Ionicons name="arrow-back" size={24} color={COLORS.bg1} />
            </TouchableOpacity>
            <Image
                source={{ uri: profil?.profile_photo }}
                style={styles.imageGift}
                resizeMode="contain"
            />



            {loading === true ? (<ActivityIndicator size="large" color={COLORS.jaune} />) : (

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    {dataOffres && dataOffres?.map((data, index) => (
                        <View style={styles.containerOffre} key={index}>
                            <ThemedText type='midleText' style={{ color: COLORS.bg1, }}>{t.offre} {data.name}</ThemedText>
                            <View>
                                {data.plans.map((pl, i) => (
                                    <TouchableOpacity key={i} onPress={() =>
                                        router.push(`/(tabs)/Payement?userId=${auth.idUser}&photo=${profil?.profile_photo}&offre=${data.name}&availability=${pl.availability}&duration=${pl.duration}&price=${pl.price}&packages=${pl.package}`)
                                    }>
                                        <View style={styles.offreCard}>
                                            <View style={styles.offreType}>
                                                <ThemedText type='subtitle' style={{ color: COLORS.bg1, }}>{pl.duration} {t.day}</ThemedText>
                                                <ThemedText type='midleText' style={{ color: COLORS.bg1, }}>{pl.price} EUR</ThemedText>
                                            </View>
                                            <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1, alignSelf: 'flex-end' }}>{pl.availability} / {t.durring}</ThemedText>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                            </View>
                        </View>
                    ))
                    }

                </ScrollView>)
            }

        </View>
    );
};

const styles = StyleSheet.create({
    containerOffre: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '90%',
        // backgroundColor: 'red',
        alignSelf: 'center',
        marginTop: 20
    },
    offreCard: {
        borderRadius: 10,
        backgroundColor: COLORS.jaune,
        padding: 10,
        paddingHorizontal: 20,
        margin: 10,

    },
    offreType: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%'
    },


    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: 25
    },
    backButton: {
        padding: 10,
    },
    imageGift: {

        width: 180,
        height: 180,
        margin: 3,
        marginTop: 10,
        borderRadius: 90,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLORS.bg6


    },
});

export default MostPopular;
