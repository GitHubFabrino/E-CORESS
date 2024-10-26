import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import ThemedInput from '@/components/input/InputText';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { LogoWave } from '@/components/LogoWave';
import LoadingSpinner from '@/components/spinner/LoadingSpinner';
import ForgotPasswordModal from '@/components/Modal/ForgotPasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { login, logout, setError, setLanguage } from '@/store/userSlice';
import { authenticateUser, fetchUserData } from '@/request/ApiRest';
import { translations } from '@/service/translate';


export default function SignInScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);

    const t = translations[lang];

    const [emailUser, setEmailUser] = useState('andry@gmail.com');
    const [phoneUser, setPhoneUser] = useState('');
    const [fbUser, setFbUser] = useState('');
    const [passwordUser, setPasswordUser] = useState('123456789');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');

    const [isEmail, setisEmail] = useState(auth.isEmail);
    const [isPhone, setisPhone] = useState(auth.isPhone);
    const [isFb, setisFb] = useState(auth.isFb);



    useEffect(() => {
        setLang(auth.lang);


    }, [auth.user, auth.lang]);

    const validateForm = () => {
        let valid = true;

        if (emailUser.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailUser)) {
            setErrorEmail(t.invalidEmail);
            valid = false;
        } else {
            setErrorEmail('');
        }

        if (passwordUser.trim() === '') {
            setErrorPwd(t.requiredPassword);
            valid = false;
        } else {
            setErrorPwd('');
        }

        return valid;
    };

    const handleConnect = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await authenticateUser(emailUser, passwordUser);

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

            {isEmail && <ThemedInput
                label={t.email}
                value={emailUser}
                placeholder={t.email}
                onChangeText={setEmailUser}
                style={styles.textColor}
                error={errorEmail}
            />}

            {isPhone && <ThemedInput
                label={t.phone}
                value={phoneUser}
                placeholder={t.phone}
                onChangeText={setPhoneUser}
                style={styles.textColor}
                error={errorEmail}
            />}

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

            <ThemedButton
                onClick={() => {
                    router.navigate('/');
                }}
                text="intro"
                style={{ backgroundColor: "#F4B20A", marginTop: 50, color: '#232B57' }}
            />
        </ParallaxScrollView>
    );
}
const styles = StyleSheet.create({
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
