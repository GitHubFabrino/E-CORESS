
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';


export default function RootLayout() {


    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="Credit" options={{ headerShown: false }} />
            <Stack.Screen name="MostPopular" options={{ headerShown: false }} />
            <Stack.Screen name="Interaction" options={{ headerShown: false }} />
        </Stack>
    );
}
