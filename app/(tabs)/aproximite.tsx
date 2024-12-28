import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, FlatList, View, Image, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/assets/style/style.color';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Input from '@/components/input/InputText';
import ThemedInput from '@/components/input/InputText';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { router, useFocusEffect } from 'expo-router';
import { translations } from '@/service/translate';
import { addVisit, cuser, fetchUserData, fetchUserDataWall, gameLike, getMessage, getUserCredits, meet, message, sendMessageCredit, updateAge, updateCredits, updateGender, updateSRadius, userProfil } from '@/request/ApiRest';
import LoadingSpinner from '@/components/spinner/LoadingSpinner';
import CardMeet from '@/components/card/CardMeet';
import ThemedButton from '@/components/button/Button';
import { login } from '@/store/userSlice';

interface Meet {
    check1: number;
    check2: number;
    apiLimit: string;
    result: UserData[];
    pages: number;
    popular: UserData[];
}

interface UserData {
    id: string;
    name: string;
    firstName: string;
    age: string;
    gender: string;
    city: string;
    photo: string;
    photoBig: string;
    error: number;
    show: number;
    status: number;
    allowed: boolean;
    blocked: number;
    margin: string;
    story: string;
    stories: string;
    fan: number;
    match: number;
    premium: string
    verified: string
}

interface Game {
    id: string;
    name: string;
    status: number;
    distance: string;
    age: string;
    city: string;
    bio: string;
    error: number;
    full: FullProfile;
    galleria: Photo[];
    gender: string;
    join_date: string;
    lat: string;
    lng: string;
    likes_percentage: number;
    online: string;
    premium: number;
    profile_photo: string;
    profile_photo_big: string;
    question: Question[];
    registerReward: string;
    totalFans: string;
    totalLikes: number;
    totalMatches: number;
    username: string;
    photo: string

}

interface FullProfile {
    admin: string;
    age: string;
    bio: string;
    bio_url: string;
    birthday: string;
    blockedProfiles: any[];
    city: string;
    country: string;
    country_code: string;
    credits: string;
    discover: string;
    email: string;
    email_verified: string;
    extended: ExtendedFields;
    facebook_id: string | null;
    google_id: string | null;
    ip: string;
    moderator: string | null;
    phone: string;
    premium_check: number;
    galleria: Photo[]; // Galerie déplacée ici
}

interface ExtendedFields {
    uid: string;
    field1: string | null;
    field2: string | null;
    field3: string | null;
    field4: string | null;
    field5: string | null;
    field6: string | null;
    field7: string | null;
    field8: string | null;
    field9: string | null;
    field10: string | null;
}

interface Photo {
    photoId: string;
    image: string;
    private: string;
}

interface Question {
    id: string;
    question: string;
    method: string;
    gender: string;
    q_order: string;
    userAnswer: string;
}

interface CardData {
    id: string;
    imageSources: any[];
    name: string;

    address: string;
    isOnline: boolean;
    photo: any,
    age: string,
    gender: string,
    error: string
    firstName: string
}

interface QuestionAnswer {
    id: string;
    question: string;
    method: string; // e.g., 'select' or 'text'
    gender: string; // Identifier le genre si nécessaire
    q_order: string; // Ordre des questions
    userAnswer: string; // Réponse de l'utilisateur
    answers: {
        id: string;
        answer: string; // Identifiant de la réponse
        text: string;   // Texte de la réponse
    }[];
}

