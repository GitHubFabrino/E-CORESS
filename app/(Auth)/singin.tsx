import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import ThemedInput from '@/components/input/InputText';
import { useState } from 'react';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { LogoWave } from '@/components/LogoWave';

export default function SingInScreen() {
    const [emailUser, setEmailUser] = useState('');
    const [passwordUser, setPasswordUser] = useState('');
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#fff', dark: '#1D3D47' }}
            headerImage={<LogoWave />}>

            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.textColor}>Connecte-toi maintenant</ThemedText>
            </ThemedView>
            <ThemedInput label="Email"
                value={emailUser}
                placeholder="Votre email"
                onChangeText={setEmailUser}
                style={styles.textColor}
            />
            <ThemedInput label="Mot de passe"
                value={passwordUser}
                placeholder="Votre mot de passe"
                onChangeText={setPasswordUser}
                isPassword
                style={styles.textColor}
            />

            <ThemedButton onClick={() => { router.navigate('/(tabs)/') }} text={'Connecte-toi maintenant'} style={{ marginTop: 30, color: '#232B57' }} />

            <ThemedView style={styles.Container}>
                <ThemedText style={styles.textContainer}>Avez-vous déjà un compte?</ThemedText>
                <Link href="/(Auth)/singUp" >
                    <ThemedText type="link" style={styles.link}>S'inscrire</ThemedText>
                </Link>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    Container: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    reactLogo: {
        height: 200,
        width: 200,
        alignSelf: 'center',
        marginTop: 50
    },
    textColor: {
        color: COLORS.bg1
    },
    textContainer: {
        color: COLORS.bg1,
        marginHorizontal: 5
    },
    link: {
        color: COLORS.jaune,
        fontWeight: 'bold'
    }

});
