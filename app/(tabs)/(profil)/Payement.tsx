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

import { useFocusEffect, useRoute } from '@react-navigation/native';


const { height: screenHeight } = Dimensions.get('window');
export interface SelectOffre {
    duration: number,
    price: number,
    availability: number,
}

const Payement: React.FC = () => {
    const router = useRouter();
    const route = useRoute();
    const { userId, photo, offre, availability, duration, price, packages } = route.params as { userId: string; photo: string; offre: string; availability: string; duration: string; price: string; packages: string };

    console.log(photo);

    const [soldeUser, setsoldeUser] = useState<number>(0);
    const auth = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [loading, setLoading] = useState(true);
    const [profil, setProfil] = useState<UserProfileInterface | null>(null);


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(profil)/MostPopular')}
            >
                <Ionicons name="arrow-back" size={24} color={COLORS.bg1} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Image
                    source={{ uri: photo }}
                    style={styles.imageGift}
                    resizeMode="contain"
                />
                <ThemedText type='midleText' style={{ color: COLORS.bg1, margin: 10, alignSelf: 'center' }}>{duration} {t.day} {offre}</ThemedText>
                <ThemedText type='defaultSemiBold2' style={{ color: COLORS.bg1, margin: 10, alignSelf: 'center' }}>{t.textpay}</ThemedText>
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <View style={styles.cardType}>
                        <ThemedText type='defaultSemiBold2'>Orange Money</ThemedText>
                        <Image
                            source={require('../../../assets/images/orange.png')}
                            style={styles.orange}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>

                <ThemedText type='default' style={{ color: 'green', marginTop: 20, alignSelf: 'center' }}>{t.securtyText}</ThemedText>
                <ThemedText type='defaultSemiBold2' style={{ color: COLORS.bg1, marginTop: 30, alignSelf: 'center', textAlign: 'center', width: '80%' }}>{t.selectPayText} {offre} {t.selectPayText1} {availability} {t.selectPayText2}</ThemedText>
                <TouchableOpacity

                    onPress={() => { router.push(`/(profil)/PaymentScreen?userId=${userId}&packages=${packages}&type=${offre}&monthsCommitment=${availability}&price=${price}`) }}
                >
                    <View style={styles.btnOffre}>
                        <ThemedText type='default' style={{ color: 'white', alignSelf: 'center' }}>{t.saveOffre}</ThemedText>
                    </View>
                </TouchableOpacity>


                <ThemedText type='default' style={{ color: COLORS.bg1, marginTop: 20, alignSelf: 'center', width: '80%', textAlign: 'center' }}>{t.textp}</ThemedText>

            </ScrollView>


        </View>

    );
};

const styles = StyleSheet.create({
    btnOffre: {
        marginTop: 20,
        width: '80%',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#44bd34e8'

    },
    cardType: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        // padding: 10,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
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

        width: 120,
        height: 120,
        margin: 3,
        marginTop: 10,
        borderRadius: 90,
        alignSelf: 'center',
        alignItems: 'center',


    },
    orange: {
        width: 120,
        height: 120,
        margin: 3,
        alignSelf: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
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

export default Payement;
