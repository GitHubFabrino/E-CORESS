import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import { logoutUser } from '@/request/ApiRest';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/userSlice';
import { router } from 'expo-router';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ProfilScreen() {
    const dispatch = useDispatch<AppDispatch>();

    const [isModalOption, setIsModalOption] = useState(false);
    const [isModalParam, setIsModalParam] = useState(false);
    const [isModalGallery, setIsModalGallery] = useState(true);
    const [isModalDeconnexion, setIsModalDec] = useState(false);
    const [isProfil, setisProfil] = useState(true);


    const auth = useSelector((state: RootState) => state.user);

    useFocusEffect(
        useCallback(() => {
            // Réinitialiser l'état des modals
            setIsModalOption(false);
            setIsModalParam(false);
            setIsModalGallery(false);
        }, [])
    );

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
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Profil</ThemedText>
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

            </ThemedView>

            <ThemedView>
                <ThemedText>Profil</ThemedText>
            </ThemedView>


            {
                !isModalGallery && (<ThemedView>
                    <ThemedText>Gellery</ThemedText>
                </ThemedView>)
            }

            {
                isModalParam && (<ThemedView>
                    <ThemedText>Param</ThemedText>
                </ThemedView>)
            }


            <ThemedButton
                onClick={handledeConnect}
                text="Connecte-toi maintenant"
                style={styles.button}
            />


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

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 50,
        marginBottom: 20,
        // marginHorizontal: 5,
        justifyContent: 'space-between',
        // backgroundColor: 'red'
    },
    containerIcon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '30%',
        alignItems: 'center',
        // backgroundColor: 'blue'
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
        justifyContent: 'flex-start', // Place en haut verticalement
        alignItems: 'flex-end',       // Place à droite horizontalement
        marginTop: 50
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '55%',

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
