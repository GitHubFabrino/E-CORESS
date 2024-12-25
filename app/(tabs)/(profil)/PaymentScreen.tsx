import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ActivityIndicator, Text, FlatList, ScrollView, Dimensions } from 'react-native';
import { COLORS } from '@/assets/style/style.color';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { addToSpotlight, discover100, getMatches, getVisitors, initiatePayement, raiseUpF, userProfil } from '@/request/ApiRest';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { translations } from '@/service/translate';
import { ThemedView } from '@/components/ThemedView';
import { color } from 'react-native-elements/dist/helpers';
import { UserProfileInterface } from './interfaceProfile';
import { setLanguage } from '@/store/userSlice';
import Modal from 'react-native-modal/dist/modal';
import { WebView } from 'react-native-webview';

import { useFocusEffect, useRoute } from '@react-navigation/native';


const { height: screenHeight } = Dimensions.get('window');


const PayementScreen: React.FC = () => {
    const router = useRouter();
    const route = useRoute();
    const { userId, type, monthsCommitment, price, packages } = route.params as { userId: string; type: string; monthsCommitment: string; availability: string; duration: string; price: string; packages: string };


    const [soldeUser, setsoldeUser] = useState<number>(0);
    const auth = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
    const t = translations[lang];
    const [loading, setLoading] = useState(true);
    const [profil, setProfil] = useState<UserProfileInterface | null>(null);

    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);


    useEffect(() => {
        initiatePayment()
    }, []);
    useFocusEffect(
        useCallback(() => {

        }, [])
    );

    const initiatePayment = async () => {
        setLoading(true);
        try {
            const response = await initiatePayement(price);
            console.log('responce pay ', response.payment_url);
            setPaymentUrl(response.payment_url);
        } catch (error) {
            console.error(error);
            // Alert.alert('Erreur', 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    if (paymentUrl) {
        // Affiche la page de paiement dans une WebView
        return (

            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/(profil)/MostPopular')}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.bg1} />
                </TouchableOpacity>

                <WebView
                    source={{ uri: paymentUrl }}
                    onNavigationStateChange={(event) => {
                        // Gérez les redirections ou l'état après paiement
                        if (event.url.includes('success')) {
                            // Alert.alert('Succès', 'Paiement effectué avec succès.');
                            setPaymentUrl(null); // Réinitialise après paiement
                        } else if (event.url.includes('cancel')) {
                            // Alert.alert('Annulé', 'Paiement annulé.');
                            setPaymentUrl(null); // Réinitialise après annulation
                        }
                    }}
                />

            </View>


        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading && <ActivityIndicator size="large" color={COLORS.jaune} />
            }
        </View>
    );
};

const styles = StyleSheet.create({



    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: 25
    },
    backButton: {
        padding: 10,
    },

});

export default PayementScreen;