interface ProfileInfo {
    blockedProfiles: any[];
    id: string;
    email: string;
    payout: number;
    pendingPayout: string;
    gender: string;
    app: string;
    superlike: string;
    guest: string;
    bio_url: string | null;
    moderator: string;
    subscribe: string;
    facebook_id: string;
    first_name: string;
    name: string;
    profile_photo: string;
    profile_photo_big: string;
    random_photo: string;
    unreadMessagesCount: string;
    story: string;
    stories: string[];
    total_photos: string;
    total_photos_public: string;
    total_photos_private: string;
    total_likers: string;
    total_nolikers: string;
    mylikes: string;
    totalLikes: number;
    likes_percentage: number;
    galleria: {
        image: string;
        photoId: string;
        private: string;
    }[];
    total_likes: string;
    extended: {
        uid: string;
        field1: string | null;
        field2: string | null;
        field3: string | null;
        field4: string | null;
        field5: string | null;
        field6: string | null;
        field7: string | null;
        field8: string | null;
        field9: string | null;
        field10: string | null;
    };
    interest: any[];
    status_info: number;
    status: string;
    city: string;
    email_verified: string;
    country: string;
    age: string;
    paypal: string | null;
    phone: string;
    sms_verification: string;
    sms_verified: string;
    country_code: string;
    lang_prefix: string;
    rnd_f: any[];
    lat: string;
    lng: string;
    birthday: string;
    registerReward: string;
    last_access: string;
    admin: string;
    username: string;
    lang: string;
    language: string;
    looking: string;
    premium: number;
    newFans: number;
    newVisits: number;
    totalVisits: number;
    totalMyLikes: number;
    totalFans: number;
    totalMatches: number;
    ip: string;
    premium_check: number;
    verified: string;
    popular: string;
    credits: string;
    link: string;
    online: string;
    fake: string;
    join_date: string;
    bio: string;
    meet: string;
    discover: string;
    s_gender: string;
    s_radius: string;
    s_age: string;
    twitter_id: string | null;
    google_id: string | null;
    instagram_id: string | null;
    online_day: string;
    question: QuestionAnswer[]; // Ajout des questions
}


const { width } = Dimensions.get('window');
const itemWidth = 150;
const getNumColumns = () => Math.floor(width / itemWidth);

