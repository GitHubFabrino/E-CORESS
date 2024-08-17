import { StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

export function LogoWave() {
  const scale = useSharedValue(1);
  scale.value = withRepeat(
    withSequence(
      withTiming(1.1, { duration: 1500 }),
      withTiming(1, { duration: 1500 })
    ),
    -1
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={require('@/assets/images/logoEcoress.png')}
        style={styles.reactLogo}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: 50,
  },
});
