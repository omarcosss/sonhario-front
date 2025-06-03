

import SleepScore from '@/assets/icons/SleepScore';
import FText from '@/components/FText';
import Greeting from '@/components/Greeting';
import SleepChart from '@/components/SleepChart';
import { Colors } from "@/constants/Colors";
import { PlatformPressable } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Button, Surface } from 'react-native-paper';
import { Portal } from 'react-native-portalize';

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

    const registryTypeSelectRef = useRef<Modalize>(null);

    const onOpenregistryTypeSelect = () => {
        registryTypeSelectRef.current?.open();
    };

    const onCloseregistryTypeSelect = () => {
        registryTypeSelectRef.current?.close();
    };

    const registryPlan1Ref = useRef<Modalize>(null);

    const onOpenregistryPlan1 = () => {
        registryTypeSelectRef.current?.close();
        registryPlan1Ref.current?.open();
    };
    const onBackregistryPlan1 = () => {
        registryPlan1Ref.current?.close();
        registryTypeSelectRef.current?.open();
    };
    const onCloseregistryPlan1 = () => {
        registryPlan1Ref.current?.close();
    };

    return (
        <LinearGradient
        colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradient}>
            <ScrollView style={{ flex: 1, paddingTop: 20 }} bounces={false}>

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
                        <PlatformPressable style={{  height: 140, flex: 1 }} onPress={onOpenregistryTypeSelect}>
                            <Surface style={{ display: 'flex', height: 140, justifyContent: 'center', alignItems: 'flex-end', padding: 20, marginTop: 16, borderRadius: 30, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Astronaut[900] }} elevation={4}>
                                <FText style={{ fontSize: 48, textAlign: 'right', fontWeight: 200 }}>+</FText>
                                <FText style={{ textAlign: 'right' }}>Adicionar</FText>
                                <FText style={{ textAlign: 'right' }}>Registro de Sono</FText>
                            </Surface>
                        </PlatformPressable>
                    </View>
                </View>
            </ScrollView>
            <Portal>

                <Modalize
                    ref={registryTypeSelectRef}
                    adjustToContentHeight
                    modalStyle={{ backgroundColor: Colors.dark.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 25, paddingLeft: 25, paddingRight: 25, borderWidth: 1, borderColor: Colors.Card.Stroke,borderBottomColor: "#00000000" }}
                    onOverlayPress={onCloseregistryTypeSelect}
                >
                    <View style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 50 }}>
                        <Button mode="contained" onPress={onOpenregistryPlan1} style={{ flex: 1, backgroundColor: Colors.Astronaut[900], height: 65, borderRadius: 30, display: 'flex', justifyContent: 'center' }} >Planejar Sono</Button>
                        <Button mode="outlined" style={{ flex: 1, borderColor: Colors.Astronaut[200], height: 65, borderRadius: 30, display: 'flex', justifyContent: 'center' }} ><FText style={{color:Colors.Astronaut[200]}}>Registrar Sono Passado</FText></Button>
                    </View>
                </Modalize>
                <Modalize
                    ref={registryPlan1Ref}
                    adjustToContentHeight
                    modalStyle={{ backgroundColor: Colors.dark.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 25, paddingLeft: 25, paddingRight: 25, borderWidth: 1, borderColor: Colors.Card.Stroke,borderBottomColor: "#00000000" }}
                    onOverlayPress={onCloseregistryTypeSelect}
                    FooterComponent={
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginBottom: 20 }}>
                            <Button mode="outlined" onPress={onBackregistryPlan1} style={{ flex: 1, borderColor: Colors.Astronaut[200] }} ><FText style={{color:Colors.Astronaut[200]}}>Voltar</FText></Button>
                            <Button mode="contained" onPress={onCloseregistryPlan1} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }} >Avançar</Button>
                        </View>
                    }
                >
                    <View style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 12}}>
                            <FText>Data</FText>
                            <FText>Duração</FText>
                        </View>
                    </View>
                    </Modalize>
            </Portal>
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
