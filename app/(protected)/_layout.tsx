import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { Redirect, Stack } from 'expo-router';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';

import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';

// Configuração inicial para o comportamento da notificação
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Falha ao obter permissão para notificações!');
    return;
  }

  // Configuração específica para Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}



export default function ProtectedLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  
  const authContext = useContext(AuthContext);
  if (!authContext.isLoggedIn){
    return <Redirect href={'/login'} />
  } 
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)"  options={{ headerShown: false, headerTitle: 'Início' }}  />
      <Stack.Screen name="entries/index"  options={{ 
        headerTitle: 'Todos os Registros', 
        headerStyle: {
          backgroundColor: '#161616'
        }, 
        headerTintColor: Colors.Astronaut[50] 
      }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(editor)" options={{ headerShown: false }} />
    </Stack>
  );
}
