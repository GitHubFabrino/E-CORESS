// import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableOpacity, View, ScrollView, FlatList, Text } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { logoutUser, userProfil } from '@/request/ApiRest';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/userSlice';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AboutSection from '@/components/input/AboutSection';
import InputSelector from '@/components/input/InputSelector';
import { UserProfileInterface } from './interfaceProfile';
import InputSelectorA from '@/components/input/InputSelectorA';
import { translations } from '@/service/translate';

export default function ProfilScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);

    const t = translations[lang];

    const [isModalOption, setIsModalOption] = useState(false);
    const [isModalParam, setIsModalParam] = useState(false);
    const [isModalGallery, setIsModalGallery] = useState(true);
    const [isModalDeconnexion, setIsModalDec] = useState(false);
    const [isProfil, setisProfil] = useState(true);

    const [apropos, setapropos] = useState<string>('');
    const [modifApropos, setmodifApropos] = useState(true);

    const [placevalue, setplaceValue] = useState<string>('');
    const [modifiPlace, setmodifPlace] = useState(true);

    const [username, setusername] = useState<string>('');
    const [modifusername, setmodifusername] = useState(true);

    const [name, setplacename] = useState<string>('');
    const [modifiname, setmodifname] = useState(true);

    const [email, setemail] = useState<string>('');
    const [modifiemail, setmodifemail] = useState(true);

    const [birthday, setbirthday] = useState<string>('');
    const [modifbirthday, setmodifbirthday] = useState(true);

    const [genre, setgenre] = useState<string>('');
    const [modifigenre, setmodifgenre] = useState(true);

    const [profil, setProfil] = useState<UserProfileInterface | null>(null);
    const [option, setoption] = useState(['']);


    //  const [placevalue, setplaceValue] = useState<string>('');
    const [modifInfo, setmodifInfo] = useState(true);

    const [selectedOption, setSelectedOption] = useState<string>('Option 1');
    const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];


    useFocusEffect(
        useCallback(() => {
            // Réinitialiser l'état des modals
            setIsModalOption(false);
            setIsModalParam(false);
            setIsModalGallery(false);
        }, [])
    );

    useEffect(() => {
        if (auth?.idUser) {
            getProfils();
        }
    }, [auth.newM]);

    const getProfils = async () => {
        try {
            const response = await userProfil(auth.idUser);
            console.log("RESPONSE QUESTION: ", response);
            setProfil(response.user)

            console.log('SETPROFILE : ', profil?.ip);

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };


    const handledeConnect = async () => {
        setIsModalDec(!isModalDeconnexion)
    };

    const confirmLogOut = async () => {
        await logoutUser('0')
        dispatch(logout())
        router.replace('/(Auth)/singin')
    }

    const handledeEllips = () => {
        setIsModalOption(!isModalOption)
    };
    const handelGallery = () => {
        setIsModalParam(false)
        setIsModalGallery(false)
    };

    const handelProfil = () => {
        setisProfil(!isProfil)
    };

    const handelParam = () => {
        setIsModalGallery(true)
        setIsModalParam(true)
    };

    const handelInteraction = () => {
        router.navigate('/(profil)/Interaction')
    }
    const handelMostPopular = () => {
        router.navigate('/(profil)/MostPopular')
    }
    const handelCredit = () => {
        router.navigate('/(profil)/Credit')
    }


    const closeModal = () => {
        setIsModalOption(false);
        setIsModalDec(false)
    };

    useEffect(() => {
        if (lang === 'EN') {
            setoption(['Male', 'Female', 'Other']);
        } else {
            setoption(['Masculin', 'Feminin', 'Autre']);
        }
    }, [lang]);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">{t.profile}</ThemedText>
                <ThemedView style={styles.containerIcon}>

                    <TouchableOpacity onPress={handelGallery} style={styles.filterButton}>
                        <Icon name="images-outline" size={25} color={COLORS.darkBlue} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handelParam} style={styles.filterButton}>
                        <Icon name="settings-outline" size={25} color={COLORS.darkBlue} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handledeEllips} style={styles.filterButton}>
                        <Icon name="ellipsis-vertical-outline" size={25} color={COLORS.darkBlue} />
                    </TouchableOpacity>
                </ThemedView>

            </ThemedView>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ThemedView>
                    <View style={styles.cardProfilItem}>
                        <Image source={{ uri: profil?.profile_photo }} style={styles.cardProfil} />

                        <View>
                            <ThemedText type="subtitle" style={styles.cardProfilName}>{profil?.name}</ThemedText>
                            <ThemedText type="defaultSemiBold" style={styles.cardProfilName}>{profil?.age} {t.years}</ThemedText>
                        </View>
                    </View>
                </ThemedView>
                {
                    !isModalGallery && (<View  >
                        <TouchableOpacity onPress={() => { }} style={styles.addimage}>
                            <Icon name="camera-outline" size={30} color={COLORS.bg1} />
                        </TouchableOpacity>
                        <View style={styles.cardGallery}>
                            <FlatList
                                horizontal
                                data={profil?.galleria}
                                keyExtractor={(item) => item.photoId.toString()}  // Conversion de l'id en chaîne
                                renderItem={({ item }) => (
                                    <ThemedView style={styles.containerImage}>
                                        <TouchableOpacity onPress={() => { }}>
                                            <Image source={{ uri: item.image }} style={styles.cardGalleryImage} />
                                        </TouchableOpacity>
                                    </ThemedView>
                                )}
                                contentContainerStyle={styles.personList}
                            />

                        </View>

                    </View>)
                }

                {
                    isModalParam && (
                        <ThemedView>
                            <ThemedView style={styles.containerInfo1}>
                                <AboutSection
                                    titre={t.username}
                                    aproposValue={profil?.username || ''}
                                    setAproposValue={setusername}
                                    modifApropos={modifusername}
                                    setModifApropos={setmodifusername}
                                />

                                <AboutSection
                                    titre={t.email}
                                    aproposValue={profil?.email || ''}
                                    setAproposValue={setemail}
                                    modifApropos={modifiemail}
                                    setModifApropos={setmodifemail}
                                />

                                <AboutSection
                                    titre={t.Name}
                                    aproposValue={profil?.name || ''}
                                    setAproposValue={setusername}
                                    modifApropos={modifiname}
                                    setModifApropos={setmodifname}
                                />

                                <AboutSection
                                    titre={t.birthday}
                                    aproposValue={profil?.birthday || ''}
                                    setAproposValue={setbirthday}
                                    modifApropos={modifbirthday}
                                    setModifApropos={setmodifbirthday}
                                />
                                <AboutSection
                                    titre={t.genderLabel}
                                    aproposValue={profil?.gender || ''}
                                    setAproposValue={setgenre}
                                    modifApropos={modifigenre}
                                    setModifApropos={setmodifgenre}
                                    isSelector={true}
                                    options={option}
                                />
                            </ThemedView>
                        </ThemedView>
                    )
                }


                <ThemedView style={styles.containerOption}>
                    <TouchableOpacity onPress={() => { }} >
                        <View style={styles.cardItem}>
                            <View style={styles.icon}>
                                <Image source={require('@/assets/images/icon1.png')} style={styles.iconItem} />
                            </View>
                            <View style={styles.textItem}>
                                <ThemedText type='defaultSemiBold'>Popularité</ThemedText>
                                <ThemedText type='defaultSemiBold' style={styles.text}>Increase</ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} >
                        <View style={styles.cardItem}>
                            <View style={styles.icon}>
                                <Image source={require('@/assets/images/icon2.png')} style={styles.iconItem} />
                            </View>
                            <View style={styles.textItem}>
                                <ThemedText type='defaultSemiBold'>{profil?.credits} crédits</ThemedText>
                                <ThemedText type='defaultSemiBold' style={styles.text}>Acheter Crédits</ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} >
                        <View style={styles.cardItem}>
                            <View style={styles.icon}>
                                <Image source={require('@/assets/images/icon3.png')} style={styles.iconItem} />
                            </View>
                            <View style={styles.textItem}>
                                <ThemedText type='defaultSemiBold'>Popularité</ThemedText>
                                <ThemedText type='defaultSemiBold' style={styles.text}>Increase</ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>


                </ThemedView>

                <AboutSection
                    titre={t.about}
                    aproposValue={profil?.bio || ''}
                    setAproposValue={setapropos}
                    modifApropos={modifApropos}
                    setModifApropos={setmodifApropos}
                />

                <AboutSection
                    titre={t.ubication}
                    aproposValue={profil?.city || ''}
                    setAproposValue={setplaceValue}
                    modifApropos={modifiPlace}
                    setModifApropos={setmodifPlace}
                />

                <ThemedView style={styles.containerInfo}>
                    <View style={styles.itemTitre}>
                        <ThemedText type='defaultSemiBold'>{t.infoPer}</ThemedText>
                        {modifInfo ? (
                            <TouchableOpacity onPress={() => setmodifInfo(!modifInfo)}>
                                <Icon name="create-outline" size={25} color={COLORS.darkBlue} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setmodifInfo(!modifInfo)}>
                                <Icon name="checkmark-done-outline" size={25} color={COLORS.green} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.infoCard}>
                        <ThemedView>
                            <ThemedText type='default'>{t.partenaire} :</ThemedText>
                            <View style={styles.item}>
                                <InputSelector
                                    style={styles.selec}
                                    options={options}
                                    selectedValue={selectedOption}
                                    onValueChange={(value) => setSelectedOption(value)}
                                />
                                <TouchableOpacity onPress={() => { }} style={styles.envoyeDemande}>
                                    <ThemedText style={styles.envText}>{t.request}</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ThemedView>

                        <ThemedView>
                            <ThemedText type='default'>{t.myPartener} :</ThemedText>
                            <View style={styles.item}>
                                <View style={styles.messageCard}>
                                    <Image source={require('@/assets/images/imageAcceuil/img1.jpeg')} style={styles.messageProfilePic} />
                                    <View style={styles.messageContent}>
                                        <Text style={styles.messageName}>Nom</Text>
                                        <Text style={styles.messageText}>Prenom</Text>
                                    </View>

                                    <View>
                                        <TouchableOpacity onPress={() => { }}>
                                            <Icon name="trash-outline" size={25} color={COLORS.red} />
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </View>
                        </ThemedView>
                        {profil?.question.map((item) => (
                            <View key={item.id}>
                                {modifInfo ? (
                                    <ThemedView style={styles.containerText}>
                                        <ThemedText>{item.question}</ThemedText>
                                        <ThemedText>{item.userAnswer || 'Pas de réponse'}</ThemedText>
                                    </ThemedView>
                                ) : (
                                    <InputSelectorA
                                        titre={item.question}
                                        options={item.answers.map(answer => ({
                                            value: answer.answer,
                                            label: answer.text
                                        }))}
                                        selectedValue={selectedOption}
                                        onValueChange={(value) => {
                                            setSelectedOption(value);
                                            item.userAnswer = value;
                                        }}
                                    />
                                )}
                            </View>
                        ))}

                    </View>

                </ThemedView>

                <AboutSection
                    titre={t.interest}
                    aproposValue={profil?.bio || ''}
                    setAproposValue={setapropos}
                    modifApropos={modifApropos}
                    setModifApropos={setmodifApropos}
                />

                <AboutSection
                    titre='Languages'
                    aproposValue={profil?.language || ''}
                    setAproposValue={setapropos}
                    modifApropos={modifApropos}
                    setModifApropos={setmodifApropos}
                    isSelector={true}
                    options={['Englais', 'Francais']}
                />




                <Modal
                    isVisible={isModalOption}
                    onBackdropPress={closeModal}
                    style={styles.modalRight}
                    animationIn="slideInRight"
                    animationOut="slideOutRight"
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handelCredit} style={styles.filterButton}>
                            <Icon name="card-outline" size={25} color={COLORS.darkBlue} />
                            <ThemedText type='defaultSemiBold' style={styles.option}>Credits</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handelMostPopular} style={styles.filterButton}>
                            <Icon name="rocket-outline" size={25} color={COLORS.darkBlue} />

                            <ThemedText type='defaultSemiBold' style={styles.option}>Très Populaire</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handelInteraction} style={styles.filterButton}>
                            <Icon name="card-outline" size={25} color={COLORS.darkBlue} />
                            <ThemedText type='defaultSemiBold' style={styles.option}>Interactions</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handledeConnect} style={styles.filterButton}>
                            <Icon name="log-out-outline" size={25} color={COLORS.darkBlue} />
                            <ThemedText type='defaultSemiBold' style={styles.option}>Déconnexion</ThemedText>
                        </TouchableOpacity>

                    </View>
                </Modal>


                <Modal
                    isVisible={isModalDeconnexion}
                    onBackdropPress={closeModal}
                    style={styles.modal}
                >
                    <View style={styles.modalContentDeconex}>
                        <ThemedText>Voulez-vous vraiment se déconnécter ?</ThemedText>
                        <View style={styles.btn}>
                            <ThemedButton text={'Annuler'} style={styles.annuler} styleText={styles.textAnnuller} onClick={() => setIsModalDec(!isModalDeconnexion)} />
                            <ThemedButton text={'Confirmer'} onClick={confirmLogOut} />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 50,
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    containerIcon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '30%',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        backgroundColor: COLORS.jaune,
    },
    filterButton: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    containerOption: {
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    tabContentContainer: {
        backgroundColor: COLORS.white,
        height: '100%'
    },
    cardItem: {
        width: 130,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.lightGray,
    },
    cardProfilItem: {
        marginHorizontal: 20,
        paddingVertical: 10,
        borderBottomColor: COLORS.bg1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    cardProfil: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginRight: 10,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
    },
    cardProfilName: {

    },
    containerImage: {
        width: 200,
        height: 200,
        marginHorizontal: 5,
        borderRadius: 10
    },
    cardGallery: {
        backgroundColor: COLORS.bg2
    },
    addimage: {
        margin: 2,
        backgroundColor: COLORS.jaune,
        alignSelf: 'flex-end',
        marginRight: 10,
        elevation: 2,
        shadowColor: '#000',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardGalleryImage: {
        height: '100%',
        width: '100%',
        borderRadius: 10
    },
    personList: {
        paddingVertical: 20,
        elevation: 0.2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        marginBottom: 5,
    },

    icon: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    iconItem: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textItem: {
        width: '100%',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    containerInfo: {
        width: '100%',
        marginBottom: 10
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
        padding: 10
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // marginBottom: 5,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 5,
    },
    selec: {
        width: 150
    },
    envoyeDemande: {
        // height: 50,
        padding: 5,
        backgroundColor: COLORS.bg1,
        paddingHorizontal: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    envText: {
        // backgroundColor: COLORS.bg2,
        color: COLORS.white,
    },
    containerInfo1: {
        padding: 10,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        marginBottom: 20
    },
    infoItem: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayOne,
        paddingBottom: 5
    },

    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    messageProfilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
    },

    messageContent: {
        flex: 1,
    },
    messageName: {
        fontSize: 16,
        color: COLORS.bg1,
        fontWeight: 'bold',
    },
    messageText: {
        fontSize: 14,
        color: COLORS.bg1,
    },
    containerText: {
        marginHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },

    annuler: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.bg1

    },
    textAnnuller: {
        color: COLORS.bg1
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalRight: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginTop: 50
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '55%',

    },
    modalContentDeconex: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',

    },
    btn: {
        marginTop: 20,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    option: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.jaune,
        marginLeft: 5
    }

});
