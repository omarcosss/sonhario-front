import { Image } from 'expo-image';


import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Greeting from '@/components/Greeting';
import { Button, Surface } from 'react-native-paper';
import { PlatformPressable } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from "@/constants/Colors";
import { Platform, StyleSheet, Text, View } from 'react-native';
import SleepScore from '@/assets/icons/SleepScore';
import { ScrollView } from 'react-native-gesture-handler';
import FText from '@/components/FText';
import { useEffect, useState } from 'react';
import SleepChart from '@/components/SleepChart';

interface SleepEntry {
  day: 'Dom' | 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sab';
  hours: number;
}

export default function HomeScreen() {
    const [sleepHistory, setSleepHistory] = useState<(SleepEntry | null | undefined)[] | undefined>(undefined);

  // Simulate fetching data from a database
  useEffect(() => {
    const fetchSleepData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fetchedData: (SleepEntry | null)[] = [
        { day: 'Dom', hours: 6.5 },
        { day: 'Seg', hours: 7 },
        null,
        { day: 'Qua', hours: 5 },
        { day: 'Qui', hours: 8 },
        { day: 'Sex', hours: 7.5 },
        { day: 'Sab', hours: 9 },
      ];
      setSleepHistory(fetchedData);
    };

    fetchSleepData();
  }, []);

  const updateDataExample = () => {
     setSleepHistory([
        { day: 'Dom', hours: 4 },
        { day: 'Seg', hours: 5 },
        { day: 'Ter', hours: 8 },
        { day: 'Qua', hours: 6 },
        { day: 'Qui', hours: 7 },
        { day: 'Sex', hours: 5 },
        { day: 'Sab', hours: 10 },
     ]);
  }
  return (
    <LinearGradient
     colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingTop: 20 }}>

        <Greeting/>
        <View style={styles.container}>
              <Surface style={{ padding: 20, marginTop: 16, gap: 0, borderRadius: 30, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background }} elevation={4}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FText style={{color: Colors.Astronaut[50]}}>Último Registro:</FText>
                      <Button mode="contained" onPress={() => updateDataExample()} style={{ backgroundColor: Colors.Card.Stroke, backgroundBlendMode: 'multiply', borderWidth: 1, borderColor: Colors.Card.Stroke}}>
                          <FText style={{ color: Colors.Astronaut[200]}}>
                              Ver todos
                          </FText>
                      </Button>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <SleepScore iconColor={Colors.Astronaut[200]} shadowColor={Colors.Astronaut[600]} shadowRadius={20} />
                      <FText style={{ color: Colors.Astronaut[200], overflow: 'visible', padding: 7, fontSize: 32, fontWeight: 700, textShadowColor: '#4767C9', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20, }} >
                          7h
                      </FText>
                  </View>
                  <FText style={{  }}>
                      Você teve uma ótima noite de sono! Isso ajuda a manter sua concentração e energia ao longo do dia.
                  </FText>
                  <SleepChart sleepDataLast7Days={sleepHistory} />
              </Surface>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 20, width: '100%', flex: 1, height: 140, }}>
                  <Surface style={{ display: "flex", flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 20, marginTop: 16, height: 140, borderRadius: 30, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background }} elevation={4}>
                      <FText style={{ fontWeight: 200 }}>Você está com:</FText>
                      <FText style={{ fontSize: 32, fontWeight: 700 }}>3h</FText>
                      <FText style={{ fontWeight: 200 }}>de deficit de sono esta semana</FText>
                  </Surface>
                  <PlatformPressable style={{  height: 140, flex: 1 }}>
                      <Surface style={{ display: 'flex', height: 140, justifyContent: 'center', alignItems: 'flex-end', padding: 20, marginTop: 16, borderRadius: 30, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Astronaut[900] }} elevation={4}>
                          <FText style={{ fontSize: 48, textAlign: 'right', fontWeight: 200 }}>+</FText>
                          <FText style={{ textAlign: 'right' }}>Adicionar</FText>
                          <FText style={{ textAlign: 'right' }}>Registro de Sono</FText>
                      </Surface>
                  </PlatformPressable>
              </View>
          </View>
      </View>
    </LinearGradient>
    
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1, // Ensures the gradient covers the entire container
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        gap: 20,
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#161616',

    },
    
})
