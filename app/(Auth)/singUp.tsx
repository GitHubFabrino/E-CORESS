import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import ThemedInput from '@/components/input/InputText';
import Modal from 'react-native-modal';

import Input from '@/components/input/InputText';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import ThemedDatePicker from '@/components/input/InputDate';
import GenderSelector from '@/components/input/InputGenreSelector';
import MeetingPreferenceSelector from '@/components/input/InputMeetingPreferenceSelector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingSpinner from '@/components/spinner/LoadingSpinner';
import { getLocal, registerUser, updateCredits, updateCreditsNewUser, userProfil } from '@/request/ApiRest';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { login, setError } from '@/store/userSlice';
import { translations } from '@/service/translate';

interface LocationData {
    name: string; // Nom de la ville
    local_names?: { [key: string]: string };
    lat: string; // Latitude
    lon: string; // Longitude
    country: string; // Code du pays
    state?: string; // État ou région, optionnel
}

interface DataLocalisation {
    data: LocationData[]
}


export default function SignUpScreen() {


    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);

    const t = translations[lang];

    const [name, setName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [emailUser, setEmailUser] = useState<string>('@gmail.com');
    const [passwordUser, setPasswordUser] = useState<string>('123456789');
    const [birthDate, setBirthDate] = useState<Date>(new Date());
    const [adress, setAdress] = useState<string>('');
    const [phoneNumber, setphoneNumber] = useState<string>('123456789');
    const [gender, setGender] = useState<'homme' | 'femme' | null>(null);
    const [selectedPreference, setSelectedPreference] = useState<'homme' | 'femme' | 'lesbienne' | 'gay' | null>(null);

    const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [viewAddressModal, setviewAddressModal] = useState(false);
    const [searchAdd, setSearchAdd] = useState<string>('');
    const [dataLocation, setDataLocation] = useState<LocationData[]>();
    const [Lng, setLng] = useState('');
    const [Lat, setLat] = useState<string>('');
    const [Contry, setContry] = useState<string>('');
    const [City, setCity] = useState<string>('');
    const [errorss, setErrorss] = useState<{ [key: string]: string }>({});



    const viewAddress = () => {
        setviewAddressModal(!viewAddressModal)
    }

    const handleSelectPreference = (preference: 'homme' | 'femme' | 'lesbienne' | 'gay') => {
        setSelectedPreference(preference);
        setIsPreferencesVisible(false);
    };

    const handleToggleShowPreferences = () => {
        setIsPreferencesVisible(!isPreferencesVisible);
    };

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        const fields = [
            { label: t.errors.nameRequired, value: name, placeholder: 'Votre nom ou pseudo', onChange: setName },
            { label: t.errors.firstNameRequired, value: userName, placeholder: 'Votre prénom', onChange: setUserName },
            { label: t.errors.emailRequired, value: emailUser, placeholder: 'Votre email', onChange: setEmailUser },
            { label: t.errors.passwordRequired, value: passwordUser, placeholder: 'Votre mot de passe', onChange: setPasswordUser, isPassword: true },
            { label: t.errors.birthDateRequired, value: birthDate || new Date(), onChange: setBirthDate, isDatePicker: true },
            { label: t.errors.addressRequired, value: adress, placeholder: 'Votre adresse', onChange: setAdress },
            { label: t.errors.genderRequired, value: gender, onChange: setGender, isGenderSelector: true },
            { label: t.errors.preferenceRequired, value: selectedPreference, onChange: setSelectedPreference, isMeetingPreferenceSelector: true }
        ];

        fields.forEach((field) => {
            if (typeof field.value === 'string') {
                if (field.value.trim() === '') {
                    newErrors[field.label] = `${field.label} ${t.errors.required}`;
                } else if (field.label === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    newErrors[field.label] = 'Email invalide';
                } else if (field.isPassword && field.value.length < 8) {  // Check if isPassword exists
                    newErrors[field.label] = t.errors.minPasswordLength;
                }
            } else if (field.value === null) {
                if (field.isGenderSelector) {
                    newErrors[t.errors.genderRequired] = t.errors.genderRequired;
                } else if (field.isMeetingPreferenceSelector) {
                    newErrors[t.errors.preferenceRequired] = t.errors.preferenceRequired;
                }
            } else if (field.isDatePicker && field.value instanceof Date) {
                const age = new Date().getFullYear() - field.value.getFullYear();
                if (age < 18) {
                    newErrors['Date de naissance'] = t.errors.ageRestriction;
                }
            }
        });

        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    console.log("ERRORS : ", errors);

    const cleanInput = () => {
        setName('')
        setUserName('')
        setBirthDate(new Date())
        setAdress('')
        setEmailUser(''
        )
        setGender(null)
        setGender(null)
        setPasswordUser('')
        setIsTermsAccepted(false)
    }

    const handleCreateAccount = async () => {
        if (validateFields() && isTermsAccepted) {
            setIsLoading(true);
            // Préparer les données pour l'API
            const userData = {
                reg_name: name,
                reg_username: userName,
                reg_email: emailUser,
                reg_pass: passwordUser,
                reg_birthday: formatDate(birthDate), // Formater la date ici
                reg_gender: gender || null,
                reg_looking: selectedPreference || null,
                reg_city: City,
                reg_country: Contry,
                reg_lat: Lat,
                reg_lng: Lng,
                reg_photo: '',
                reg_thumb: '',
                reg_phone_number: phoneNumber,
                dID: '0'

            };
            console.log('USERDATA', userData);
            try {
                // Inscription de l'utilisateur
                const response = await registerUser(userData);

                if (response.error === 1) {
                    setErrors({
                        "Nom ou pseudo": "Nom ou pseudo est déjà pris",
                        "Email": "Email déjà pris"
                    });
                    setIsLoading(false);
                    dispatch(setError(response));
                    return;
                }

                if (response.error === 0) {
                    // Succès de l'inscription
                    setIsLoading(false);
                    dispatch(login(response));
                    cleanInput();
                    console.log('ID utilisateur:', response.user.id);

                    let userCredits = 0;
                    const maxRetries = 3; // Limiter les tentatives de mise à jour
                    let retryCount = 0;

                    while (userCredits === 0 && retryCount < maxRetries) {
                        await updateCreditsNewUser(response.user.id); // Mise à jour des crédits
                        const profileResponse = await userProfil(response.user.id);
                        userCredits = parseInt(profileResponse.user.credits, 10) || 0;
                        retryCount++;
                    }

                    if (userCredits === 120) {
                        console.log("Mise à jour réussie. Redirection...");
                        router.replace('/(tabs)/');
                    } else {
                        console.warn("La mise à jour des crédits a échoué après plusieurs tentatives.", userCredits);
                    }
                }

                console.log('Données utilisateur retournées par l’API:', response);
            } catch (error) {
                console.error('Erreur lors de l’inscription:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }


        } else {
            setErrors((prev) => ({ ...prev, termsAccepted: t.errors.termsAccepted }));
        }
    };
    const sendSearch = async (search: string) => {
        try {
            setIsLoadingSearch(true)
            const response = await getLocal(search)
            console.log('RESPONSE GET LOCAL ', response);
            setDataLocation(response)

        } catch (error) {

        } finally {
            setIsLoadingSearch(false)
        }
        console.log(dataLocation);

    }

    // Fonction de validation
    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10}$/; // Vérifie si le numéro contient exactement 10 chiffres
        return phoneRegex.test(phone);
    };

    // Gestionnaire de saisie
    const handlePhoneNumberChange = (phone: string) => {
        setphoneNumber(phone);

        // Validation dynamique
        if (!validatePhoneNumber(phone)) {
            setErrorss(prevErrors => ({
                ...prevErrors,
                phone: 'Le numéro de téléphone doit contenir exactement 10 chiffres.'
            }));
        } else {
            setErrors(prevErrors => {
                const { phone, ...rest } = prevErrors; // Supprime l'erreur de téléphone
                return rest;
            });
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff' }}
        // height={100}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.textColor}>
                    {t.createAccount} E-coress
                </ThemedText>
            </ThemedView>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View>
                    <ThemedInput
                        label={t.name}
                        value={name}
                        placeholder={t.namePlaceholder}
                        onChangeText={setName}
                        error={errors[t.errors.nameRequired]}
                    />
                    <ThemedInput
                        label={t.firstName}
                        value={userName}
                        placeholder={t.firstNamePlaceholder}
                        onChangeText={setUserName}
                        error={errors[t.errors.firstNameRequired]}
                    />
                    <ThemedInput
                        label={t.email}
                        value={emailUser}
                        placeholder={t.placeholderEmail}
                        onChangeText={setEmailUser}
                        error={errors[t.errors.emailRequired]}
                    />
                    <ThemedInput
                        label={'Phone'}
                        value={phoneNumber}
                        placeholder={t.phonePlace}
                        onChangeText={handlePhoneNumberChange}
                        error={errorss.phone}
                    />
                    <ThemedInput
                        label={t.password}
                        value={passwordUser}
                        placeholder={t.passwordPlaceholder}
                        onChangeText={setPasswordUser}
                        isPassword={true}
                        error={errors[t.errors.phoneRequired]}
                    />
                    <ThemedDatePicker
                        label={t.birthDateLabel}
                        value={birthDate || new Date()}
                        onChange={setBirthDate}
                        error={errors[t.errors.birthDateRequired]}
                    />

                    <View>
                        <ThemedText type='defaultSemiBold' style={{ color: COLORS.bg1 }}>{t.address}</ThemedText>
                        <TouchableOpacity onPress={() => viewAddress()} style={styles.addressbtn}>
                            {adress === '' ? (<ThemedText style={{ color: COLORS.text2 }}>{t.addressPlaceholder}</ThemedText>) : (<ThemedText style={{ color: COLORS.text2 }}>{adress}</ThemedText>)}
                        </TouchableOpacity>
                    </View>
                    <GenderSelector
                        selectedGender={gender}
                        onSelectGender={setGender}
                        error={errors[t.errors.genderRequired]}
                        lang={lang}
                    />
                    <MeetingPreferenceSelector
                        selectedPreference={selectedPreference}
                        onSelectPreference={handleSelectPreference}
                        onToggleShowPreferences={handleToggleShowPreferences}
                        isPreferencesVisible={isPreferencesVisible}
                        error={errors[t.errors.preferenceRequired]}
                        lang={lang}
                    />
                </View>
                <View style={styles.termsContainer}>
                    <TouchableOpacity onPress={() => setIsTermsAccepted(!isTermsAccepted)} style={styles.checkboxContainer}>
                        <Icon name={isTermsAccepted ? 'check-box' : 'check-box-outline-blank'} size={24} color={COLORS.bg1} />
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                        {t.termsText}
                        <Text style={styles.link} onPress={() => {/* Navigate to terms and conditions */ }}>{t.termsText1}</Text>
                    </Text>
                </View>
                {errors['termsAccepted'] && <Text style={styles.errorText}>{errors['termsAccepted']}</Text>}

                <ThemedButton
                    onClick={handleCreateAccount}
                    text={t.createAccountButton}
                    style={{ marginTop: 30 }}
                />

                <ThemedView style={styles.accountContainer}>
                    <ThemedText style={styles.textContainer}>{t.alreadyHaveAccount1}</ThemedText>
                    <Link href="/(Auth)/singin">
                        <ThemedText type="link" style={styles.link}>
                            {t.singIn}
                        </ThemedText>
                    </Link>
                </ThemedView>
            </ScrollView>

            <LoadingSpinner isVisible={isLoading} text={t.loading} size={60} />


            <Modal
                isVisible={viewAddressModal} // Supprimé le commentaire inutile
                onBackdropPress={viewAddress} // Assurez-vous que `viewAddress` est bien défini
                style={styles.modal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.flex}>
                            <View style={styles.btn}>
                                <Input label={t.addressPlaceholder} value={searchAdd} onChangeText={setSearchAdd} />
                            </View>
                            <TouchableOpacity onPress={() => sendSearch(searchAdd)} style={styles.searchbtn} >
                                <Icon name="search" size={25} color={COLORS.bg1} />
                            </TouchableOpacity>
                        </View>

                        {isLoadingSearch ? (<LoadingSpinner isVisible={isLoadingSearch} text={t.loading} size={60} />) : (

                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                {dataLocation?.length === 0 ? (
                                    <ThemedText type="default">No locations available.</ThemedText>
                                ) : (
                                    dataLocation?.map((item, index) => (
                                        <TouchableOpacity onPress={() => {
                                            setAdress(item?.local_names?.fr || item.name)
                                            setLng(item?.lon)
                                            setLat(item.lat)
                                            setContry(item.country)
                                            setCity(item?.local_names?.fr || item.name)
                                            viewAddress()
                                        }} key={index}>
                                            <View style={styles.card}>
                                                <View style={styles.local}>
                                                    <ThemedText
                                                        type="default"
                                                        style={{ fontSize: 12, color: COLORS.bg1, fontWeight: '500' }}
                                                    >
                                                        {item?.country || 'Unknown State'}
                                                    </ThemedText>
                                                </View>
                                                <View style={styles.btnLocal}>
                                                    <ThemedText type="defaultSemiBold2" style={styles.text} >
                                                        {item.local_names?.fr || item.name}
                                                    </ThemedText>
                                                    <ThemedText type="defaultSemiBold2" style={styles.text2} >
                                                        {item.state}
                                                    </ThemedText>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        )}



                    </View>

                </View>

            </Modal>




        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    searchbtn: {
        position: 'absolute',
        bottom: 10,
        right: 0
    },
    btnLocal: {
        fontSize: 15,
        color: COLORS.bg1,
        backgroundColor: COLORS.bg2,
        width: '90%',
        padding: 5,
        borderRadius: 10,
        paddingHorizontal: 10
    },
    text: {
        fontSize: 16,
        color: COLORS.bg1,
    },
    text2: {
        fontSize: 12,
        color: COLORS.text2,
    },
    local: {
        display: 'flex',
        flexDirection: 'row',
        // padding: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg4,
        borderRadius: 50,
        marginRight: 20
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 10,
        // justifyContent: 'space-around',
        alignItems: 'center'


    },
    btn: {
        width: '90%',
        // backgroundColor: 'red'
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    filterModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%'
        // maxHeight: '80%',
    },
    input: {
        flex: 1,
        fontSize: 16,
        width: '100%',
        backgroundColor: 'red',
        height: '10%'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        height: 500

    },
    modal: {
        justifyContent: 'center',
        // alignItems: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        padding: 0,
        borderRadius: 10,
    },
    addressbtn: {
        borderWidth: 2,
        // borderBlockColor:
        borderColor: COLORS.bg5,
        borderRadius: 10,
        padding: 10
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 50,
    },
    accountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
    },
    textContainer: {
        color: COLORS.bg1,
        marginHorizontal: 5,
    },
    titleContainer: {
        paddingVertical: 30,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textColor: {
        color: COLORS.bg1,
        textAlign: 'center'
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    checkboxContainer: {
        marginRight: 8,
    },
    termsText: {
        fontSize: 12,
        textAlign: 'center',
        width: '90%'
    },
    link: {
        color: COLORS.jaune,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});


