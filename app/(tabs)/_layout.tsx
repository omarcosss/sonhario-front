import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PaperProvider } from 'react-native-paper';
import { TabBar } from '@/components/TabBar';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <Tabs tabBar={(props) => <TabBar {...props} />} >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home', headerShown: false
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal', headerShown: false
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            title: 'Perfil', headerShown: false
          }}
        />
      </Tabs>
      {/* // <Tabs tabBar={(props) => <TabBar {...props} />
      //   screenOptions={{
      //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      //     tabBarActiveBackgroundColor: 'rgba(50, 64, 123, 0.40)',
      //     headerShown: false,
      //     tabBarButton: HapticTab,
      //     tabBarBackground: TabBarBackground,
      //     tabBarItemStyle: {
      //       borderRadius: 30,
      //       marginHorizontal: 5,
      //       marginVertical: 5,
      //     },
      //     tabBarStyle: Platform.select({
      //       ios: {
      //         // Use a transparent background on iOS to show the blur effect
      //         position: 'absolute',
      //       },
      //       default: {},
      //     }),
      //   }}>
      //   <Tabs.Screen
      //     name="index"
      //     options={{
      //       title: ' ',
      //       tabBarIcon: ({ color }) => <MoonStarsSvg width={32} height={32} fill={color} size={32} color={color} />,
      //     }}
      //   />
      //   <Tabs.Screen
      //     name="journal"
      //     options={{
      //       title: ' ',
      //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.closed.fill" color={color} />,
      //     }}
      //   />
      //   <Tabs.Screen
      //     name="user"
      //     options={{
      //       title: ' ',
      //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
      //     }}
      //   />
      // </Tabs> */}
    </PaperProvider>
  );
}
