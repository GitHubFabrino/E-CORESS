import React, { useState } from 'react';
import { StyleSheet, Dimensions, FlatList, View, Image, TouchableOpacity, TextInput, Text, BackHandler, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CardItem from '@/components/card/CardItem';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/assets/style/style.color';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Input from '@/components/input/InputText';
import { useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

interface CardData {
    id: string;
    imageSources: any[];
    name: string;
    address: string;
    isOnline: boolean;
}



const { width } = Dimensions.get('window');
const itemWidth = 150;
const getNumColumns = () => Math.floor(width / itemWidth);

export default function AproximiteScreen() {


    const transformApiData = (apiData: any[]): CardData[] => {
        return apiData.map((item) => ({
            id: item.id,
            imageSources: [item.photo, item.spotPhoto],  // Vous pouvez ajouter d'autres sources d'images si nécessaire
            name: item.name,
            address: item.city || 'Location unknown',  // Remplacez par la ville ou une valeur par défaut
            isOnline: item.status === 1,  // Transformer le statut en booléen (en ligne ou hors ligne)
        }));
    };
    const dispatch = useDispatch<AppDispatch>();

    const auth = useSelector((state: RootState) => state.user);
    const data: CardData[] = transformApiData(auth.spotlight.spotlight)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CardData | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [filteredData, setFilteredData] = useState<CardData[]>(data);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [gender, setGender] = useState('');
    const [maxAge, setMaxAge] = useState(80);
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [distance, setDistance] = useState(20);
    const toggleModal = (item: CardData) => {
        setSelectedItem(item);
        setCurrentImageIndex(0);
        setIsModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const handleNextImage = () => {
        if (selectedItem) {
            const nextIndex = (currentImageIndex + 1) % selectedItem.imageSources.length;
            setCurrentImageIndex(nextIndex);
        }
    };

    const handlePreviousImage = () => {
        if (selectedItem) {
            const prevIndex = (currentImageIndex - 1 + selectedItem.imageSources.length) % selectedItem.imageSources.length;
            setCurrentImageIndex(prevIndex);
        }
    };

    const showAllUsers = () => {
        setFilteredData(data);
    };

    const showOnlineUsers = () => {
        const onlineUsers = data.filter((user) => user.isOnline);
        setFilteredData(onlineUsers);
    };
    const toggleFilterModal = () => {
        setIsFilterModalVisible(!isFilterModalVisible);
    };

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const onBackPress = () => {
    //             return true; // Retourne true pour empêcher le retour
    //         };

    //         BackHandler.addEventListener('hardwareBackPress', onBackPress);

    //         // Nettoyage de l'écouteur lorsque le composant est démonté
    //         return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     }, [])
    // );

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">A proximité</ThemedText>
                <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
                    <Icon name="filter" size={30} color={COLORS.darkBlue} />
                </TouchableOpacity>
            </ThemedView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={showAllUsers} style={styles.button}>
                    <ThemedText type='defaultSemiBold'>Tous les utilisateurs</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={showOnlineUsers} style={styles.button}>
                    <ThemedText type='defaultSemiBold'>Maintenant en ligne</ThemedText>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredData}
                renderItem={({ item }: { item: CardData }) => (
                    <TouchableOpacity onPress={() => toggleModal(item)} style={styles.cardItem} activeOpacity={0.7}>
                        <View>
                            <CardItem
                                imageSource={{ uri: item.imageSources[0] }}
                                name={item.name}
                                address={item.address}
                                onligne={item.isOnline}
                            />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={getNumColumns()}
                columnWrapperStyle={styles.columnWrapper}
            />

            {selectedItem && (
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={closeModal}
                    style={styles.modal}
                >
                    <View style={styles.modalContent}>
                        <Image
                            source={{ uri: selectedItem.imageSources[currentImageIndex] }}
                            style={styles.modalImage}
                            resizeMode="cover"
                        />
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalHeader}>
                                <ThemedText type="title" style={styles.modalName}>
                                    {selectedItem.name}
                                </ThemedText>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Icon name="close" size={30} color={COLORS.bg1} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.navButton} onPress={handlePreviousImage}>
                                    <Icon name="chevron-back" size={24} color={COLORS.bg1} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.messageButton}>
                                    <Icon name="chatbubble-outline" size={30} color={COLORS.white} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.navButton} onPress={handleNextImage}>
                                    <Icon name="chevron-forward" size={24} color={COLORS.bg1} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <Modal
                isVisible={isFilterModalVisible}
                onBackdropPress={toggleFilterModal}
                style={styles.modal}
            >
                <View style={styles.filterModalContent}>
                    <ThemedText type='defaultSemiBold'>Montre-moi</ThemedText>
                    <Picker
                        selectedValue={gender}
                        style={styles.picker}
                        onValueChange={(itemValue: React.SetStateAction<string>) => setGender(itemValue)}
                    >
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Femelle" value="female" />
                        <Picker.Item label="Gay" value="gay" />
                        <Picker.Item label="Lesbienne" value="lesbian" />
                    </Picker>

                    <View style={styles.filterRange}>
                        <ThemedText type='defaultSemiBold'>Âge</ThemedText>
                        <View style={styles.cardAge}>
                            <ThemedText type='defaultSemiBold'>18</ThemedText>
                            <Slider
                                style={styles.slider}
                                minimumValue={18}
                                maximumValue={80}
                                step={1}
                                value={maxAge}
                                onValueChange={(value: React.SetStateAction<number>) => setMaxAge(value)}
                            />
                            <ThemedText type='defaultSemiBold'>{maxAge}</ThemedText>
                        </View>
                    </View>
                    <Input label={'Recherche par email'} value={email} onChangeText={setEmail} />

                    <View style={styles.filterRange}>
                        <Input label={'Localisation'} value={location} placeholder='Localisation inconnue' onChangeText={setLocation} />
                        <ThemedText type='defaultSemiBold'>{distance} KM</ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={50}
                            step={1}
                            value={distance}
                            onValueChange={(value: React.SetStateAction<number>) => setDistance(value)}
                        />
                    </View>

                    <TouchableOpacity onPress={toggleFilterModal} style={styles.applyButton}>
                        <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
                    </TouchableOpacity>
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
        marginTop: 70,
        marginBottom: 20,
        marginHorizontal: 20,
        justifyContent: 'space-between'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    cardItem: {
        width: itemWidth,
        marginBottom: 10,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: 'transparent',
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        backgroundColor: COLORS.darkBlue,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    closeButton: {
        backgroundColor: 'transparent',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        backgroundColor: COLORS.white,
        borderRadius: 50,
        padding: 10,
    },
    messageButton: {
        backgroundColor: COLORS.bg1,
        borderRadius: 50,
        padding: 20,
    },
    filterButton: {
        padding: 10,
    },

    filterModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%'
        // maxHeight: '80%',
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',


    },
    filterRange: {
        marginVertical: 10,
    },
    cardAge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slider: {
        width: '80%',
        marginVertical: 5,
    },
    filterInput: {
        borderColor: COLORS.lightGray,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
    applyButton: {
        backgroundColor: COLORS.jaune,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

