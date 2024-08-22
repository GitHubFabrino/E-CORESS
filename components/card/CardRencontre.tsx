// CardRencontre.tsx
import React from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/assets/style/style.color';

const { width: screenWidth } = Dimensions.get('window');

interface CardRencontreProps {
    imageSource: any;
    name: string;
}

const CardRencontre: React.FC<CardRencontreProps> = ({ imageSource, name }) => {
    return (
        <View style={styles.cardContainer}>
            <Image
                source={imageSource}
                style={styles.stepImage}
                resizeMode="cover"
            />
            <View style={styles.textOverlay}>
                <View style={styles.nameContainer}>
                    <Icon name="shield-checkmark" size={25} color={COLORS.jaune} style={styles.icon} />
                    <ThemedText type="midleText" style={styles.name}>{name}</ThemedText>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.closeButton}>
                    <Icon name="close-outline" size={40} color={COLORS.bg1} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.heartButton}>
                    <Icon name="heart-outline" size={40} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: screenWidth * 0.8,
        marginHorizontal: 10,
        borderRadius: 20,
        backgroundColor: 'red',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        position: 'relative',
        overflow: 'hidden',
    },
    stepImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    textOverlay: {
        position: 'absolute',
        top: 20,
        left: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    name: {
        color: COLORS.white
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 15,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    heartButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.bg1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CardRencontre;
