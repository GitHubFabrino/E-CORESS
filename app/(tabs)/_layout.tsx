import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { COLORS } from '@/assets/style/style.color';
import { Badge } from 'react-native-elements';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.bg1,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="aproximite"
        options={{
          title: 'A proximité',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'location' : 'location-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rencontre',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(message)"
        options={{
          title: 'Message',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <TabBarIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} />
              <Badge
                value="3" // Nombre de notifications
                status="error"
                containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                badgeStyle={{ backgroundColor: COLORS.jaune }}
                textStyle={{ color: COLORS.white }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
