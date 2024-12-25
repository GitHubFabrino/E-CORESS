import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ActivityIndicator, Text, FlatList, ScrollView } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addToSpotlight, discover100, raiseUpF, userProfil } from '@/request/ApiRest';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { translations } from '@/service/translate';
import { ThemedView } from '@/components/ThemedView';
import { color } from 'react-native-elements/dist/helpers';
import { UserProfileInterface } from './interfaceProfile';
import { setLanguage } from '@/store/userSlice';
import Modal from 'react-native-modal/dist/modal';

import { useFocusEffect } from '@react-navigation/native';


const Credit: React.FC = () => {
    const router = useRouter();
    const [soldeUser, setsoldeUser] = useState<number>(0);
    const auth = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [loading, setLoading] = useState(true);
    const [profil, setProfil] = useState<UserProfileInterface | null>(null);
    const [raiseUp, setraiseUp] = useState(false);
    const [increaseUp, setincreaseUp] = useState(false);
    const [HighlightsUp, setHighlightsUp] = useState(false);
    const [okDiscover100, setOkDiscover100] = useState(false);
    const [okRaise, setOkRaise] = useState(false);
    const [okHight, setOkHight] = useState(false);
    const [discover, setdiscover] = useState('');
    const [meet, setmeet] = useState('');
    const [soldeInsuffisant, setSoldeInsuffisant] = useState(false);

    const dataImage = [
        { id: 1, Image: require('../../../assets/images/tarif/img1.png') },
        { id: 2, Image: require('../../../assets/images/tarif/img2.png') },
        { id: 3, Image: require('../../../assets/images/tarif/img3.png') },
        { id: 4, Image: require('../../../assets/images/tarif/img4.png') },
        { id: 5, Image: require('../../../assets/images/tarif/img5.png') },
        { id: 6, Image: require('../../../assets/images/tarif/img6.png') },
        { id: 7, Image: require('../../../assets/images/tarif/img7.png') },
    ];



    const closeTarif = () => {
        setSoldeInsuffisant(false);
    };
    const closeRaiseUp = () => {
        setraiseUp(!raiseUp)
    }

    const closeIncreaseUp = () => {
        setincreaseUp(!increaseUp)
    }
    const closeHighlightsUp = () => {
        setHighlightsUp(!HighlightsUp)
    }


    useEffect(() => {
        getSolde();
        getProfils()
    }, []);
    useFocusEffect(
        useCallback(() => {
            // Réinitialiser l'état des modals
            getProfils()
            getSolde();
        }, [okDiscover100, okRaise])
    );

    const getSolde = async () => {
        const resultData = await userProfil(auth.idUser);
        setsoldeUser(resultData.user.credits)
        setLoading(false)

    };
    const getProfils = async () => {
        try {
            const response = await userProfil(auth.idUser);
            console.log('Response profile est :', response);

            const userProfile = response.user;
            setProfil(userProfile);

            if (userProfile) {
                console.log('AMINY PROFILE');

                const { discover, meet } = userProfile;

                setdiscover(discover);
                setmeet(meet);

                console.log('discover:', discover);
                console.log('meet:', meet);

                setOkDiscover100(discover === '100');
                setOkRaise(meet === '1');
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };


    const sendDiscover100 = async () => {
        try {

            const response = await discover100(auth.idUser);
            if (response === 200) {
                setOkDiscover100(true)
                closeIncreaseUp()
                getSolde()
                getProfils()
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const addToSpotlightFunc = async () => {
        try {

            const response = await addToSpotlight(auth.idUser);
            if (response === 200) {
                setOkHight(true)
                closeHighlightsUp()
                getSolde()
                getProfils()
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };


    const raiseUpFunc = async () => {
        try {

            const response = await raiseUpF(auth.idUser);
            if (response === 200) {
                // setOkRaise(true)
                closeRaiseUp()
                getSolde()
                getProfils()
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.jaune} />
            </View>

        );
    }
    {/* { isLoading && <LoadingSpinner isVisible={isLoading} text={t.loading} size={60} /> } */ }


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(profil)/')}
            >
                <Ionicons name="arrow-back" size={24} color={COLORS.bg1} />
            </TouchableOpacity>

            <View style={styles.cardSold}>
                <Image
                    source={{ uri: 'https://www.e-coress.com/themes/default/images/icon-coins.png' }}
                    style={styles.or}
                    resizeMode="cover"
                />
                <View style={styles.textsold}>
                    <ThemedText type='title' style={{ color: 'white' }}>{soldeUser} {t.credit}</ThemedText>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.cardImage}>
                    <View style={styles.imageContaint}>
                        {profil?.photos && profil?.photos.length >= 1 && (<Image
                            source={{ uri: profil?.photos[0].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageCard}
                            resizeMode="cover"
                        />)}
                        {profil?.photos.length === 0 && (<Image
                            source={{ uri: 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageCard}
                            resizeMode="cover"
                        />)}
                    </View>
                    {okRaise === false ? (<TouchableOpacity
                        style={[styles.btn, styles.colorBtn]}
                        onPress={() => {
                            if (soldeUser < 150) {
                                setSoldeInsuffisant(true)
                            } else {
                                setraiseUp(true)
                            }
                        }}
                    >
                        <ThemedText type='subtitle' style={{ color: 'white' }}>{t.raise}</ThemedText>
                    </TouchableOpacity>) : (<View style={[styles.btn, styles.colorBtn]}>

                        <Ionicons name="checkmark-outline" size={30} color={COLORS.white} />
                    </View>
                    )}
                    <ThemedText style={{ textAlign: 'center', margin: 10 }}>
                        {t.raiseText}
                    </ThemedText>

                </View>
                <View style={styles.cardImage}>
                    <View style={styles.imageContaint}>
                        {profil?.photos && profil.photos.length >= 2 && (
                            <Image
                                source={{ uri: profil.photos[1]?.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                style={styles.imageCard}
                                resizeMode="cover"
                            />
                        )}
                        {profil?.photos.length === 1 && (<Image
                            source={{ uri: profil?.photos[0].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageCard}
                            resizeMode="cover"
                        />)}
                        {profil?.photos.length === 0 && (<Image
                            source={{ uri: 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageCard}
                            resizeMode="cover"
                        />)}
                    </View>
                    {okDiscover100 === false ?
                        (<TouchableOpacity
                            style={[styles.btn, styles.colorBtn1]}
                            onPress={() => {
                                if (soldeUser < 200) {
                                    setSoldeInsuffisant(true)
                                } else {
                                    setincreaseUp(true)
                                }
                            }

                            }
                        >
                            <ThemedText type='subtitle' style={{ color: 'white', textAlign: 'center' }}>{t.increase}</ThemedText>
                        </TouchableOpacity>) : (
                            <View style={[styles.btn, styles.colorBtn1]}>

                                <Ionicons name="checkmark-outline" size={30} color={COLORS.white} />
                            </View>

                        )}
                    <ThemedText style={{ textAlign: 'center', margin: 10 }}>
                        {t.increaseText}
                    </ThemedText>

                </View>
                <View style={styles.cardImage}>
                    <View style={styles.imageContaint}>

                        {profil?.photos && profil.photos.length >= 3 && (
                            <Image
                                source={{ uri: profil.photos[2]?.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                style={styles.imageCard}
                                resizeMode="cover"
                            />
                        )}

                        {profil?.photos.length === 2 && (<Image
                            source={{ uri: profil?.photos[1].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageCard}
                            resizeMode="cover"
                        />)}
                        {profil?.photos.length === 1 && (<Image
                            source={{ uri: profil?.photos[0].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageCard}
                            resizeMode="cover"
                        />)}
                        {profil?.photos.length === 0 && (<Image
                            source={{ uri: 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageCard}
                            resizeMode="cover"
                        />)}




                    </View>
                    {okHight === false ? (<TouchableOpacity
                        style={[styles.btn, styles.colorBtn2]}
                        onPress={() => {
                            if (soldeUser < 182) {
                                setSoldeInsuffisant(true)
                            } else {
                                setHighlightsUp(true)
                            }
                        }

                        }
                    >
                        <ThemedText type='subtitle' style={{ color: 'white' }}>{t.Highlights}</ThemedText>
                    </TouchableOpacity>) : (<View style={[styles.btn, styles.colorBtn2]}>

                        <Ionicons name="checkmark-outline" size={30} color={COLORS.white} />
                    </View>)}
                    <ThemedText style={{ textAlign: 'center', margin: 10 }}>
                        {profil?.username} {t.HighlightsText} {profil?.city}
                    </ThemedText>

                </View>

                <Modal

                    isVisible={raiseUp}
                    onBackdropPress={closeRaiseUp}
                    style={styles.modal}
                >

                    <View style={styles.conatinerModal}>


                        {profil?.photos && profil?.photos.length >= 1 && (<Image
                            source={{ uri: profil?.photos[0].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        {profil?.photos.length === 0 && (<Image
                            source={{ uri: 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        <ThemedText type='subtitle' style={{ textAlign: 'center', marginBottom: 10 }}>{t.textModalRaise}</ThemedText>
                        <ThemedText style={{ textAlign: 'center' }}>{t.textModalRaise2}</ThemedText>


                        <TouchableOpacity
                            style={[styles.btn, styles.colorBtn]}
                            onPress={() => raiseUpFunc()}
                        >
                            <ThemedText type='subtitle' style={{ color: 'white', textAlign: 'center' }}>{t.raise}</ThemedText>
                        </TouchableOpacity>
                        <ThemedText>{t.textModalRaise3}</ThemedText>


                    </View>
                </Modal>

                <Modal

                    isVisible={increaseUp}
                    onBackdropPress={closeIncreaseUp}
                    style={styles.modal}
                >

                    <View style={styles.conatinerModal}>

                        {profil?.photos && profil.photos.length >= 3 && (
                            <Image
                                source={{ uri: profil.photos[1]?.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                style={styles.imageGift}
                                resizeMode="contain"
                            />
                        )}
                        {profil?.photos.length === 2 && (<Image
                            source={{ uri: profil?.photos[1].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        {profil?.photos.length === 1 && (<Image
                            source={{ uri: profil?.photos[0].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        {profil?.photos.length === 0 && (<Image
                            source={{ uri: 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        <ThemedText type='subtitle' style={{ textAlign: 'center', marginBottom: 10 }}>{t.textModalIncrease}</ThemedText>
                        <ThemedText style={{ textAlign: 'center' }}>{t.textModalIncrease2}</ThemedText>


                        <TouchableOpacity
                            style={[styles.btn, styles.colorBtn1]}
                            onPress={() => sendDiscover100()}
                        >
                            <ThemedText type='subtitle' style={{ color: 'white', textAlign: 'center' }}>{t.textModalIncrease}</ThemedText>
                        </TouchableOpacity>
                        <ThemedText>{t.textModalIncrease3}</ThemedText>


                    </View>
                </Modal>

                <Modal

                    isVisible={HighlightsUp}
                    onBackdropPress={closeHighlightsUp}
                    style={styles.modal}
                >

                    <View style={styles.conatinerModal}>

                        {profil?.photos && profil.photos.length >= 3 && (
                            <Image
                                source={{ uri: profil.photos[2]?.photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                                style={styles.imageGift}
                                resizeMode="contain"
                            />
                        )}
                        {profil?.photos.length === 3 && (<Image
                            source={{ uri: profil?.photos[2].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        {profil?.photos.length === 2 && (<Image
                            source={{ uri: profil?.photos[1].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        {profil?.photos.length === 1 && (<Image
                            source={{ uri: profil?.photos[0].photo || 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}
                        {profil?.photos.length === 0 && (<Image
                            source={{ uri: 'https://www.e-coress.com/assets/sources/uploads/thumb_67670b5907c57_phond.jpg' }}
                            style={styles.imageGift}
                            resizeMode="contain"
                        />)}

                        <ThemedText type='subtitle' style={{ textAlign: 'center', marginBottom: 10 }}>{t.textModalHightlight}</ThemedText>
                        <ThemedText style={{ textAlign: 'center' }}>{t.textModalHightlight2}</ThemedText>


                        <TouchableOpacity
                            style={[styles.btn, styles.colorBtn2]}
                            onPress={() => addToSpotlightFunc()}
                        >
                            <ThemedText type='subtitle' style={{ color: 'white' }}>{t.Highlights}</ThemedText>
                        </TouchableOpacity>
                        <ThemedText>{t.textModalHightlight3}</ThemedText>


                    </View>
                </Modal>

                {/* Insuffisance */}
                <Modal
                    isVisible={soldeInsuffisant}
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


            </ScrollView >




        </View>
    );
};

const styles = StyleSheet.create({
    conatinerModal: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',


    },
    imageGift: {

        width: 180,
        height: 180,
        margin: 3,
        marginTop: 10,
        borderRadius: 90,


    },
    cardImage: {
        backgroundColor: 'white',
        width: '80%',
        height: 500,
        alignSelf: 'center',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,

    },
    imageContaint: {
        width: '100%',
        height: 300,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: 25
    },
    backButton: {
        padding: 10,
    },
    or: {
        width: 50,
        height: 50
    },
    imageCard: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
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
    notNow: {
        color: 'black',
        fontSize: 18,
    },
    containeImage: {

        // // height: 200,
        // backgroundColor: 'blue',
        // justifyContent: 'center', // Centre verticalement
        // alignItems: 'center',    // Centre horizontalement
    },
    stepImage1: {

        width: 360,
        height: 250,
        margin: 3

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
    colorBtn2: {
        backgroundColor: '#3413db',
    },
    cardSold: {
        backgroundColor: COLORS.bg1,
        margin: 10,
        borderRadius: 10,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    textsold: {
        padding: 10,
        color: 'white',

        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }


});

export default Credit;
