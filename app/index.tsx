import React, { useState, useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { COLORS } from '@/assets/style/style.color';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import InputSelector from '@/components/input/InputSelector';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setActiveMethod, setLanguage } from '@/store/userSlice';
import { translations } from '@/service/translate';


export default function HomeScreenAcceuil() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.user);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [lang, setLang] = useState<'FR' | 'EN'>('FR');
    const [selected, setSelected] = useState(false);

    const images = [
        require('@/assets/images/imageAcceuil/img1.jpeg'),
        require('@/assets/images/imageAcceuil/img2.jpeg'),
        require('@/assets/images/imageAcceuil/img3.jpeg'),
    ];

    useEffect(() => {
        setLang('FR')
        dispatch(setLanguage('FR'));
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
    }, [fadeAnim, images.length]);

    const handleLang = () => {
        setSelected(!selected);
    };

    const currentTranslation = translations[lang];

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#1D3D47' }}
            headerImage={
                <Animated.Image
                    source={images[currentImageIndex]}
                    style={[styles.reactLogo, { opacity: fadeAnim }]}
                />
            }
            height={250}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.colorText}>
                    {currentTranslation.welcome}
                </ThemedText>
            </ThemedView>

            <Image
                source={require('../assets/images/ecoress.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.containerText}>
                <Text style={styles.text}>
                    {currentTranslation.description}
                </Text>
            </View>

            <ThemedText style={styles.text}>{currentTranslation.connect}</ThemedText>

            <ThemedView style={styles.container}>
                <TouchableOpacity onPress={() => {
                    dispatch(setActiveMethod('email'));
                    router.navigate('/(Auth)/singin')
                }} style={styles.btnLog}>
                    <IconMaterial name="gmail" size={50} color={COLORS.darkBlue} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    dispatch(setActiveMethod('fb'));
                    router.navigate('/(Auth)/singin')
                }} style={styles.btnLog}>
                    <IconMaterial name="facebook" size={50} color={COLORS.darkBlue} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    dispatch(setActiveMethod('phone'));
                    router.navigate('/(Auth)/singin')
                }} style={styles.btnLog}>
                    <IconMaterial name="phone" size={50} color={COLORS.darkBlue} />
                </TouchableOpacity>
            </ThemedView>

            <TouchableOpacity onPress={handleLang} style={styles.filterButton}>
                <Icon name="language-outline" size={25} color={COLORS.darkBlue} />
                <InputSelector
                    options={['FR', 'EN']}
                    selectedValue={lang}
                    onValueChange={(itemValue) => {
                        setLang(itemValue === 'FR' ? 'FR' : 'EN');
                        dispatch(setLanguage(itemValue));
                    }}
                    style={styles.language}
                />
            </TouchableOpacity>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        padding: 10,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    btnLog: {
        // backgroundColor: 'red'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        alignItems: 'center',
        alignSelf: 'center'
    },
    language: {
        width: 110
    },
    lang: {
        padding: 5,
        fontWeight: 700
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'center',
        marginTop: 50

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
        color: COLORS.bg1,
        textAlign: 'center'
    },

    reactLogo: {
        height: '100%',
        width: '100%',
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
