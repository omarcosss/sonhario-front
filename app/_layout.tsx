import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import './global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/utils/authContext';
import React from 'react';
import { Host } from 'react-native-portalize';

export default function RootLayout(){
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        LibreCaslonTextItalic: require('../assets/fonts/LibreCaslonText-Italic.ttf'),
        LibreCaslonTextRegular: require('../assets/fonts/LibreCaslonText-Regular.ttf'),
        LibreCaslonTextBold: require('../assets/fonts/LibreCaslonText-Bold.ttf'),
        Fustat: require('../assets/fonts/Fustat.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }
    return(
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Host>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <StatusBar style='light' />
                        <Stack>
                            <Stack.Screen name='(protected)' options={{
                                headerShown: false
                            }} />
                            <Stack.Screen name='login' options={{
                                headerShown: false
                            }} />
                             <Stack.Screen name="register" options={{ 
                                headerShown: false }} />
                        </Stack>
                    </ThemeProvider>
                </Host>
            </GestureHandlerRootView>
        </AuthProvider>
    )
}