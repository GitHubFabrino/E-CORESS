import React, { useState } from 'react';
import { StyleSheet, Dimensions, FlatList, View, Animated } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import CardRencontre from '@/components/card/CardRencontre';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { spotlight } from '@/request/ApiRest';
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

  // useEffect(() => {
  //   console.log("ID USER", auth.idUser);
  //   getProfile()

  // },);

  const getProfile = async () => {
    try {
      const spotlightData = await spotlight(auth.idUser)
      dispatch(setSpotlight(spotlightData))
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rencontres</ThemedText>
      </ThemedView>
      <View style={styles.cardContainer}>
        <FlatList
          data={auth.spotlight.spotlight || null}
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
      {/* <Link href="/(Auth)/singin" style={styles.link}>
        <ThemedText type="link">Go to SINGIN</ThemedText>
      </Link> */}
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

