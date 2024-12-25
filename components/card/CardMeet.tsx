import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/assets/style/style.color';

interface CardItemProps {
    imageSource: any;
    name: string;
    address: string;
    age: string,
    fan: number,
    premium: string,
    verified: string,
}

const CardMeet: React.FC<CardItemProps> = ({ imageSource, name, address, age, fan, premium, verified }) => {
    return (
        <View style={styles.card}>
            <View style={styles.image}>
                <Image source={imageSource} style={styles.image1} resizeMode="cover" />
                <View style={styles.containerInfo}>
                    {fan === 1 && <View style={styles.heart}><Icon name="heart" size={15} color={"red"} /></View>
                    }
                    {premium === '1' && <View style={styles.heart}><Icon name="diamond" size={15} color={COLORS.jaune} /></View>
                    }
                    {verified === '1' && <View style={styles.heart}><Icon name="shield-checkmark" size={15} color={"green"} /></View>
                    }
                </View>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <ThemedText type="midleText" style={styles.name}>{name}, {age}</ThemedText>


                </View>
                <View style={styles.locationContainer}>
                    <Icon name="location-outline" size={15} color={COLORS.bg1} />
                    <ThemedText type="midleText" style={styles.address}>{address}</ThemedText>
                </View>
            </View>

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
    heart: {
        width: 25,
        height: 25,


        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'white',

        borderRadius: 50,
    },
    containerInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '55%',
        position: 'absolute',
        // backgroundColor: 'red',
        bottom: -10,
        alignSelf: 'center'
        // left: '38%',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.bg1
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    address: {
        marginLeft: 5,
        fontSize: 12,
        color: COLORS.text2,
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

export default CardMeet;
