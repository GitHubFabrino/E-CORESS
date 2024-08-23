import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/assets/style/style.color';

interface CardItemProps {
    imageSource: any;
    name: string;
    address: string;
    onligne: boolean
}

const CardItem: React.FC<CardItemProps> = ({ imageSource, name, address, onligne }) => {
    return (
        <View style={styles.card}>
            <View style={styles.image}>
                <Image source={imageSource} style={styles.image1} resizeMode="cover" />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <ThemedText type="midleText" style={styles.name}>{name}</ThemedText>
                </View>
                <View style={styles.locationContainer}>
                    <Icon name="location-outline" size={15} color={COLORS.bg1} />
                    <ThemedText type="midleText" style={styles.address}>{address}</ThemedText>
                </View>
            </View>
            {onligne && (
                <View style={styles.onlineIndicator} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        overflow: 'hidden',
        margin: 5, // Ajustez la marge pour réduire l'espace entre les cartes
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: 140, // Ajustez la largeur des cartes
        height: 200, // Ajustez la hauteur des cartes
    },
    image: {
        width: 150,
        height: 130, // Ajustez la hauteur de l'image
    },
    image1: {
        width: '100%',
        height: '100%', // Ajustez la hauteur de l'image
    },
    infoContainer: {
        padding: 8,
        flex: 1,
        justifyContent: 'space-between',
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    address: {
        marginLeft: 5,
        fontSize: 12,
        color: COLORS.bg1,
    },
    onlineIndicator: {
        position: 'absolute',
        top: 20,
        right: 15,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0aff02',
    },
});

export default CardItem;