export default function AproximiteScreen() {

    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const [dataMeet, setDataMeet] = useState<CardData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [gender, setGender] = useState('');
    const [maxAge, setMaxAge] = useState<number>(18);
    const [location, setLocation] = useState('');
    const [distance, setDistance] = useState<number>(1);

    const [meetData, setMeetData] = useState<Meet | null>(null);
    const [allUser, setallUser] = useState<boolean>(true);

    const t = translations[lang];


    const [valueCredits, setValueCredits] = useState<number | null>(null);
    const [creditSend, setcreditSend] = useState<number | null>(null);

    const [Solde, setsetSolde] = useState<number>(0);
    const [data, setData] = useState<CardData[]>([]);

    const getDataMeet = async () => {

        const result = await meet(auth.idUser, "0", "0");
        setMeetData(result)
        console.log("popular", result.popular);
    };


    useEffect(() => {
        setData(transformApiData(dataMeet));
    }, [dataMeet]);

    const getData = async () => {

        const resultData = await userProfil(auth.idUser);

        setMaxAge(Number(resultData.user.sage || 18)); // Assure que la valeur est numérique
        setGender(resultData.user.s_gender || '');
        setDistance(Number(resultData.user.s_radius || 1));
        setIsLoading(false);
    };

    const fetchData = useCallback(() => {
        getDataMeet();
        getData();
        getSolde();
        setLang(auth.lang);
    }, [auth.lang]); // Dépend uniquement de `auth.lang`

    // Appel initial des données
    useEffect(() => {
        console.log('USEEFFECT 1');

        fetchData();
    }, [fetchData]); // Utilisez `fetchData` dans les dépendances

    // Mise à jour des données lors du focus sur l'écran
    useFocusEffect(fetchData);
    const sendUpdate = async (field: string, value: string | number) => {
        try {
            let resultData;
            switch (field) {
                case 'age':
                    resultData = await updateAge(auth.idUser, value.toString());
                    break;
                case 'gender':
                    resultData = await updateGender(auth.idUser, value as string);
                    break;
                case 'distance':
                    resultData = await updateSRadius(auth.idUser, value.toString());
                    break;
                default:
                    return;
            }
            console.log(`Update successful for ${field}:`, resultData);

            // Teste
            dispatch(login(resultData));
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const getAllDatauser = async () => {
        setIsLoading(true)
        const resultData = await userProfil(auth.idUser);
        setIsLoading(false)
    };


    const transformApiData = (apiData: any[]): CardData[] => {
        return apiData.map((item) => ({
            id: item.id,
            photo: item.photo,
            imageSources: [item.photo],
            name: item.name,
            address: item.city || 'Location unknown',
            isOnline: item.status === 1,
            age: item.age,
            gender: item.gender,
            error: item.error,
            firstName: item.firstName
        }));
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    const [cuserData, setcuser] = useState<Game[] | null>(null);
    const [cuserDataUserFan, setcuserDataUserFan] = useState();
    const [isModalVisibleCuser, setIsModalVisibleCuser] = useState(false);
    const [nameReceveMessage, setnameReceveMessage] = useState("");

    const toggleModalMeet = (id: string, name: string) => {
        setnameReceveMessage(name)
        const getCuser = async () => {
            const addVisitUpdate = await addVisit(auth.idUser, id)
            const resultWall = await cuser(id, auth.idUser);
            setcuser(resultWall.game)
            setcuserDataUserFan(resultWall.user.isFan)
        };
        getCuser()
        if (cuserData) {
            setCurrentImageIndex(0);
            setIsModalVisibleCuser(!isModalVisibleCuser);
        }
    };



    const [isAlert, setisAlert] = useState(false);
    const closeAlert = () => {
        setisAlert(false);
    };

    const [isTransferCredit, setisTransferCredit] = useState(false);
    const closeTransfertCredit = () => {
        setisTransferCredit(false);
    };
    const closeModalCuser = () => {
        setIsModalVisibleCuser(false);
        setnameReceveMessage('')
    };
    const handleNextImage = () => {
        if (cuserData && cuserData[0]?.full?.galleria?.length) {
            const nextIndex = (currentImageIndex + 1) % cuserData[0]?.full.galleria.length
            setCurrentImageIndex(nextIndex);
        }
    };

    const handlePreviousImage = () => {
        if (cuserData && cuserData[0]?.full?.galleria?.length) {
            const prevIndex = (currentImageIndex - 1 + cuserData[0]?.full.galleria.length) % cuserData[0]?.full.galleria.length;
            setCurrentImageIndex(prevIndex);
        }
    };



    const handleSendCredit = (idReceve: string) => {
        setcreditSend(valueCredits)
        if (valueCredits && valueCredits > Solde) {

            router.navigate('/(profil)/MostPopular')
        } else {
            const messageSend = async () => {
                if (valueCredits) {


                    // Modif    
                    const query = `${auth.idUser}[rt]${idReceve}[rt]${auth.user.user.profile_photo}[rt]${auth.user.user.name}[rt]Credits[rt]credits[rt]${valueCredits}`

                    // const responseMessage = await message(auth.idUser, idReceve, auth.user.user.profile_photo, auth.user.user.name, valueCredits)
                    const responseMessage = await message(query)

                    if (responseMessage === 200) {

                        const responseSendMessage = await sendMessageCredit(auth.idUser, idReceve, valueCredits)
                        if (responseSendMessage === 200) {

                            const getMessageAll = await getMessage(auth.idUser, idReceve)
                            console.log('GETMESSAGE ALL', getMessageAll);
                            if (getMessageAll.blocked === 0) {

                                closeTransfertCredit()
                                setValueCredits(null)
                                setisAlert(true)
                                setTimeout(() => {
                                    closeAlert()
                                }, 2000);
                                setTimeout(() => {
                                    router.push(`/Chat?userId=${idReceve}&userName=${nameReceveMessage}&profilePic=${getMessageAll.chat[0].avatar}`)

                                }, 2000);

                            }
                            closeModalCuser()
                            closeTransfertCredit()


                        }
                    }
                }
            };
            messageSend()
        }



    };
    const handleCancelCredit = () => {
        setisTransferCredit(false)
    };

    const handleHeartLike = (uid1: string, uid2: string) => {
        if (Solde < 0) {
            router.navigate('/(profil)/MostPopular')
        } else {
            setcreditSend(1)

            const gameLikeFunc = async () => {
                const addVisitUpdate = await updateCredits(uid1, '1', '1', 'Credits for like')
                console.log("Addvisit : ", addVisitUpdate);
                const gameLikeResponse = await gameLike(uid1, uid2, '1')
                console.log('LIKE', gameLikeResponse);
                if (gameLikeResponse === 200) {
                    getDataMeet()
                    setTimeout(() => {
                        closeModalCuser()
                    }, 1000);
                    setisAlert(true)
                    getDataMeet()
                    setTimeout(() => {
                        closeAlert()
                    }, 700);
                }

            };
            gameLikeFunc()
        }


    };


    const handleTransfer = () => {

        setisTransferCredit(true)

    };

    const showAllUsers = () => {
        setallUser(true)
    };

    const showOnlineUsers = () => {
        setallUser(false)
    };
    const toggleFilterModal = () => {
        setIsFilterModalVisible(!isFilterModalVisible);
    };
    const toggleFilterModalSend = () => {
        setIsFilterModalVisible(!isFilterModalVisible);
        sendUpdate('age', maxAge);
        sendUpdate('gender', gender);
        sendUpdate('distance', distance);
        getDataMeet()
        getAllDatauser()
    };

    const getSolde = async () => {
        const resultData = await getUserCredits(auth.idUser);
        setsetSolde(resultData.credits)
        console.log('SOLDE', resultData.credits);

    };


    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={{ color: COLORS.bg1 }}>{t.aproximite}</ThemedText>
                <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
                    <Icon name="options" size={30} color={COLORS.bg1} />
                </TouchableOpacity>
            </ThemedView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={showAllUsers} style={styles.button}>
                    <ThemedText
                        type='defaultSemiBold'
                        style={[styles.text, allUser && styles.activeText]}
                    >
                        {t.allUsers}
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity onPress={showOnlineUsers} style={styles.button}>
                    <ThemedText type='defaultSemiBold' style={[styles.text, !allUser && styles.activeText]}>{t.popular}</ThemedText>
                </TouchableOpacity>
            </View>
            {isLoading && <LoadingSpinner isVisible={isLoading} text={t.loading} size={60} />}

            {meetData ? (
                <FlatList
                    data={allUser ? meetData.result : meetData.popular}
                    renderItem={({ item }: { item: UserData }) => (
                        <TouchableOpacity
                            onPress={() => toggleModalMeet(item.id, item.name)}
                            style={styles.cardItem}
                            activeOpacity={0.7}
                        >
                            <View>
                                <CardMeet
                                    imageSource={{ uri: item.photo }}
                                    name={item.name}
                                    address={item.city}
                                    age={item.age}
                                    fan={item.fan}
                                    premium={item.premium}
                                    verified={item.verified}

                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={getNumColumns()}
                    columnWrapperStyle={styles.columnWrapper}
                />
            ) : (
                <View style={styles.nodata}>
                    <Icon name="trash-outline" size={50} color={COLORS.bg1} />
                    <ThemedText style={styles.sug}>{t.noData}</ThemedText>
                    <ThemedText style={styles.sug}>{t.suggestion}</ThemedText>
                </View>
            )}

            {meetData && allUser && meetData.result.length <= 0 &&
                (
                    <View style={styles.nodata}>
                        <Icon name="trash-outline" size={50} color={COLORS.bg1} />
                        <ThemedText style={styles.sug}>{t.noData}</ThemedText>
                        <ThemedText style={styles.sug}>{t.suggestion}</ThemedText>
                    </View>
                )}

            {cuserData && (
                <Modal
                    isVisible={isModalVisibleCuser}
                    onBackdropPress={closeModalCuser}
                    style={styles.modal}
                >
                    <View style={styles.modalContent}>
                        {cuserData[0]?.full.galleria[currentImageIndex]?.image ? (<Image
                            source={{ uri: cuserData[0].full.galleria[currentImageIndex]?.image }}
                            style={styles.modalImage}
                            resizeMode="cover"
                        />) : (<Image
                            source={{ uri: cuserData[0].photo }}
                            style={styles.modalImage}
                            resizeMode="cover"
                        />)

                        }
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalHeader}>
                                <ThemedText type="title" style={styles.modalName}>
                                    {cuserData[0].name}

                                </ThemedText>
                                <ThemedText type="title" style={styles.modalAge}>

                                    {cuserData[0].age}
                                </ThemedText>
                            </View>

                            <View >
                                {isTransferCredit === false ? (<View style={styles.info}>
                                    <ThemedText type='midleText'>{t.aboutme}</ThemedText>
                                    <ThemedText type='defaultSemiBold2'>{cuserData[0].bio}</ThemedText>
                                    <ThemedText type='midleText'>{t.curentLocal}</ThemedText>
                                    <ThemedText type='defaultSemiBold2'>{cuserData[0].city}</ThemedText>
                                </View>) : (<View style={styles.infoTransfer}>
                                    <ThemedText type='midleText'>{t.transfert} {cuserData[0].name}</ThemedText>
                                    <ThemedInput
                                        label=""
                                        value={valueCredits !== null ? valueCredits.toString() : ""}
                                        placeholder={''}
                                        onChangeText={(text) => {
                                            const parsedValue = parseFloat(text);
                                            setValueCredits(isNaN(parsedValue) ? null : parsedValue);
                                        }}
                                        style={{ backgroundColor: COLORS.white }}
                                        styleforme={{ padding: 10 }}
                                    />
                                    <ThemedButton
                                        onClick={() => handleSendCredit(cuserData[0].id)}
                                        text={t.sendCredit}
                                        style={{ marginTop: 10, width: '90%', }}
                                    />
                                    <ThemedButton
                                        onClick={handleCancelCredit}
                                        text={t.cancel}
                                        styleText={{ color: COLORS.jaune }}
                                        style={{ marginTop: 10, width: '90%', backgroundColor: COLORS.white }}
                                    />



                                </View>)}
                                {!isTransferCredit && (<View style={styles.modalFooter}>
                                    <TouchableOpacity style={styles.navButtonLeft} onPress={handlePreviousImage}>
                                        <Icon name="chevron-back" size={24} color={COLORS.bg1} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.messageButton} onPress={() => {
                                        closeModalCuser()
                                        router.push(`/Chat?userId=${cuserData[0].id}&userName=${cuserData[0].name}&profilePic=${cuserData[0].photo}`)
                                    }}>
                                        <Icon name="chatbubble-ellipses-outline" size={30} color={COLORS.white} />
                                    </TouchableOpacity>
                                    {cuserDataUserFan === 0 && (<TouchableOpacity style={styles.messageButton} onPress={() => handleHeartLike(auth.idUser, cuserData[0].id)}>
                                        <Icon name="heart" size={30} color={COLORS.white} />
                                    </TouchableOpacity>)}
                                    <TouchableOpacity style={styles.messageButton} onPress={handleTransfer}>

                                        <Image
                                            source={{ uri: 'https://www.e-coress.com/themes/default/images/icon-coins.png' }}
                                            style={styles.or}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.navButtonRight} onPress={handleNextImage}>
                                        <Icon name="chevron-forward" size={24} color={COLORS.bg1} />
                                    </TouchableOpacity>
                                </View>)}
                            </View>
                        </View>
                    </View>

                </Modal>
            )}

            {cuserData && (
                <Modal
                    isVisible={isAlert}
                    onBackdropPress={closeAlert}
                    style={styles.modal}
                >
                    <View style={styles.modalOverlay}>

                        <View style={styles.modalAlert}>
                            <Icon name="rocket-outline" size={30} color={COLORS.jaune} />
                            <ThemedText>{t.spend1} {creditSend} {t.spend2} </ThemedText>
                        </View>
                    </View>

                </Modal>
            )}



            <Modal
                isVisible={isFilterModalVisible}
                onBackdropPress={toggleFilterModal}
                style={styles.modal}
            >
                <View style={styles.filterModalContent}>
                    <ThemedText type='defaultSemiBold'>{t.showMe}</ThemedText>
                    <Picker
                        selectedValue={gender}
                        style={styles.picker}
                        onValueChange={(itemValue: React.SetStateAction<string>) => setGender(itemValue)}
                    >
                        <Picker.Item label={t.homme} value="1" />
                        <Picker.Item label={t.femme} value="2" />
                        <Picker.Item label={t.lesbienne} value="3" />
                        <Picker.Item label={t.gay} value="4" />
                        <Picker.Item label={t.All} value="5" />
                    </Picker>

                    <View style={styles.filterRange}>
                        <ThemedText type='defaultSemiBold'>{t.age}</ThemedText>
                        <View style={styles.cardAge}>
                            <ThemedText type='defaultSemiBold'>18</ThemedText>
                            <Slider
                                style={styles.slider}
                                minimumValue={18}
                                maximumValue={80}
                                step={1}
                                value={maxAge}
                                onValueChange={(value: React.SetStateAction<number>) => setMaxAge(value)}
                            />
                            <ThemedText type='defaultSemiBold'>{maxAge}</ThemedText>
                        </View>
                    </View>
                    {/* <Input label={t.findByEmail} value={email} onChangeText={setEmail} /> */}

                    <View style={styles.filterRange}>
                        <Input label={'Localisation'} value={location} placeholder={t.localisationInconu} onChangeText={setLocation} />
                        <ThemedText type='defaultSemiBold'>{distance} KM</ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={50}
                            step={1}
                            value={distance}
                            onValueChange={(value: React.SetStateAction<number>) => setDistance(value)}
                        />
                    </View>

                    <TouchableOpacity onPress={toggleFilterModalSend} style={styles.applyButton}>
                        <Text style={styles.applyButtonText}>{t.applyFilter}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    stepImage1: {

        width: 360,
        height: 250,
        margin: 3

    },
    containeImage: {

        // // height: 200,
        // backgroundColor: 'blue',
        // justifyContent: 'center', // Centre verticalement
        // alignItems: 'center',    // Centre horizontalement
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
    containerInteret: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
    },
    cardInteret: {
        backgroundColor: '#fff',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    containerText: {

        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // padding: 5,
        marginVertical: 5
        // marginHorizontal: 5
    },
    containerquestion: {
        // paddingLeft: 5,
        // backgroundColor: "red"
    },
    question: {
        backgroundColor: COLORS.lightGray,
        padding: 5,
        paddingLeft: 10,
        borderRadius: 5
    },

    response: {
        paddingLeft: 20,

    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 70,
        marginBottom: 20,
        marginHorizontal: 20,
        justifyContent: 'space-between'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: COLORS.bg1,
    },
    activeText: {
        color: COLORS.jaune,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    nodata: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 50

    },
    sug: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 50
    },
    cardItem: {
        width: itemWidth,
        marginBottom: 10,
    },
    containerMeet: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'red'
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '95%',
        height: '90%',
        backgroundColor: 'transparent',
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
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
    modalTransfert: {
        backgroundColor: "red",
        height: 100,
        width: "100%",
        borderRadius: 10,
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        zIndex: 100
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        backgroundColor: COLORS.darkBlue,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    modalAge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.darkBlue,
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    closeButton: {
        backgroundColor: 'transparent',
    },
    profil: {
        marginLeft: 100
    },
    info: {
        width: '100%',
        height: 150,
        backgroundColor: COLORS.grayOne,
        position: 'relative',
        bottom: -55,
        padding: 5,
        borderRadius: 5
    },
    infoTransfer: {
        width: '100%',
        // height: 150,
        backgroundColor: COLORS.grayOne,
        // position: 'relative',
        // bottom: -55,
        padding: 5,
        textAlign: 'center',
        // alignItems: 'center',
        justifyContent: 'center'
        // borderRadius: 5
    },

    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: "red",
        position: 'relative',
        bottom: -60
    },
    navButtonRight: {
        backgroundColor: COLORS.white,
        borderRadius: 50,
        padding: 10,
        position: 'absolute',
        top: -300,
        right: 0
    },
    navButtonLeft: {
        backgroundColor: COLORS.white,
        borderRadius: 50,
        padding: 10,
        position: 'absolute',
        top: -300
    },
    messageButton: {
        backgroundColor: COLORS.bg1,
        borderRadius: 50,
        padding: 20,
    },
    or: {
        width: 30,
        height: 30
    },
    filterButton: {
        padding: 10,
    },

    filterModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%'
        // maxHeight: '80%',
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',


    },
    filterRange: {
        marginVertical: 10,
    },
    cardAge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slider: {
        width: '80%',
        marginVertical: 5,
    },
    filterInput: {
        borderColor: COLORS.lightGray,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
    applyButton: {
        backgroundColor: COLORS.jaune,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
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
    containerProfile: {
        flexGrow: 1,
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 2,
        width: 500
    }
});

