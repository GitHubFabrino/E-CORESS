import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, FlatList, View, Animated } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import CardRencontre from '@/components/card/CardRencontre';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getChats, spotlight, userProfil } from '@/request/ApiRest';
import { setSpotlight } from '@/store/userSlice';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


const data = [
  { id: '1', imageSource: require('@/assets/images/img1.jpeg'), name: 'Angelo, 25' },
  { id: '2', imageSource: require('@/assets/images/img1.jpeg'), name: 'Maria, 30' },
  { id: '3', imageSource: require('@/assets/images/img1.jpeg'), name: 'John, 28' },
];

export default function HomeScreen() {
  const [liked, setLiked] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0)); // Animation scale

  const handlePress = () => {
    setLiked(!liked);

    if (!liked) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("ID USER", auth.idUser);
    getProfile()

  }, [auth.user]);

  const getProfile = async () => {
    try {
      const profileUser = await userProfil(auth.idUser)
      console.log("DATA USER PROFIL", profileUser);
      const spotlightData = await spotlight(auth.idUser)
      dispatch(setSpotlight(spotlightData))
      const getAllChats = await getChats(auth.idUser)
      //   console.log("SPOTLIGHT DATA", spotlightData);
      console.log("DATA CHAT ", getAllChats);

    } catch (error) {
      console.error('error', error);
      throw error;
    }
  }
  console.log("DATA SPOTLIGHT STORE", auth.spotlight);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rencontres</ThemedText>
      </ThemedView>
      <View style={styles.cardContainer}>
        <FlatList
          data={auth.spotlight.spotlight}
          horizontal
          renderItem={({ item }) => (
            <CardRencontre
              key={item.id}
              imageSource={item.photo}
              name={item.name}
            />
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <Link href="/(Auth)/singin" style={styles.link}>
        <ThemedText type="link">Go to SINGIN</ThemedText>
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 50
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  cardContainer: {
    height: screenHeight * 0.7,
    marginVertical: 10,
  },
});

