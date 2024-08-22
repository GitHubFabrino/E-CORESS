import React from 'react';
import { StyleSheet, Dimensions, FlatList, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import CardRencontre from '@/components/card/CardRencontre';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const data = [
  { id: '1', imageSource: require('@/assets/images/img1.jpeg'), name: 'Angelo, 25' },
  { id: '2', imageSource: require('@/assets/images/img1.jpeg'), name: 'Maria, 30' },
  { id: '3', imageSource: require('@/assets/images/img1.jpeg'), name: 'John, 28' },
];

export default function HomeScreen() {
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
