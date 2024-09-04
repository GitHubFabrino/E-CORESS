import React, { useState, useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import ThemedButton from '@/components/button/Button';
import { COLORS } from '@/assets/style/style.color';


// export default function HomeScreenAcceuil() {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const fadeAnim = useRef(new Animated.Value(0)).current;

//     const images = [
//         require('@/assets/images/imageAcceuil/img1.jpeg'),
//         require('@/assets/images/imageAcceuil/img2.jpeg'),
//         require('@/assets/images/imageAcceuil/img3.jpeg'),
//     ];

//     useEffect(() => {
//         const interval = setInterval(() => {
//             Animated.timing(fadeAnim, {
//                 toValue: 0,
//                 duration: 500,
//                 useNativeDriver: true,
//             }).start(() => {
//                 setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//                 Animated.timing(fadeAnim, {
//                     toValue: 1,
//                     duration: 500,
//                     useNativeDriver: true,
//                 }).start();
//             });
//         }, 6000);

//         return () => clearInterval(interval);
//     }, [images.length]); // Remove fadeAnim from dependencies


//     return (
//         <ParallaxScrollView
//             headerBackgroundColor={{ light: '#1D3D47', dark: '#1D3D47' }}
//             headerImage={
//                 <Animated.Image
//                     source={images[currentImageIndex]}
//                     style={[styles.reactLogo, { opacity: fadeAnim }]}
//                 />
//             }
//             height={250}
//         >
//             <ThemedView style={styles.titleContainer}>
//                 <ThemedText type="title" style={styles.colorText} >BIENVENU SUR</ThemedText>
//             </ThemedView>

//             <Image
//                 source={require('../assets/images/ecoress.png')}
//                 style={styles.logo}
//                 resizeMode="contain"
//             />

//             <View style={styles.containerText}>
//                 <Text style={styles.text}>
//                     Une belle opportunité de nouer des liens à la fois amicaux et romantiques avec de vraies personnes.
//                 </Text>
//             </View>

//             <ThemedButton onClick={() => {
//                 console.log("aaaa");

//                 router.navigate('/(Auth)/singin')
//             }} text={'Commencer'} style={{ backgroundColor: "#F4B20A", marginTop: 50, color: '#232B57' }} />
//         </ParallaxScrollView>
//     );
// }
export default function HomeScreenAcceuil() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const images = [
        require('@/assets/images/imageAcceuil/img1.jpeg'),
        require('@/assets/images/imageAcceuil/img2.jpeg'),
        require('@/assets/images/imageAcceuil/img3.jpeg'),
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [fadeAnim, images.length]); // Corrigez ici les dépendances du hook



    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#1D3D47', dark: '#1D3D47' }}
            headerImage={
                <Animated.Image
                    source={images[currentImageIndex]}
                    style={[styles.reactLogo, { opacity: fadeAnim }]}
                />
            }
            height={250}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.colorText} >BIENVENU SUR</ThemedText>
            </ThemedView>

            <Image
                source={require('../assets/images/ecoress.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.containerText}>
                <Text style={styles.text}>
                    Une belle opportunité de nouer des liens à la fois amicaux et romantiques avec de vraies personnes.
                </Text>
            </View>

            <ThemedButton onClick={() => {
                console.log("aaaa");
                router.navigate('/(Auth)/singin')
            }} text={'Commencer'} style={{ backgroundColor: "#F4B20A", marginTop: 50, color: '#232B57' }} />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'center'
    },
    logo: {
        width: '100%',
        height: 50
    },
    colorText: {
        color: COLORS.bg1,
        fontSize: 30,
        fontWeight: 'bold'
    },
    containerText: {
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20
    },
    text: {
        fontSize: 15,
        alignSelf: 'center',
        color: COLORS.bg1
    },

    reactLogo: {
        height: '100%',
        width: '100%',
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
