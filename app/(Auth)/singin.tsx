import React, { useState } from 'react';
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

export default function SignInScreen() {
    const [emailUser, setEmailUser] = useState('');
    const [passwordUser, setPasswordUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');

    const validateForm = () => {
        let valid = true;

        if (emailUser.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailUser)) {
            setErrorEmail("L'email est requis et doit être valide");
            valid = false;
        } else {
            setErrorEmail('');
        }

        if (passwordUser.trim() === '') {
            setErrorPwd("Le mot de passe est requis");
            valid = false;
        } else {
            setErrorPwd('');
        }

        return valid;
    };

    const handleConnect = () => {
        if (validateForm()) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                // router.replace('/(tabs)/');
                router.replace('/importImage');

            }, 2000);
        }
    };

    const handleForgotPassword = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleForgotPasswordSubmit = (email: string) => {
        // Remplacez cette fonction par l'envoi de la demande de réinitialisation du mot de passe
        console.log('Demande de réinitialisation envoyée pour :', email);
        setModalVisible(false);
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff', dark: '#1D3D47' }}
            headerImage={<LogoWave />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.textColor}>
                    Connecte-toi maintenant
                </ThemedText>
            </ThemedView>

            <ThemedInput
                label="Email"
                value={emailUser}
                placeholder="Votre email"
                onChangeText={setEmailUser}
                style={styles.textColor}
                error={errorEmail}
            />
            <ThemedInput
                label="Mot de passe"
                value={passwordUser}
                placeholder="Votre mot de passe"
                onChangeText={setPasswordUser}
                isPassword
                style={styles.textColor}
                error={errorPwd}
            />

            <Pressable onPress={handleForgotPassword}>
                <ThemedView style={styles.forgotPwd}>
                    <ThemedText type="link" style={styles.link}>
                        Mot de passe oublié ?
                    </ThemedText>
                </ThemedView>
            </Pressable>

            <ThemedButton
                onClick={handleConnect}
                text="Connecte-toi maintenant"
                style={styles.button}
            />

            <ThemedView style={styles.accountContainer}>
                <ThemedText style={styles.textContainer}>Avez-vous déjà un compte?</ThemedText>
                <Link href="/(Auth)/singUp">
                    <ThemedText type="link" style={styles.link}>
                        S'inscrire
                    </ThemedText>
                </Link>
            </ThemedView>

            {isLoading && <LoadingSpinner isVisible={isLoading} text="En cours de chargement..." size={60} />}

            <ForgotPasswordModal
                visible={modalVisible}
                onClose={handleModalClose}
                onSubmit={handleForgotPasswordSubmit}
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
