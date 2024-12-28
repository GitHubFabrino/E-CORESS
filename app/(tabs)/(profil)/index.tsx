// import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TouchableOpacity, View, ScrollView, FlatList, Text, ActivityIndicator, Button } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { getAllInterests, logoutUser, manageImage, updateProfilAll, updateUserBio, updateUserExtendeds, uploadBase64Image, uploadImage, uploadMedia, userProfil } from '@/request/ApiRest';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setLanguage } from '@/store/userSlice';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { UserProfileInterface } from './interfaceProfile';
import InputSelectorA from '@/components/input/InputSelectorA';
import { translations } from '@/service/translate';
import * as ImagePicker from 'expo-image-picker';
import InterestList from '@/components/input/InteretList';
import * as FileSystem from 'expo-file-system';
import InputText from '@/components/input/InputText';
import ThemedDatePicker from '@/components/input/InputDate';
interface InterestsData {
    id: string; // Identifiant unique de l'intérêt
    name: string; // Nom de l'intérêt
    icon: string; // URL de l'icône
    count: string; // Nombre d'éléments associés
}


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
    const [modifApropos, setmodifApropos] = useState(true);
    const [modifiname, setmodifname] = useState(true);
    const [birthday, setbirthday] = useState<string>('');
    const [modifbirthday, setmodifbirthday] = useState(true);
    const [modifigenre, setmodifgenre] = useState(true);

    const [profil, setProfil] = useState<UserProfileInterface | null>(null);
    const [option, setoption] = useState(['']);
    const [modifInfo, setmodifInfo] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string>('Option 1');
    const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    const [loading, setLoading] = useState(true);
    const [modifierBio, setmodifierBio] = useState(false);
    const [bio, setBio] = useState(profil?.bio || '');
    const [bioOld, setOldBio] = useState(bio);
    const [modifierubication, setmodifierubication] = useState(false);
    const [ubication, setubication] = useState(profil?.city || '');
    const [ubicationold, ubicationOld] = useState(ubication);
    const [modifierlangue, setmodifierlangue] = useState(false);
    const [modifierusername, setmodifierusername] = useState(true);
    const [modifieremail, setmodifieremail] = useState(false);

    const [usernameUser, setUsernameUser] = useState<string>('');
    const [emailUser, setEmailUser] = useState<string>('');
    const [nameUser, setNameUser] = useState<string>('');
    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [langUser, setlangUser] = useState<string>('');
    const [action, setAction] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [lat, setLat] = useState<string>('');
    const [lng, setLng] = useState<string>('');
    const [editEmail, setEditEmail] = useState<string>('');
    const [editUsername, setEditUsername] = useState<string>('');
    const [usernameOld, setusernameOld] = useState(usernameUser);
    const [emailOld, setemailOld] = useState(emailUser);

    const [nameOld, setnameOld] = useState(nameUser);
    const [selectedImage, setSelectedImage] = useState<string | undefined>();
    const [isImageSelect, setisImageSelect] = useState(false);
    const [alertOk, setAlertOk] = useState(false);

    const closeImageselect = () => { setisImageSelect(!isImageSelect) }
    const [isViewImage, setisViewImage] = useState(false);


    const [selectImageView, setselectImageView] = useState<string | undefined>();
    const [selectImageViewId, setselectImageViewId] = useState<string | undefined>();

    const [selectedImageViewPublic, setSelectedImageViewPublic] = useState<string | undefined>();
    const [optionIsSelect, setOptionIsSelect] = useState(false);
    const [newBirthDay, setNewBirthDay] = useState<Date>(new Date());
    const [ageUser, setAgeUser] = useState<string>();
    const [photoProfilUser, setPhotoProfilUser] = useState<string>();
    const [birthDayOriginal, setBirthDayOriginal] = useState('');

    const [usernamemodifier, setusernamemodifier] = useState('');
    const closeViewImage = () => {
        setisViewImage(!isViewImage)
        setOptionIsSelect(false)
    }

    useFocusEffect(
        useCallback(() => {
            promeseAll()
            setIsModalOption(false);
            setIsModalParam(false);
            setIsModalGallery(false);
        }, [birthDayOriginal, gender, usernamemodifier, langUser, lang])
    );

    useEffect(() => {
        if (lang === 'EN') {
            setoption(['Male', 'Female', 'Other']);
        } else {
            setoption(['Masculin', 'Feminin', 'Autre']);
        }
    }, [lang]);

    const promeseAll = async () => {
        setLoading(true);

        try {

            await Promise.all([
                getProfils(),
                getInterestsAll()
            ]);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateDataProfil = async (idQuestion: string, answer: string) => {
        try {
            const queryText = `${auth.idUser}[divider]${idQuestion}[divider]${answer}`;

            const response = await updateUserExtendeds(queryText);
            if (response === 200) {
                setAlertOk(true)
                setTimeout(() => {
                    setAlertOk(false)
                }, 2000);
                console.log('queryText', queryText);
                getProfils()

            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }

    };



    const splitBirthday = (birthday: string) => {
        // Utilisation d'une expression régulière pour extraire les parties de la date
        const dateParts = birthday.match(/(\w+)\s(\d{2}),\s(\d{4})/);

        if (!dateParts) {
            console.error("Invalid birthday format:", birthday);
            return { day: "Invalid", month: "Invalid", year: "Invalid" };
        }

        const monthName = dateParts[1];
        const day = dateParts[2];
        const year = dateParts[3];

        // Convertir le nom du mois en un numéro de mois
        const months = {
            January: "01",
            February: "02",
            March: "03",
            April: "04",
            May: "05",
            June: "06",
            July: "07",
            August: "08",
            September: "09",
            October: "10",
            November: "11",
            December: "12",
        };

        const month = months[monthName as keyof typeof months];

        if (!month) {
            console.error("Invalid month name:", monthName);
            return { day: "Invalid", month: "Invalid", year: "Invalid" };
        }

        return { day, month, year };
    };
    const [litlemodal, setLitlemodal] = useState(false);
    const getProfils = async () => {
        try {
            setLitlemodal(true)
            const response = await userProfil(auth.idUser);
            const { day, month, year } = splitBirthday(response.user.birthday);
            setBirthDayOriginal(response.user.birthday)
            setDay(day);
            setMonth(month);
            setYear(year);
            setProfil(response.user)

            setBio(response.user.bio)
            setubication(response.user.city)
            setUsernameUser(response.user.username)
            setEmailUser(response.user.email)
            setNameUser(response.user.name)
            console.log("nameuser", nameUser);

            setAgeUser(response.user.age)
            setPhotoProfilUser(response.user.profile_photo)


            setGender(response.user.gender)
            setlangUser(response.user.lang)
            setCity(response.user.city)
            setCountry(response.user.country)
            setLat(response.user.lat)
            setLng(response.user.lng)
            setEditEmail(response.user.email)
            setEditUsername(response.user.username)

            console.log('SETPROFILE : ', profil?.ip);
            setLitlemodal(false)

            console.log('response login ', response.user.lang_prefix);
            if (langUser === '1') {
                dispatch(setLanguage('EN'))

                setLang('EN')
                console.log(lang);

            } else {
                dispatch(setLanguage('FR'))
                setLang('FR')
                console.log(lang);
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    const [allInterestSite, setAllInterestSite] = useState<InterestsData[] | null>(null);

    const getInterestsAll = async () => {
        try {
            const response = await getAllInterests();
            console.log("RESPONSE Interest: ", response);
            setAllInterestSite(response)

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

    // const handelProfil = () => {
    //     setisProfil(!isProfil)
    // };

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

    const updateInterests = () => {
        console.log('testeeeeee');
        getProfils()
    };

    const sendUpdateProfile = () => {
        const update = async () => {
            try {
                const response = await updateUserBio(auth?.idUser, bio);

            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        update()
        getProfils()
    };
    const splitDate = (isoDate: Date) => {
        // Convertir la date ISO en objet Date
        const date = new Date(isoDate);

        if (isNaN(date.getTime())) {
            return { day: "Invalid", month: "Invalid", year: "Invalid" };
        }

        // Extraire le jour, le mois (ajouter 1 car les mois commencent à 0) et l'année
        const days = String(date.getUTCDate()).padStart(2, "0");
        const months = String(date.getUTCMonth() + 1).padStart(2, "0");
        const years = String(date.getUTCFullYear());

        return { days, months, years };
    };



    const sendUpdateProfileAll = () => {
        setusernamemodifier(usernameUser)
        setLitlemodal(true)
        const update = async () => {
            try {
                const response = await updateProfilAll(usernameUser, emailUser, nameUser, day, month, year, gender, langUser, ubication, country, lat, lng, editEmail, editUsername, auth.idUser);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        update()
        getProfils()
    };

    const sendUpdateProfileAllBithDay = (day: string, month: string, year: string) => {


        const update = async () => {
            try {
                const response = await updateProfilAll(usernameUser, emailUser, nameUser, day, month, year, gender, langUser, ubication, country, lat, lng, editEmail, editUsername, auth.idUser);
                if (response === 200) {
                    console.log(/********************oeeeeee************* */);

                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        update()
        getProfils()
    };
    const sendUpdateProfileAllLang = (idlang: string) => {
        console.log("Day:", day);
        console.log("Month:", month);
        console.log("Year:", year);

        console.log("UsernameUser:", usernameUser);
        console.log("EmailUser:", emailUser);
        console.log("NameUser:", nameUser);

        console.log("Gender:", gender);
        console.log("LangUser:", idlang);
        console.log("City:", city);
        console.log("City ubi:", ubication);
        console.log("Country:", country);
        console.log("Lat:", lat);
        console.log("Lng:", lng);
        console.log("EditEmail:", editEmail);
        console.log("EditUsername:", editUsername);
        console.log("editId:", auth.idUser);

        const update = async () => {
            try {

                const response = await updateProfilAll(usernameUser, emailUser, nameUser, day, month, year, gender, idlang, ubication, country, lat, lng, editEmail, editUsername, auth.idUser);
                console.log('response : ', response);

                if (response === 200) {
                    console.log(/********************oeeeeee************* */);

                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        update()
        // getProfils()
    };
    const sendUpdateProfileAllGender = (idGender: string) => {
        console.log("Day:", day);
        console.log("Month:", month);
        console.log("Year:", year);

        console.log("UsernameUser:", usernameUser);
        console.log("EmailUser:", emailUser);
        console.log("NameUser:", nameUser);

        console.log("Gender:", idGender);
        console.log("LangUser:", langUser);
        console.log("City:", city);
        console.log("City ubi:", ubication);
        console.log("Country:", country);
        console.log("Lat:", lat);
        console.log("Lng:", lng);
        console.log("EditEmail:", editEmail);
        console.log("EditUsername:", editUsername);
        console.log("editId:", auth.idUser);
        setmodifgenre(!modifigenre)

        const update = async () => {
            try {

                const response = await updateProfilAll(usernameUser, emailUser, nameUser, day, month, year, idGender, langUser, ubication, country, lat, lng, editEmail, editUsername, auth.idUser);
                console.log('response : ', response);

                if (response === 200) {
                    console.log(/********************oeeeeee************* */);

                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        update()
        getProfils()
    };



    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Désolé, nous avons besoin des permissions pour accéder à vos photos !');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: false,
            aspect: [4, 3],
            base64: true,
        });

        if (!result.canceled) {
            const imageType = result.assets[0].mimeType;
            const base64Image = `data:${imageType};base64,${result.assets[0].base64}`;
            setSelectedImage(base64Image);
            setisImageSelect(true)
        }

    };

    const sendImageMessage = () => {
        if (!selectedImage) {
            return;
        }
        console.log(selectedImage);

        const send = async () => {
            const responseSendImage = await uploadBase64Image(selectedImage);
            console.log('reponse Upload ', responseSendImage);
            if (responseSendImage && responseSendImage.path && responseSendImage.thumb) {
                const uploadMediaresponse = await uploadMedia(responseSendImage.path, responseSendImage.thumb);
                console.log('response ipmedia : ', uploadMediaresponse);
                getProfils()

            }
        }
        send()
        setisImageSelect(false)

    }
    const sendManage = async (p: string, s: string, d: string, b: string, u: string) => {
        try {
            if (selectImageViewId) {
                const response = await manageImage(auth.idUser, selectImageViewId, p, b, u, s, d);
                if (response === 200) {
                    console.log(/********************oeeeeee************* */);
                    getProfils()
                    closeViewImage()
                    setselectImageView(''); setselectImageViewId('')

                }
            }


        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    const optionImageFunc = (option: string) => {

        if (option === 'profil') {
            sendManage('1', '0', '0', '0', '0')
        }
        if (option === 'story') {
            sendManage('0', '1', '0', '0', '0')
        }
        if (option === 'delete') {
            sendManage('0', '0', '1', '0', '0')
        }
        if (option === 'private') {
            if (selectedImageViewPublic === '1') {

                sendManage('0', '0', '0', '0', '1')
            } else {
                sendManage('0', '0', '0', '1', '0')
            }

        }

    }

    // Fonction pour formater les crédits
    const formatCredits = (credits: string): string => {
        // Conversion en nombre si nécessaire
        const creditValue = typeof credits === 'string' ? parseFloat(credits) : credits;

        // Si la conversion échoue ou si la valeur est indéfinie, retourne 0
        if (isNaN(creditValue) || creditValue === undefined) {
            return '0';
        }

        // Formatage en fonction de la valeur
        if (creditValue >= 1_000_000_000) {
            return (creditValue / 1_000_000_000).toFixed(1).replace('.0', '') + 'B'; // Billion
        }
        if (creditValue >= 1_000_000) {
            return (creditValue / 1_000_000).toFixed(1).replace('.0', '') + 'M'; // Million
        }
        if (creditValue >= 1_000) {
            return (creditValue / 1_000).toFixed(1).replace('.0', '') + 'K'; // Millier
        }
        return creditValue.toString(); // Inférieur à 1 000, affiche normalement
    };
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={{ color: COLORS.bg1 }}>{t.profile}</ThemedText>
                <ThemedView style={styles.containerIcon}>

                    {isModalParam ? (<TouchableOpacity onPress={handelGallery} style={styles.filterButton}>
                        <Icon name="images" size={25} color={COLORS.darkBlue} />
                    </TouchableOpacity>) :
                        (<TouchableOpacity onPress={handelParam} style={styles.filterButton}>
                            <Icon name="settings" size={25} color={COLORS.darkBlue} />
                        </TouchableOpacity>)}
                    <TouchableOpacity onPress={handledeEllips} style={styles.filterButton}>
                        <Icon name="ellipsis-vertical" size={25} color={COLORS.darkBlue} />
                    </TouchableOpacity>
                </ThemedView>

                {alertOk && <View style={styles.alertOk}><Icon name="trophy" size={30} color={COLORS.green} /></View>}

            </ThemedView>

            {loading ?
                (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={COLORS.jaune} />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                        <ThemedView>
                            <View style={styles.cardProfilItem}>
                                <Image source={{ uri: photoProfilUser }} style={styles.cardProfil} />
                                {profil?.premium === 1 && <Image source={require('@/assets/images/icon3.png')} style={styles.premium} />}

                                <View style={styles.cardInfo}>
                                    <ThemedText type="subtitle" style={styles.cardProfilName}>{profil?.name}</ThemedText>

                                    <View style={[styles.flex, { position: 'absolute', bottom: 50, left: 10 }]}>
                                        <Icon name="watch" size={15} color={COLORS.bg1} />
                                        <ThemedText type="defaultSemiBold" style={[styles.cardProfilName, { marginLeft: 10, color: '#7a7979', fontSize: 12 }]}>{ageUser} {t.years}</ThemedText>
                                    </View>

                                    <View style={[styles.flex, { position: 'absolute', bottom: 30, left: 10 }]}>
                                        <Icon name="location" size={15} color={COLORS.bg1} />
                                        <ThemedText type="defaultSemiBold" style={[styles.cardProfilName, { marginLeft: 10, color: COLORS.text2, fontSize: 12 }]}>{profil?.city}</ThemedText>
                                    </View>
                                    <View style={[styles.flex, { position: 'absolute', bottom: 10, left: 10 }]}>
                                        <Icon name="diamond" size={15} color={COLORS.jaune} />
                                        <ThemedText type="defaultSemiBold" style={[styles.cardProfilName, { marginLeft: 10, color: '#7a7979', fontSize: 12 }]}> Premium {profil?.premium === 1 ? t.yes : t.no}</ThemedText>
                                    </View>


                                </View>
                            </View>
                        </ThemedView>
                        {
                            !isModalGallery && (<View  >
                                <TouchableOpacity onPress={() => { openImagePicker() }} style={styles.addimage}>
                                    <Icon name="camera-outline" size={30} color={COLORS.bg1} />
                                </TouchableOpacity>

                                <View style={styles.cardGallery}>
                                    <FlatList
                                        horizontal
                                        data={profil?.photos}
                                        keyExtractor={(item) => item.id.toString()}  // Conversion de l'id en chaîne
                                        renderItem={({ item }) => (
                                            <ThemedView style={styles.containerImage}>
                                                <TouchableOpacity onPress={() => {
                                                    setselectImageView(item.photo); setselectImageViewId(item.id); setSelectedImageViewPublic(item.private); console.log('ici'); closeViewImage()
                                                }}>
                                                    <Image source={{ uri: item.photo }} style={styles.cardGalleryImage} />
                                                    <View style={[styles.sendActionTextPrivateDiv,]}>
                                                        <Icon name={item.private === '1' ? "lock-closed-outline" : "lock-open-outline"} size={15} color={COLORS.bg1} />
                                                        <Text style={[styles.sendActionTextPrivate, { color: COLORS.bg1 }]}>{item.private === '1' ? t.locked : t.unlocked}</Text>

                                                    </View>


                                                </TouchableOpacity>
                                            </ThemedView>
                                        )}
                                        contentContainerStyle={styles.personList}
                                    />

                                </View>

                            </View>)
                        }

                        <Modal
                            isVisible={isViewImage}
                            onBackdropPress={closeViewImage}
                            style={styles.modal}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalOverlay}>

                                    {
                                        selectImageView && <View style={styles.modalContent1}>
                                            <Image
                                                source={{ uri: selectImageView }}
                                                style={{ width: '100%', height: '100%', borderRadius: 10, }}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    }
                                    <TouchableOpacity onPress={() => { setOptionIsSelect(!optionIsSelect) }} style={styles.optionImage}>
                                        <Icon name="ellipsis-vertical-outline" size={25} color={COLORS.white} />
                                    </TouchableOpacity>
                                    {optionIsSelect && <View style={styles.optionImageDesicion}>
                                        <TouchableOpacity onPress={() => optionImageFunc('private')} style={[styles.sendAction,]}>
                                            <Icon name={selectedImageViewPublic === '1' ? "lock-closed-outline" : "lock-open-outline"} size={25} color={COLORS.bg1} />
                                            <Text style={[styles.sendActionText, { color: COLORS.bg1 }]}>{selectedImageViewPublic === '1' ? t.locked : t.unlocked}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => optionImageFunc('profil')} style={[styles.sendAction,]}>
                                            <Icon name="person-circle-outline" size={25} color={COLORS.bg1} />
                                            <Text style={[styles.sendActionText, { color: COLORS.bg1 }]}>{t.profil}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => optionImageFunc('story')} style={[styles.sendAction,]}>
                                            <Icon name="add-circle-outline" size={25} color={COLORS.jaune} />
                                            <Text style={[styles.sendActionText, { color: COLORS.jaune }]}>{t.story}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => optionImageFunc('delete')} style={[styles.sendAction,]}>
                                            <Icon name="trash-bin-outline" size={25} color={COLORS.red} />
                                            <Text style={[styles.sendActionText, { color: 'red' }]}>{t.delete}</Text>
                                        </TouchableOpacity>
                                    </View>}


                                </View>


                            </View>

                        </Modal>


                        {
                            isModalParam && (
                                <ThemedView>
                                    <ThemedView style={styles.containerInfo1}>
                                        {/* UserName */}

                                        {modifierusername ? (<ThemedView style={styles.containerInfoUser}>


                                            <View style={styles.icon}>
                                                <Icon name="person-outline" size={25} color={COLORS.bg1} />
                                            </View>
                                            <View style={styles.infoCardUser}>
                                                <View>
                                                    <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.username}</ThemedText>
                                                    <ThemedText style={{ color: COLORS.text2 }}>{usernameUser}</ThemedText>

                                                </View>

                                                <TouchableOpacity onPress={() => {
                                                    setmodifierusername(!modifierusername)
                                                }}>
                                                    <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                                </TouchableOpacity>

                                            </View>


                                        </ThemedView>) : (<ThemedView style={styles.containerInfo}>
                                            <View style={styles.itemTitre}>
                                                <ThemedText type='defaultSemiBold'>{t.username}</ThemedText>
                                                <TouchableOpacity onPress={() => {
                                                    sendUpdateProfileAll()
                                                    setmodifierusername(!modifierusername)
                                                }}>
                                                    <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.infoCard}>
                                                <InputText value={usernameUser} onChangeText={(text) => setUsernameUser(text)} />
                                            </View>
                                        </ThemedView>)}





                                        {/* Email User */}
                                        {!modifieremail ? (
                                            <ThemedView style={styles.containerInfoUser}>


                                                <View style={styles.icon}>
                                                    <Icon name="at" size={25} color={COLORS.bg1} />
                                                </View>
                                                <View style={styles.infoCardUser}>
                                                    <View>
                                                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.email}</ThemedText>
                                                        <ThemedText style={{ color: COLORS.text2 }}>{emailUser}</ThemedText>

                                                    </View>

                                                    <TouchableOpacity onPress={() => {
                                                        setmodifieremail(!modifieremail)
                                                    }}>
                                                        <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                                    </TouchableOpacity>

                                                </View>


                                            </ThemedView>
                                        ) : (
                                            <ThemedView style={styles.containerInfo}>
                                                <View style={styles.itemTitre}>
                                                    <ThemedText type='defaultSemiBold'>{t.email}</ThemedText>
                                                    <TouchableOpacity onPress={() => {
                                                        setmodifieremail(!modifieremail)
                                                        sendUpdateProfileAll()
                                                    }}>
                                                        <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.infoCard}>

                                                    <InputText value={emailUser} onChangeText={(text) => setEmailUser(text)} />

                                                </View>
                                            </ThemedView>)}















                                        {/* Name */}
                                        {modifiname ? (
                                            <ThemedView style={styles.containerInfoUser}>


                                                <View style={styles.icon}>
                                                    <Icon name="trophy-outline" size={25} color={COLORS.bg1} />
                                                </View>
                                                <View style={styles.infoCardUser}>
                                                    <View>
                                                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.Name}</ThemedText>
                                                        <ThemedText style={{ color: COLORS.text2 }}>{nameUser}</ThemedText>

                                                    </View>

                                                    <TouchableOpacity onPress={() => {
                                                        setmodifname(!modifiname)
                                                    }}>
                                                        <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                                    </TouchableOpacity>

                                                </View>


                                            </ThemedView>
                                        ) : (

                                            <ThemedView style={styles.containerInfo}>
                                                <View style={styles.itemTitre}>
                                                    <ThemedText type='defaultSemiBold'>{t.Name}</ThemedText>
                                                    <TouchableOpacity onPress={() => {
                                                        sendUpdateProfileAll()
                                                        setmodifname(!modifiname)
                                                    }}>
                                                        <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.infoCard}>
                                                    <InputText value={nameUser} onChangeText={(text) => setNameUser(text)} />
                                                </View>
                                            </ThemedView>
                                        )}








                                        {/* BirthDay */}
                                        {modifbirthday ? (
                                            <ThemedView style={styles.containerInfoUser}>


                                                <View style={styles.icon}>
                                                    <Icon name="calendar-clear-outline" size={25} color={COLORS.bg1} />
                                                </View>
                                                <View style={styles.infoCardUser}>
                                                    <View>
                                                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.birthday}</ThemedText>
                                                        <ThemedText style={{ color: COLORS.text2 }}>{birthDayOriginal}</ThemedText>

                                                    </View>

                                                    <TouchableOpacity onPress={() => {
                                                        setmodifbirthday(!modifbirthday)
                                                    }}>
                                                        <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                                    </TouchableOpacity>

                                                </View>


                                            </ThemedView>
                                        ) : (
                                            <ThemedView style={styles.containerInfo}>
                                                <View style={styles.itemTitre}>
                                                    <ThemedText type='defaultSemiBold'>{t.birthday}</ThemedText>
                                                    <TouchableOpacity onPress={() => {
                                                        console.log(splitDate(newBirthDay));
                                                        const { days, months, years } = splitDate(newBirthDay)
                                                        if (days && months && years) {

                                                            sendUpdateProfileAllBithDay(days, months, years)
                                                            setmodifbirthday(!modifbirthday)
                                                            console.log("New date ", newBirthDay);

                                                            const monthL = {
                                                                "01": "January",
                                                                "02": "February",
                                                                "03": "March",
                                                                "04": "April",
                                                                "05": "May",
                                                                "06": "June",
                                                                "07": "July",
                                                                "08": "August",
                                                                "09": "September",
                                                                "10": "October",
                                                                "11": "November",
                                                                "12": "December",
                                                            };

                                                            const monthnew = monthL[months as keyof typeof monthL];
                                                            console.log('test mois ', monthnew);
                                                            const monthString = `${monthnew} ${days}, ${years}`
                                                            setBirthDayOriginal(monthString)




                                                        }
                                                    }}>
                                                        <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.infoCard}>

                                                    <ThemedDatePicker
                                                        value={newBirthDay || new Date()}
                                                        onChange={setNewBirthDay}
                                                    />
                                                </View>
                                            </ThemedView>)}

                                        {/* GENRE */}
                                        {modifigenre ? (
                                            <ThemedView style={styles.containerInfoUser}>


                                                <View style={styles.icon}>
                                                    <Icon name="male-female" size={25} color={COLORS.bg1} />
                                                </View>
                                                <View style={styles.infoCardUser}>
                                                    <View>
                                                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.genderLabel}</ThemedText>
                                                        <ThemedText style={{ color: COLORS.text2 }}>{gender === "1" ? (t.male) : (gender === '2' ? (t.femelle) : (gender === '3' ? (t.lesbienne) : (t.gay)))}</ThemedText>

                                                    </View>

                                                    <TouchableOpacity onPress={() => {
                                                        setmodifgenre(!modifigenre)
                                                    }}>
                                                        <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                                    </TouchableOpacity>

                                                </View>


                                            </ThemedView>
                                        ) : (
                                            <ThemedView style={styles.containerInfo}>
                                                <View style={styles.itemTitre}>
                                                    <ThemedText type='defaultSemiBold'>{t.genderLabel}</ThemedText>
                                                    <TouchableOpacity onPress={() => {
                                                        setmodifgenre(!modifigenre)
                                                    }}>
                                                        <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.infoCard}>
                                                    <InputSelectorA
                                                        titre={t.genderLabel}
                                                        options={[{ 'id': '1', 'gender': `${t.male}` }, { 'id': '2', 'gender': `${t.femelle}` }, { 'id': '3', 'gender': `${t.lesbienne}` }, { 'id': '4', 'gender': `${t.gay}` }].map(item => ({
                                                            value: item.id,
                                                            label: item.gender
                                                        }))}
                                                        selectedValue={selectedOption}
                                                        onValueChange={(value) => {
                                                            setGender(value)
                                                            getProfils()
                                                            sendUpdateProfileAllGender(value)
                                                        }}
                                                    />
                                                </View>
                                            </ThemedView>)}

                                    </ThemedView>
                                </ThemedView>
                            )
                        }
                        {/* IMAGE SELECT */}
                        <Modal
                            isVisible={isImageSelect}
                            onBackdropPress={closeImageselect}
                            style={styles.modal}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalOverlay}>

                                    <View style={styles.modalContent1}>
                                        <Image
                                            source={{ uri: selectedImage }}
                                            style={{ width: '100%', height: '100%', borderRadius: 10, }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => sendImageMessage()} style={styles.sendGift}>
                                        <Text style={styles.sendGiftText}>{t.send}</Text>
                                    </TouchableOpacity>


                                </View>


                            </View>

                        </Modal>


                        <ThemedView style={styles.containerOption}>
                            <TouchableOpacity onPress={() => { }} >
                                <View style={styles.cardItem}>
                                    <View style={styles.icon}>
                                        {/* <Image source={require('@/assets/images/icon1.png')} style={styles.iconItem} /> */}
                                        <Icon name="battery-half" size={25} color={COLORS.bg1} />
                                    </View>
                                    <View style={styles.textItem}>
                                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.pop}</ThemedText>
                                        <ThemedText type='defaultSemiBold' style={styles.text}>{t.Increase}</ThemedText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { }} >
                                <View style={styles.cardItem}>
                                    <View style={styles.icon}>
                                        <Image source={require('@/assets/images/icon2.png')} style={styles.iconItem} />
                                    </View>
                                    <View style={styles.textItem}>
                                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }} >{formatCredits(profil?.credits || '0')} {t.credit}</ThemedText>
                                        <ThemedText type='defaultSemiBold' style={styles.text}>{t.byeCredit}</ThemedText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { }} >
                                <View style={styles.cardItem}>
                                    <View style={styles.icon}>
                                        {/* <Image source={require('@/assets/images/icon3.png')} style={styles.iconItem} /> */}
                                        <Icon name="diamond-sharp" size={25} color={COLORS.bg1} />
                                    </View>
                                    <View style={styles.textItem}>
                                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.activation}</ThemedText>
                                        <ThemedText type='defaultSemiBold' style={styles.text}>{profil?.verified === '1' ? t.Act : t.notAct}</ThemedText>
                                    </View>
                                </View>
                            </TouchableOpacity>


                        </ThemedView>

                        {/* ABOUT */}
                        <ThemedView style={styles.containerInfo}>
                            <View style={styles.itemTitre}>
                                <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.about}</ThemedText>
                                {!modifierBio ? (<TouchableOpacity onPress={() => { setmodifierBio(!modifierBio) }}>
                                    <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                </TouchableOpacity>) :
                                    (<TouchableOpacity onPress={() => {
                                        setmodifierBio(!modifierBio)
                                        if (bioOld !== bio) {
                                            console.log('mofiddidid');
                                            sendUpdateProfile()
                                        }
                                    }}>
                                        <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                    </TouchableOpacity>)}
                            </View>
                            <View style={styles.infoCard}>
                                {!modifierBio ? (
                                    <ThemedText style={{ color: COLORS.text1 }}>{bio}</ThemedText>
                                ) : (
                                    <InputText value={bio} onChangeText={(text) => setBio(text)} />
                                )
                                }
                            </View>
                        </ThemedView>
                        {/* UBICATION */}
                        <ThemedView style={styles.containerInfo}>
                            <View style={styles.itemTitre}>
                                <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.ubication}</ThemedText>
                                {!modifierubication ? (<TouchableOpacity onPress={() => {
                                    setmodifierubication(!modifierubication)

                                }}>
                                    <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                </TouchableOpacity>) : (<TouchableOpacity onPress={() => {
                                    setmodifierubication(!modifierubication)
                                    if (ubicationold !== ubication) {
                                        console.log('mofiddidid');
                                        sendUpdateProfileAll()
                                    }


                                }}>
                                    <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                </TouchableOpacity>)}
                            </View>
                            <View style={styles.infoCard}>
                                {!modifierubication ? (
                                    <ThemedText style={{ color: COLORS.text1 }}>{ubication}</ThemedText>
                                ) : (
                                    <InputText value={ubication} onChangeText={(text) => setubication(text)} />
                                )
                                }
                            </View>
                        </ThemedView>

                        <ThemedView style={styles.containerInfo}>
                            <View style={styles.itemTitre}>
                                <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.infoPer}</ThemedText>
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

                                {/* Mbola ts complet */}
                                {/* <ThemedView>
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
                        </ThemedView> */}

                                {/* QUESTIONS */}
                                {profil?.question.map((item) => (
                                    <View key={item.id}>
                                        {modifInfo ? (
                                            <ThemedView style={styles.containerText}>
                                                <View style={styles.textContainer}>
                                                    <ThemedText style={{ color: COLORS.bg1, fontWeight: 'bold' }}>{item.question}</ThemedText>
                                                </View>

                                                <View style={styles.textContainer}>
                                                    <ThemedText style={{ color: COLORS.text1 }}>{item.userAnswer || 'Pas de réponse'}</ThemedText>
                                                </View>
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
                                                    console.log('id question : ', item.id);
                                                    console.log('reponse  : ', value);
                                                    updateDataProfil(item.id, value)

                                                }}
                                            />
                                        )}
                                    </View>
                                ))}

                            </View>

                        </ThemedView>


                        <InterestList
                            title={t.interest}
                            dataAllInterest={allInterestSite || []}
                            update={updateInterests}
                            userId={auth.idUser}
                            profileInfo={{ interest: typeof profil?.interest === 'object' && !Array.isArray(profil?.interest) ? profil?.interest : {} }}
                        />
                        {/* LANGUAGE */}
                        <ThemedView style={styles.containerInfo}>
                            <View style={styles.itemTitre}>
                                <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.langage}</ThemedText>
                                {!modifierlangue ? (<TouchableOpacity onPress={() => {
                                    setmodifierlangue(!modifierlangue)
                                }}>
                                    <Icon name={"create-outline"} size={25} color={COLORS.darkBlue} />
                                </TouchableOpacity>) : (<TouchableOpacity onPress={() => {
                                    setmodifierlangue(!modifierlangue)
                                }}>
                                    <Icon name={"checkmark-done-outline"} size={25} color={COLORS.green} />
                                </TouchableOpacity>)}
                            </View>
                            <View style={styles.infoCard}>
                                {!modifierlangue ? (
                                    <ThemedText style={{ color: COLORS.text1 }}>{langUser === "94" ? ('Francais') : ('Anglais')}</ThemedText>
                                ) : (<InputSelectorA
                                    titre={t.langage}
                                    options={[{ 'id': '1', 'lng': 'Englais' }, { 'id': '94', 'lng': 'Francais' }].map(item => ({
                                        value: item.id,
                                        label: item.lng
                                    }))}
                                    selectedValue={selectedOption}
                                    onValueChange={(value) => {

                                        setlangUser(value)
                                        console.log('id  : ', value);
                                        console.log(langUser);
                                        getProfils()
                                        setmodifierlangue(!modifierlangue)

                                        sendUpdateProfileAll()
                                        sendUpdateProfileAllLang(value)

                                    }}
                                />
                                )
                                }
                            </View>
                        </ThemedView>
                        {/* Option */}
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
                                    <ThemedText type='defaultSemiBold' style={styles.option}>{t.credit}</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handelMostPopular} style={styles.filterButton}>
                                    <Icon name="rocket-outline" size={25} color={COLORS.darkBlue} />

                                    <ThemedText type='defaultSemiBold' style={styles.option}>{t.offre}</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handelInteraction} style={styles.filterButton}>
                                    <Icon name="git-network-outline" size={25} color={COLORS.darkBlue} />
                                    <ThemedText type='defaultSemiBold' style={styles.option}>{t.interactions}</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handledeConnect} style={styles.filterButton}>
                                    <Icon name="log-out-outline" size={25} color={COLORS.darkBlue} />
                                    <ThemedText type='defaultSemiBold' style={styles.option}>{t.dec}</ThemedText>
                                </TouchableOpacity>

                            </View>
                        </Modal>
                        {/* Log OUT */}

                        <Modal
                            isVisible={isModalDeconnexion}
                            onBackdropPress={closeModal}
                            style={styles.modal}
                        >
                            <View style={styles.modalContentDeconex}>
                                <ThemedText>{t.logOut}</ThemedText>
                                <View style={styles.btn}>
                                    <ThemedButton text={'Annuler'} style={styles.annuler} styleText={styles.textAnnuller} onClick={() => setIsModalDec(!isModalDeconnexion)} />
                                    <ThemedButton text={'Confirmer'} onClick={confirmLogOut} />
                                </View>
                            </View>
                        </Modal>
                        {/* reload */}
                        <Modal
                            isVisible={litlemodal}
                            onBackdropPress={() => !litlemodal}
                            style={styles.modal}
                        >
                            <ThemedText></ThemedText>
                        </Modal>


                    </ScrollView>
                )
            }

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    sendGift: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        backgroundColor: COLORS.bg1,
        marginTop: 20

    },
    sendAction: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',

        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        shadowColor: COLORS.bg1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        backgroundColor: COLORS.white,
        width: '100%',
        margin: 2

    },
    sendActionText: {
        color: COLORS.bg1,
        fontSize: 18,
        fontWeight: 'bold'
    },
    sendActionTextPrivate: {
        color: COLORS.bg1,
        fontSize: 12,
        fontWeight: 'bold',
        zIndex: 100
    },
    sendActionTextPrivateDiv: {
        position: 'absolute',
        right: 5,
        top: 5,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 80,
        zIndex: 1000
    },
    sendGiftText: {
        color: 'white',
        fontSize: 18,
    },
    optionImageDesicion: {
        width: '60%',
        borderRadius: 5,
        // backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        bottom: 0,
        padding: 10,
        // opacity: 0.9
    },
    optionImage: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.bg1,
        borderRadius: 100,
        position: 'relative',
        // right: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 50,
        marginBottom: 10,
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
    alertOk: {
        position: 'absolute',
        width: 30,
        height: 30,
        top: 50,
        right: 10,
        zIndex: 1000

    },
    containerOption: {
        marginVertical: 50,
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
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomColor: COLORS.bg1,
        backgroundColor: COLORS.bg1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20
    },
    cardInfo: {
        backgroundColor: 'white',
        width: '50%',
        height: 140,
        borderRadius: 20,
        padding: 20,
        paddingTop: 20
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardProfil: {
        width: 120,
        height: 120,
        borderRadius: 70,
        margin: 20,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
    },
    premium: {
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 0,
        left: 80,


    },
    cardProfilName: {
        color: COLORS.bg1

    },
    containerImage: {
        width: 200,
        height: 200,
        marginHorizontal: 5,
        borderRadius: 10
    },
    cardGallery: {
        backgroundColor: COLORS.bg6
    },
    addimage: {
        margin: 5,
        backgroundColor: COLORS.jaune,
        alignSelf: 'flex-end',

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
    icon: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#2d377440'
    },
    iconItem: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        // backgroundColor: 'red',
        padding: 10
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
        fontWeight: 'bold',
        color: COLORS.text2
    },
    containerInfo: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: COLORS.bg6
    },
    containerInfoUser: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: COLORS.transparence,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    infoCardUser: {
        width: '85%',
        padding: 10,
        backgroundColor: COLORS.bg2,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textContainer: {
        width: '45%'
    },
    itemTitre: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
        backgroundColor: COLORS.bg5,
        borderRadius: 5
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
        backgroundColor: COLORS.bg6,
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
        marginVertical: 10,
        backgroundColor: COLORS.transparence
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
    modalContent1: {
        width: '100%',
        height: '90%',
        backgroundColor: 'transparent',
        position: 'relative',
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

