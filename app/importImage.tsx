import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

export default function ImportImageScreen() {
    const [selectedImage, setSelectedImage] = useState<string | undefined>();

    const addPhoto = () => {
        if (selectedImage) {
            router.navigate('/(tabs)/')
        }

    }

    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Désolé, nous avons besoin des permissions pour accéder à vos photos !');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };


    return (
        <ThemedView style={styles.container}>
            <Image
                source={require('../assets/images/ecoress.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.addContainer} accessible={true} accessibilityLabel="Ajouter une photo">

                {
                    selectedImage ? (
                        <Pressable onPress={() => openImagePicker()}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={{ width: 250, height: 250, borderRadius: 125, }}
                                resizeMode="cover"
                            />
                        </Pressable>

                    ) : (<View style={styles.add}>
                        <Pressable onPress={() => openImagePicker()} style={styles.add}>
                            <Icon name="add" size={35} color={COLORS.bg1} />
                            <Text style={styles.textAddImage}>Ajouter une photo</Text>
                        </Pressable>

                    </View>)
                }
            </View>

            <ThemedView style={styles.titleContainer}>
                <ThemedText type="defaultSemiBold">IMPORTER VOTRE MEILLEURE PHOTO</ThemedText>
            </ThemedView>

            <View style={styles.containerText}>
                <Text style={styles.text}>
                    L'ajout de photos est la meilleure façon de montrer votre personnalité
                </Text>
            </View>

            {selectedImage && <ThemedButton
                onClick={addPhoto}
                text="Ajouter une photo"
                style={styles.addButton}
            />}

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: '100%',
        height: 50,
        marginVertical: 30,
    },
    addContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 50,
        borderWidth: 2,
        borderColor: COLORS.grayOne,
        height: 250,
        width: 250,
        borderRadius: 125,
        backgroundColor: COLORS.grayOne,
    },
    add: {
        alignItems: 'center'
    },
    textAddImage: {
        fontSize: 15,
        alignSelf: 'center',
        color: COLORS.bg1,
        marginVertical: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 20,
    },
    containerText: {
        alignContent: 'center',
        justifyContent: 'center',
        padding: 5,
        alignItems: 'center',
        height: 60,
    },
    text: {
        fontSize: 15,
        color: COLORS.bg1,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: COLORS.bg1,
        marginTop: 30,
        color: '#232B57',
    },
});
