import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { logoutUser } from '@/request/ApiRest';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/userSlice';
import { router } from 'expo-router';

export default function ProfilScreen() {
    const dispatch = useDispatch<AppDispatch>();

    const auth = useSelector((state: RootState) => state.user);

    const handledeConnect = async () => {
        await logoutUser('0')
        dispatch(logout())
        router.replace('/(Auth)/singin')
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Profil</ThemedText>
            </ThemedView>

            <ThemedButton
                onClick={handledeConnect}
                text="Connecte-toi maintenant"
                style={styles.button}
            />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        marginTop: 10,
        backgroundColor: COLORS.jaune,
    },
});
