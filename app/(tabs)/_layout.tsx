import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { COLORS } from '@/assets/style/style.color';
import { Badge } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { userProfil, spotlight, getChats } from '@/request/ApiRest';
import { setAllChats, setSpotlight } from '@/store/userSlice';
import { translations } from '@/service/translate';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.user);

  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [spotlightLoaded, setSpotlightLoaded] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  const [lang, setLang] = useState<'FR' | 'EN'>(auth.lang);
  const t = translations[lang];

  useEffect(() => {
    if (auth.idUser) {
      getProfile();
    }
  }, [auth.idUser]);

  const getProfile = async () => {
    setLoading(true);

    try {

      await Promise.all([
        fetchSpotlight(),
        fetchChats(),
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpotlight = async () => {
    try {
      const spotlightData = await spotlight(auth.idUser);
      dispatch(setSpotlight(spotlightData));
      setSpotlightLoaded(true);
    } catch (error) {
      console.error('Erreur lors du chargement du spotlight:', error);
      throw error;
    }
  };

  const fetchChats = async () => {
    try {
      const getAllChats = await getChats(auth.idUser);
      dispatch(setAllChats(getAllChats));
      setUnread(getAllChats.unread.length);
      setChatsLoaded(true);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.jaune} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.bg1,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="aproximite"
        options={{
          title: `${t.aproximite1}`,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'location' : 'location-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: `${t.meeting}`,
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
              {unread !== 0 && (
                <Badge
                  value={unread} // Nombre de notifications
                  status="error"
                  containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                  badgeStyle={{ backgroundColor: COLORS.jaune }}
                  textStyle={{ color: COLORS.white }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(profil)"
        options={{
          title: `${t.profil}`,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
