import React, { useState } from 'react';
import { StyleSheet, Dimensions, FlatList, View, Animated } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import CardRencontre from '@/components/card/CardRencontre';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


const data = [
  { id: '1', imageSource: require('@/assets/images/img1.jpeg'), name: 'Angelo, 25' },
  { id: '2', imageSource: require('@/assets/images/img1.jpeg'), name: 'Maria, 30' },
  { id: '3', imageSource: require('@/assets/images/img1.jpeg'), name: 'John, 28' },
];
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
export default function HomeScreen() {

  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.user);

  console.log("DATA IN PROFIL", auth.user);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rencontres</ThemedText>
      </ThemedView>
      <View style={styles.cardContainer}>
        <FlatList
          data={data}
          horizontal
          renderItem={({ item }) => (
            <CardRencontre
              key={item.id}
              imageSource={item.imageSource}
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


// import React, { useState } from 'react';
// import { View, TouchableOpacity, Image, StyleSheet, Animated, Text } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// interface CardRencontreProps {
//   imageSource: any;
//   name: string;
// }

// const CardRencontre: React.FC<CardRencontreProps> = ({ imageSource, name }) => {
//   const [liked, setLiked] = useState(false);
//   const [scaleValue] = useState(new Animated.Value(0)); // Animation scale

//   const handlePress = () => {
//     setLiked(!liked);

//     if (!liked) {
//       Animated.sequence([
//         Animated.timing(scaleValue, {
//           toValue: 1.5,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleValue, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   };

//   return (
//     <View style={styles.card}>
//       <Image source={imageSource} style={styles.image} />
//       <Text style={styles.name}>{name}</Text>
//       <TouchableOpacity onPress={handlePress} style={styles.heartButton}>
//         <Animated.View
//           style={[
//             styles.heartIconContainer,
//             { transform: [{ scale: scaleValue }] }
//           ]}
//         >
//           <Icon name={liked ? "heart" : "heart-outline"} size={30} color={liked ? 'red' : 'black'} />
//         </Animated.View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     margin: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   image: {
//     width: 150,
//     height: 150,
//   },
//   name: {
//     padding: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   heartButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   heartIconContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default CardRencontre;
