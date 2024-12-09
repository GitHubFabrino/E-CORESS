// import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableOpacity, View, ScrollView, FlatList, Text, ActivityIndicator, Button } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { getAllInterests, logoutUser, updateProfilAll, updateUserBio, updateUserExtendeds, uploadBase64Image, uploadImage, uploadMedia, userProfil } from '@/request/ApiRest';
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
import * as ImagePicker from 'expo-image-picker';
import InterestList from '@/components/input/InteretList';
import * as FileSystem from 'expo-file-system';
import InputText from '@/components/input/InputText';
interface InterestsData {
    id: string; // Identifiant unique de l'intérêt
    name: string; // Nom de l'intérêt
    icon: string; // URL de l'icône
    count: string; // Nombre d'éléments associés
}
// Déclarez un type pour l'image
type ImageFile = {
    uri: string;
    name?: string;
    type?: string;
};

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
    const [modifierusername, setmodifierusername] = useState(false);
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


    useEffect(() => {
        if (auth.idUser) {
            promeseAll()
        }
    }, [auth.newM]);

    useFocusEffect(
        useCallback(() => {
            // Réinitialiser l'état des modals
            getProfils()
            setIsModalOption(false);
            setIsModalParam(false);
            setIsModalGallery(false);
        }, [])
    );

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
            console.log("RESPONSE QUESTION: ", response);
            console.log("******************birth", response.user.birthday);
            console.log("******************lang", response.user.lang);


            const { day, month, year } = splitBirthday(response.user.birthday);
            setDay(day);
            setMonth(month);
            setYear(year);
            setProfil(response.user)
            setBio(response.user.bio)
            setubication(response.user.city)
            setUsernameUser(response.user.username)
            setEmailUser(response.user.email)
            setNameUser(response.user.name)
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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.jaune} />
            </View>
        );
    }
    const updateTest = () => {
        console.log('testeeeeee');

    };


    const updateInterests = () => {
        console.log('testeeeeee');
        getProfils()
    };



    const sendUpdateProfile = () => {
        console.log('Bio', bio);
        console.log('Bio', bio);
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
    const sendUpdateProfileAll = () => {
        console.log("Day:", day);
        console.log("Month:", month);
        console.log("Year:", year);

        console.log("UsernameUser:", usernameUser);
        console.log("EmailUser:", emailUser);
        console.log("NameUser:", nameUser);

        console.log("Gender:", gender);
        console.log("LangUser:", langUser);
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
                const response = await updateProfilAll(usernameUser, emailUser, nameUser, day, month, year, gender, langUser, ubication, country, lat, lng, editEmail, editUsername, auth.idUser);
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
        // getProfils()
    };



    const closeModif = () => {
        setmodifgenre(false)
    };



    const correctedFile = async (file: { uri: string; name: string; type: string }) => {
        const localUri = FileSystem.documentDirectory + file.name;

        await FileSystem.copyAsync({
            from: file.uri,
            to: localUri,
        });

        return {
            uri: localUri,
            name: file.name,
            type: file.type,
        };
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
            const imageType = result.assets[0].mimeType; // Ex : "image/jpeg" ou "image/png"
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

                {alertOk && <View style={styles.alertOk}><Icon name="trophy" size={30} color={COLORS.green} /></View>}

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
                        <TouchableOpacity onPress={() => { openImagePicker() }} style={styles.addimage}>
                            <Icon name="camera-outline" size={30} color={COLORS.bg1} />
                        </TouchableOpacity>
                        {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
                            <Button title="Choisir une Image" onPress={pickImage} />
                            
                        </View> */}
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
                                {/* <AboutSection
                                    titre={t.username}
                                    aproposValue={profil?.username || ''}
                                    setAproposValue={setusername}
                                    modifApropos={modifusername}
                                    setModifApropos={setmodifusername}
                                /> */}

                                <ThemedView style={styles.containerInfo}>
                                    <View style={styles.itemTitre}>
                                        <ThemedText type='defaultSemiBold'>{t.username}</ThemedText>
                                        <TouchableOpacity onPress={() => {
                                            setmodifierusername(!modifierusername)
                                            if (usernameOld !== usernameUser) {
                                                console.log('mofiddidid');
                                                sendUpdateProfileAll()
                                            }


                                        }}>
                                            <Icon name={!modifierusername ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.infoCard}>
                                        {!modifierusername ? (
                                            <ThemedText>{usernameUser}</ThemedText>
                                        ) : (
                                            <InputText value={usernameUser} onChangeText={(text) => setUsernameUser(text)} />
                                        )
                                        }
                                    </View>
                                </ThemedView>

                                {/* <AboutSection
                                    titre={t.email}
                                    aproposValue={profil?.email || ''}
                                    setAproposValue={setemail}
                                    modifApropos={modifiemail}
                                    setModifApropos={setmodifemail}
                                /> */}
                                <ThemedView style={styles.containerInfo}>
                                    <View style={styles.itemTitre}>
                                        <ThemedText type='defaultSemiBold'>{t.email}</ThemedText>
                                        <TouchableOpacity onPress={() => {
                                            setmodifieremail(!modifieremail)
                                            if (emailOld !== emailUser) {
                                                console.log('mofiddidid');
                                                sendUpdateProfileAll()
                                            }


                                        }}>
                                            <Icon name={!modifieremail ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.infoCard}>
                                        {!modifieremail ? (
                                            <ThemedText>{emailUser}</ThemedText>
                                        ) : (
                                            <InputText value={emailUser} onChangeText={(text) => setEmailUser(text)} />
                                        )
                                        }
                                    </View>
                                </ThemedView>

                                {/* <AboutSection
                                    titre={t.Name}
                                    aproposValue={profil?.name || ''}
                                    setAproposValue={setusername}
                                    modifApropos={modifiname}
                                    setModifApropos={setmodifname}
                                /> */}

                                <ThemedView style={styles.containerInfo}>
                                    <View style={styles.itemTitre}>
                                        <ThemedText type='defaultSemiBold'>{t.Name}</ThemedText>
                                        <TouchableOpacity onPress={() => {
                                            setmodifname(!modifiname)
                                            if (nameOld !== nameUser) {
                                                console.log('mofiddidid');
                                                sendUpdateProfileAll()
                                            }


                                        }}>
                                            <Icon name={modifiname ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.infoCard}>
                                        {modifiname ? (
                                            <ThemedText>{nameUser}</ThemedText>
                                        ) : (
                                            <InputText value={nameUser} onChangeText={(text) => setNameUser(text)} />
                                        )
                                        }
                                    </View>
                                </ThemedView>

                                <AboutSection
                                    titre={t.birthday}
                                    aproposValue={profil?.birthday || ''}
                                    setAproposValue={setbirthday}
                                    modifApropos={modifbirthday}
                                    setModifApropos={setmodifbirthday}
                                />
                                {/* 
                                <ThemedView style={styles.containerInfo}>
                                    <View style={styles.itemTitre}>
                                        <ThemedText type='defaultSemiBold'>{t.email}</ThemedText>
                                        <TouchableOpacity onPress={() => {
                                            setmodifieremail(!modifieremail)
                                            if (emailOld !== emailUser) {
                                                console.log('mofiddidid');
                                                sendUpdateProfileAll()
                                            }


                                        }}>
                                            <Icon name={!modifieremail ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.infoCard}>
                                        {!modifieremail ? (
                                            <ThemedText>{emailUser}</ThemedText>
                                        ) : (
                                            <InputText value={emailUser} onChangeText={(text) => setEmailUser(text)} />
                                        )
                                        }
                                    </View>
                                </ThemedView> */}

                                {/* 
                                <AboutSection
                                    titre={t.genderLabel}
                                    aproposValue={profil?.gender || ''}
                                    setAproposValue={setgenre}
                                    modifApropos={modifigenre}
                                    setModifApropos={setmodifgenre}
                                    isSelector={true}
                                    options={option}
                                /> */}

                                <ThemedView style={styles.containerInfo}>
                                    <View style={styles.itemTitre}>
                                        <ThemedText type='defaultSemiBold'>{t.genderLabel}</ThemedText>
                                        <TouchableOpacity onPress={() => {
                                            setmodifgenre(!modifigenre)
                                        }}>
                                            <Icon name={modifigenre ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.infoCard}>
                                        {modifigenre ? (
                                            <ThemedText>{gender === "1" ? (t.male) : (gender === '2' ? (t.femelle) : (gender === '3' ? (t.lesbienne) : (t.gay)))}</ThemedText>
                                        ) : (<InputSelectorA
                                            titre={t.genderLabel}
                                            options={[{ 'id': '1', 'gender': `${t.male}` }, { 'id': '2', 'gender': `${t.femelle}` }, { 'id': '3', 'gender': `${t.lesbienne}` }, { 'id': '4', 'gender': `${t.gay}` }].map(item => ({
                                                value: item.id,
                                                label: item.gender
                                            }))}
                                            selectedValue={selectedOption}
                                            onValueChange={(value) => {


                                                console.log('id  : ', value);
                                                getProfils()


                                                // sendUpdateProfileAll()
                                                sendUpdateProfileAllGender(value)

                                            }}
                                        />
                                        )
                                        }
                                    </View>
                                </ThemedView>

                            </ThemedView>
                        </ThemedView>
                    )
                }

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


                <ThemedView style={styles.containerInfo}>
                    <View style={styles.itemTitre}>
                        <ThemedText type='defaultSemiBold'>{t.about}</ThemedText>
                        <TouchableOpacity onPress={() => {
                            setmodifierBio(!modifierBio)
                            if (bioOld !== bio) {
                                console.log('mofiddidid');
                                sendUpdateProfile()
                            }


                        }}>
                            <Icon name={!modifierBio ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoCard}>
                        {!modifierBio ? (
                            <ThemedText>{bio}</ThemedText>
                        ) : (
                            <InputText value={bio} onChangeText={(text) => setBio(text)} />
                        )
                        }
                    </View>
                </ThemedView>

                <ThemedView style={styles.containerInfo}>
                    <View style={styles.itemTitre}>
                        <ThemedText type='defaultSemiBold'>{t.ubication}</ThemedText>
                        <TouchableOpacity onPress={() => {
                            setmodifierubication(!modifierubication)
                            if (ubicationold !== ubication) {
                                console.log('mofiddidid');
                                sendUpdateProfileAll()
                            }


                        }}>
                            <Icon name={!modifierubication ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoCard}>
                        {!modifierubication ? (
                            <ThemedText>{ubication}</ThemedText>
                        ) : (
                            <InputText value={ubication} onChangeText={(text) => setubication(text)} />
                        )
                        }
                    </View>
                </ThemedView>

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

                <ThemedView style={styles.containerInfo}>
                    <View style={styles.itemTitre}>
                        <ThemedText type='defaultSemiBold'>{t.langage}</ThemedText>
                        <TouchableOpacity onPress={() => {
                            setmodifierlangue(!modifierlangue)
                        }}>
                            <Icon name={!modifierlangue ? "create-outline" : "checkmark-done-outline"} size={25} color={modifApropos ? COLORS.darkBlue : COLORS.green} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoCard}>
                        {!modifierlangue ? (
                            <ThemedText>{langUser === "1" ? ('Francais') : ('Anglais')}</ThemedText>
                        ) : (<InputSelectorA
                            titre={t.langage}
                            options={[{ 'id': '94', 'lng': 'Englais' }, { 'id': '1', 'lng': 'Francais' }].map(item => ({
                                value: item.id,
                                label: item.lng
                            }))}
                            selectedValue={selectedOption}
                            onValueChange={(value) => {

                                setlangUser(value)
                                console.log('id  : ', value);
                                console.log(langUser);
                                getProfils()

                                sendUpdateProfileAll()
                                sendUpdateProfileAllLang(value)

                            }}
                        />
                        )
                        }
                    </View>
                </ThemedView>

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

                <Modal
                    isVisible={litlemodal}
                    onBackdropPress={() => !litlemodal}
                    style={styles.modal}
                >

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
    sendGiftText: {
        color: 'white',
        fontSize: 18,
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
    alertOk: {
        position: 'absolute',
        width: 30,
        height: 30,
        top: 50,
        right: 10,
        zIndex: 1000

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


function launchImageLibrary(arg0: { mediaType: string; }, arg1: (response: any) => Promise<void>) {
    throw new Error('Function not implemented.');
}

