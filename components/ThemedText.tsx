// import { Text, type TextProps, StyleSheet } from 'react-native';

// import { useThemeColor } from '@/hooks/useThemeColor';

// export type ThemedTextProps = TextProps & {
//   lightColor?: string;
//   darkColor?: string;
//   type?: 'default' | 'title' | 'defaultSemiBold' | 'defaultSemiBold2' | 'subtitle' | 'link' | 'midleText' | 'sub';
// };

// export function ThemedText({
//   style,
//   lightColor,
//   darkColor,
//   type = 'default',
//   ...rest
// }: ThemedTextProps) {
//   const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

//   return (
//     <Text
//       style={[
//         { color },
//         type === 'default' ? styles.default : undefined,
//         type === 'title' ? styles.title : undefined,
//         type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
//         type === 'defaultSemiBold2' ? styles.defaultSemiBold2 : undefined,
//         type === 'subtitle' ? styles.subtitle : undefined,
//         type === 'link' ? styles.link : undefined,
//         type === 'midleText' ? styles.midleText : undefined,
//         type === 'sub' ? styles.subtitle2 : undefined,
//         style,
//       ]}
//       {...rest}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   default: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   defaultSemiBold: {
//     fontSize: 16,
//     lineHeight: 24,
//     fontWeight: '600',
//   },
//   defaultSemiBold2: {
//     fontSize: 18,
//     lineHeight: 24,
//     fontWeight: '600',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     lineHeight: 32,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   subtitle2: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   midleText: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     lineHeight: 32,
//   },
//   link: {
//     lineHeight: 30,
//     fontSize: 16,
//     color: '#0a7ea4',
//   },
// });


import React from 'react';
import { Text, TextProps, StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');
const scale = width / 375; // 375 est la largeur de référence (ex. iPhone 12)

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'defaultSemiBold2' | 'subtitle' | 'link' | 'midleText' | 'sub';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'defaultSemiBold2' ? styles.defaultSemiBold2 : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'midleText' ? styles.midleText : undefined,
        type === 'sub' ? styles.subtitle2 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16 * scale, // Taille adaptée à l'écran
    lineHeight: 24 * scale,
  },
  defaultSemiBold: {
    fontSize: 16 * scale,
    lineHeight: 24 * scale,
    fontWeight: '600',
  },
  defaultSemiBold2: {
    fontSize: 18 * scale,
    lineHeight: 24 * scale,
    fontWeight: '600',
  },
  title: {
    fontSize: 30 * scale,
    fontWeight: 'bold',
    lineHeight: 32 * scale,
  },
  subtitle: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
  },
  subtitle2: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
  },
  midleText: {
    fontSize: 25 * scale,
    fontWeight: 'bold',
    lineHeight: 32 * scale,
  },
  link: {
    fontSize: 16 * scale,
    lineHeight: 30 * scale,
    color: '#0a7ea4',
  },
});
