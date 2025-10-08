import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import 'react-native-reanimated';


export default function ProtectedLayout() {
  const authContext = useContext(AuthContext);
  if (!authContext.isLoggedIn){
    return <Redirect href={'/prelogin'} />
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
      <Stack.Screen name="prelogin" options={{ headerShown: false }} />
      <Stack.Screen name="(editor)" options={{ headerShown: false }} />
    </Stack>
  );
}
