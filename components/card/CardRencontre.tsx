import React, { useState, useRef } from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/assets/style/style.color';

const { width: screenWidth } = Dimensions.get('window');

interface CardRencontreProps {
    imageSource: any;
    name: string;
    onNext: () => void;
}

const CardRencontre: React.FC<CardRencontreProps> = ({ imageSource, name }) => {
    const [liked, setLiked] = useState(false);
    const [heartShown, setHeartShown] = useState(false);
    const floatingHeart = useRef(new Animated.Value(0)).current;

    const handleHeartPress = () => {
        if (!liked) {
            setLiked(true);

            // Lancer l'animation du cœur flottant
            setHeartShown(true);
            Animated.sequence([
                Animated.timing(floatingHeart, {
                    toValue: 1,  // Va de bas en haut
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(floatingHeart, {
                    toValue: 0,  // Réinitialise après disparition
                    duration: 0,
                    useNativeDriver: true,
                }),
            ]).start(() => setHeartShown(false));  // Cacher le cœur après animation
        }
    };

    const handleClosePress = () => {
        setLiked(false);
    };

    return (
        <View style={styles.cardContainer}>
            <Image
                source={{ uri: imageSource }}
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
                <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
                    <Icon name="close-outline" size={40} color={COLORS.bg1} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.heartButton} onPress={handleHeartPress}>
                    {/* Icône de cœur dans le bouton */}
                    <Icon name={liked ? "heart" : "heart-outline"} size={40} color={liked ? COLORS.red : COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Icône du cœur flottant */}
            {heartShown && (
                <Animated.View style={[styles.floatingHeart, {
                    opacity: floatingHeart,
                    transform: [{
                        translateY: floatingHeart.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -100]  // Monte vers le haut
                        })
                    }]
                }]}>
                    <Icon name="heart" size={80} color={COLORS.red} />
                </Animated.View>
            )}
        </View>
    );
};
// interface CardRencontreProps {
//     imageSource: any;
//     name: string;
//     onNext: () => void; // Nouvelle prop
// }

// const CardRencontre: React.FC<CardRencontreProps> = ({ imageSource, name, onNext }) => {
//     const [liked, setLiked] = useState(false);
//     const [heartShown, setHeartShown] = useState(false);
//     const floatingHeart = useRef(new Animated.Value(0)).current;

//     const handleHeartPress = () => {
//         setLiked(true);
//         animateHeart();
//         onNext(); // Passer à la carte suivante
//     };

//     const handleClosePress = () => {
//         setLiked(false);
//         onNext(); // Passer à la carte suivante
//     };

//     const animateHeart = () => {
//         setHeartShown(true);
//         Animated.sequence([
//             Animated.timing(floatingHeart, {
//                 toValue: 1,
//                 duration: 600,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(floatingHeart, {
//                 toValue: 0,
//                 duration: 0,
//                 useNativeDriver: true,
//             }),
//         ]).start(() => setHeartShown(false));
//     };

//     return (
//         <View style={styles.cardContainer}>
//             <Image source={{ uri: imageSource }} style={styles.stepImage} resizeMode="cover" />
//             <View style={styles.textOverlay}>
//                 <View style={styles.nameContainer}>
//                     <Icon name="shield-checkmark" size={25} color={COLORS.jaune} style={styles.icon} />
//                     <ThemedText type="midleText" style={styles.name}>
//                         {name}
//                     </ThemedText>
//                 </View>
//             </View>
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
//                     <Icon name="close-outline" size={40} color={COLORS.bg1} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.heartButton} onPress={handleHeartPress}>
//                     <Icon name={liked ? 'heart' : 'heart-outline'} size={40} color={liked ? COLORS.red : COLORS.white} />
//                 </TouchableOpacity>
//             </View>
//             {heartShown && (
//                 <Animated.View
//                     style={[
//                         styles.floatingHeart,
//                         {
//                             opacity: floatingHeart,
//                             transform: [
//                                 {
//                                     translateY: floatingHeart.interpolate({
//                                         inputRange: [0, 1],
//                                         outputRange: [0, -100],
//                                     }),
//                                 },
//                             ],
//                         },
//                     ]}
//                 >
//                     <Icon name="heart" size={80} color={COLORS.red} />
//                 </Animated.View>
//             )}
//         </View>
//     );
// };

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
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        backgroundColor: COLORS.darkBlue,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    modalName: {

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
    // Style pour le cœur flottant
    floatingHeart: {
        position: 'absolute',
        bottom: 100,
        left: '45%',
    },
});

export default CardRencontre;
