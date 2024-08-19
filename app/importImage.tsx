import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ImportImageScreen() {

    return (
        <ThemedView style={styles.container}>
            <Image
                source={require('../assets/images/ecoress.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.addContainer} accessible={true} accessibilityLabel="Ajouter une photo">
                <Icon name="add" size={35} color={COLORS.bg1} />
                <Text style={styles.textAddImage}>Ajouter une photo</Text>
            </View>

            <ThemedView style={styles.titleContainer}>
                <ThemedText type="defaultSemiBold">IMPORTER VOTRE MEILLEURE PHOTO</ThemedText>
            </ThemedView>

            <View style={styles.containerText}>
                <Text style={styles.text}>
                    L'ajout de photos est la meilleure façon de montrer votre personnalité
                </Text>
            </View>

            <ThemedButton
                onClick={() => { router.navigate('/(Auth)/singin') }}
                text="Ajouter une photo"
                style={styles.addButton}
            />
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
