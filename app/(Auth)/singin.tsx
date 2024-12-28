import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import ThemedInput from '@/components/input/InputText';
import ThemedButton from '@/components/button/Button';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/assets/style/style.color';
import { LogoWave } from '@/components/LogoWave';
import LoadingSpinner from '@/components/spinner/LoadingSpinner';
import ForgotPasswordModal from '@/components/Modal/ForgotPasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { login, logout, setActiveMethod, setError, setLanguage } from '@/store/userSlice';
import { authenticateUser, fetchUserData } from '@/request/ApiRest';
import { translations } from '@/service/translate';
// import { router } from 'expo-router';

export default function SignInScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);

    const t = translations[lang];

    const [emailUser, setEmailUser] = useState('faly@gmail.com');
    const [phoneUser, setPhoneUser] = useState('');
    const [fbUser, setFbUser] = useState('');
    const [passwordUser, setPasswordUser] = useState('123456789');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');
    const [isFb, setisFb] = useState(auth.isFb);



    useEffect(() => {
        setLang(auth.lang);


    }, [auth.user, auth.lang]);

    const validateForm = () => {
        let valid = true;

        if (isEmailsend == true || isPhonesend == true) {
            setErrors('');
            valid = true;
        } else {
            setErrors(t.emailOrPhoneError);
            valid = false;

        }

        if (passwordUser.trim() === '') {
            setErrorPwd(t.requiredPassword);
            valid = false;
        } else {
            setErrorPwd('');
        }

        return valid;
    };

    const [emailOrPhone, setEmailOrPhone] = useState('faly@gmail.com');
    const [errors, setErrors] = useState('');
    const [isEmailsend, setisEmailsend] = useState(false);
    const [isPhonesend, setisPhonesend] = useState(false);
    // Fonction de validation
    const validateInput = (input: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Vérifie si c'est un email valide
        const phoneRegex = /^[0-9]{10}$/; // Vérifie si c'est un numéro de téléphone à 10 chiffres


        if (emailRegex.test(input)) {
            setisEmailsend(true)
            setisPhonesend(false)
            return true; // Email valide
        } else if (phoneRegex.test(input)) {
            setisEmailsend(false)
            setisPhonesend(true)
            return true; // Téléphone valide
        } else {
            return false; // Ni email ni téléphone valide
        }
    };

    // Gestionnaire de changement de texte
    const handleInputChange = (input: string) => {
        setEmailOrPhone(input);

        // Validation dynamique
        if (!validateInput(input)) {
            setErrors(t.emailOrPhoneError);
        } else {
            setErrors(''); // Aucune erreur
        }
    };

    const handleConnect = async () => {
        if (validateForm()) {
            setIsLoading(true);
            if (isEmailsend || isPhonesend) {
                try {
                    setEmailUser(emailOrPhone)
                    const response = await authenticateUser(emailOrPhone, passwordUser, isEmailsend);

                    console.log("REPOSNSE LOGIN", response);

                    if (response.error === 0) {

                        await dispatch(login(response));
                        console.log('response login ', response.user.lang_prefix);
                        if (response.user.lang_prefix === 'en') {
                            dispatch(setLanguage('EN'))
                        } else {
                            dispatch(setLanguage('FR'))
                        }

                        const targetRoute = response.user.profile_photo ? '/(tabs)/' : '/importImage';
                        router.replace(targetRoute);

                    } else if (response.error === 1) {

                        setErrorEmail(t.invalidEmail);
                        setErrorPwd(t.requiredPassword);
                        dispatch(setError(response));

                        throw new Error(response.error_m);
                    }

                } catch (error) {
                    console.error('Error during authentication:', error);
                    dispatch(logout());
                } finally {
                    setIsLoading(false);
                }
            }

        }
    };

    const handleForgotPassword = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleForgotPasswordSubmit = (email: string) => {
        console.log('Demande de réinitialisation envoyée pour :', email);
        setModalVisible(false);
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff' }}
            headerImage={<LogoWave />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.textColor}>
                    {t.login}
                </ThemedText>
            </ThemedView>

            <ThemedInput
                label={t.emailOrPhone}
                value={emailOrPhone}
                placeholder={t.placeholderEmailOrPhone}
                onChangeText={handleInputChange}
                error={errors} // Affiche l'erreur si présente
            />

            {isFb && <ThemedInput
                label={t.facebook}
                value={fbUser}
                placeholder={t.facebook}
                onChangeText={setFbUser}
                style={styles.textColor}
                error={errorEmail}
            />}

            <ThemedInput
                label={t.password}
                value={passwordUser}
                placeholder={t.password}
                onChangeText={setPasswordUser}
                isPassword
                style={styles.textColor}
                error={errorPwd}
            />

            <Pressable onPress={handleForgotPassword}>
                <ThemedView style={styles.forgotPwd}>
                    <ThemedText type="link" style={styles.link}>
                        {t.forgotPassword}
                    </ThemedText>
                </ThemedView>
            </Pressable>


            <ThemedButton
                onClick={handleConnect}
                text={t.login}
                style={styles.button}
            />

            {/* <ThemedView style={styles.container}>
                <TouchableOpacity onPress={() => {
                    dispatch(setActiveMethod('email'));
                    router.navigate('/(Auth)/singin')
                    setisEmail(true)
                    setisPhone(false)
                }}  >
                    <IconMaterial name="gmail" size={25} color={COLORS.darkBlue} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    dispatch(setActiveMethod('phone'));
                    router.navigate('/(Auth)/singin')
                    setisPhone(true)
                    setisEmail(false)
                }}  >
                    <IconMaterial name="phone" size={25} color={COLORS.darkBlue} />
                </TouchableOpacity>
            </ThemedView> */}

            <ThemedView style={styles.accountContainer}>
                <ThemedText style={styles.textContainer}>{t.alreadyHaveAccount}</ThemedText>
                <Link href="/(Auth)/singUp">
                    <ThemedText type="link" style={styles.link}>
                        {t.signUp}
                    </ThemedText>
                </Link>
            </ThemedView>

            {isLoading && <LoadingSpinner isVisible={isLoading} text={t.loading} size={60} />}

            <ForgotPasswordModal
                visible={modalVisible}
                onClose={handleModalClose}
                onSubmit={handleForgotPasswordSubmit}
            />

            {/* <ThemedButton
                onClick={() => {
                    router.navigate('/');
                }}
                text="intro"
                style={{ backgroundColor: "#F4B20A", marginTop: 50, color: '#232B57' }}
            /> */}
        </ParallaxScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        alignItems: 'center',
        alignSelf: 'center'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    accountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
    },
    forgotPwd: {
        alignSelf: 'flex-end',

    },
    textColor: {
        color: COLORS.bg1,
    },
    textContainer: {
        color: COLORS.bg1,
        marginHorizontal: 5,
    },
    link: {
        color: COLORS.jaune,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
        backgroundColor: COLORS.jaune,
    },
});
