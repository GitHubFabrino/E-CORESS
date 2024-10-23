import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import ThemedInput from '@/components/input/InputText';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import ThemedDatePicker from '@/components/input/InputDate';
import GenderSelector from '@/components/input/InputGenreSelector';
import MeetingPreferenceSelector from '@/components/input/InputMeetingPreferenceSelector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingSpinner from '@/components/spinner/LoadingSpinner';
import { registerUser } from '@/request/ApiRest';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { login, setError } from '@/store/userSlice';
import { translations } from '@/service/translate';

export default function SignUpScreen() {


    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);

    const t = translations[lang];

    const [name, setName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [emailUser, setEmailUser] = useState<string>('');
    const [passwordUser, setPasswordUser] = useState<string>('');
    const [birthDate, setBirthDate] = useState<Date>(new Date());
    const [adress, setAdress] = useState<string>('');
    const [gender, setGender] = useState<'homme' | 'femme' | null>(null);
    const [selectedPreference, setSelectedPreference] = useState<'homme' | 'femme' | 'lesbienne' | 'gay' | null>(null);

    const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

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

        // fields.forEach((field) => {
        //     if ('value' in field && typeof field.value === 'string') {
        //         if (field.value.trim() === '') {
        //             newErrors[field.label] = `${field.label} ${t.errors.required}`;
        //         } else if (field.label === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        //             newErrors[field.label] = 'Email invalide';
        //         } else if (t.errors.passwordRequired in field && field.isPassword && field.value.length < 8) {
        //             newErrors[field.label] = t.errors.minPasswordLength
        //         }
        //     } else if (t.errors.genderRequired in field && field.value === null) {
        //         newErrors[t.errors.genderRequired] = t.errors.genderRequired;
        //     } else if (field.isMeetingPreferenceSelector in field && field.value === null) {
        //         newErrors[t.errors.preferenceRequired] = t.errors.preferenceRequired;
        //     } else if ('isDatePicker' in field && field.value instanceof Date) {
        //         const age = new Date().getFullYear() - field.value.getFullYear();
        //         if (age < 18) {
        //             newErrors['Date de naissance'] = t.errors.ageRestriction;
        //         }
        //     }
        // });

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
                reg_city: adress,

            };
            console.log('USERDATA', userData);

            try {
                const response = await registerUser(userData)
                if (response.error === 1) {
                    setErrors({ "Nom ou pseudo": "Nom ou pseudo est déjà pris", "Email": "Email déjà pris" })
                    setIsLoading(false);
                    dispatch(setError(response));
                }
                if (response.error === 0) {
                    setIsLoading(false);
                    dispatch(login(response));
                    cleanInput();
                    router.replace('/(tabs)/')
                }

                console.log('USERDATA RETURN API ', response);
            } catch (error) {
                console.error('error', error);

                throw error;
            }
            setTimeout(() => {
                setIsLoading(false);
                //  router.navigate('/importImage');
            }, 2000);
        } else {
            setErrors((prev) => ({ ...prev, termsAccepted: t.errors.termsAccepted }));
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff' }}
            height={100}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.textColor}>
                    {t.createAccount}
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
                        label={t.password}
                        value={passwordUser}
                        placeholder={t.passwordPlaceholder}
                        onChangeText={setPasswordUser}
                        isPassword={true}
                        error={errors[t.errors.passwordRequired]}
                    />
                    <ThemedDatePicker
                        label={t.birthDateLabel}
                        value={birthDate || new Date()}
                        onChange={setBirthDate}
                        error={errors[t.errors.birthDateRequired]}
                    />

                    <ThemedInput
                        label={t.address}
                        value={adress}
                        placeholder={t.addressPlaceholder}
                        onChangeText={setAdress}
                        error={errors[t.errors.addressRequired]}
                    />
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
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
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


