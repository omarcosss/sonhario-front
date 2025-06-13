import SleepScore from '@/assets/icons/SleepScore';
import FText from '@/components/FText';
import Greeting from '@/components/Greeting';
import SleepChart from '@/components/SleepChart';
import SleepRegistryModals, { SleepPlanData, SleepRegistryModalsRef } from '@/components/SleepRegistryModals';
import { Colors } from "@/constants/Colors";
import { getTokens } from '@/utils/authStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Surface } from 'react-native-paper';

interface SleepEntry {
  date: string;
  hours: number;
}

export default function HomeScreen() {
    const [sleepHistory, setSleepHistory] = useState<(SleepEntry | null | undefined)[] | undefined>(undefined);
    const [profile, setProfile] = useState<any>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const sleepRegistryRef = useRef<SleepRegistryModalsRef>(null);

    const handleSaveSleepPlan = (data: SleepPlanData) => {
        console.log("Data received from modals:", data);
    };

    const onAddSleepPress = () => {
        sleepRegistryRef.current?.open();
    };

    useEffect(() => {
        async function getProfileInfo () {
            const { accessToken } = await getTokens();

            try {
                const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/profile/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.detail || 'Algo deu errado');
                } else {
                    setProfile(data);
                }
            } catch (e) {
                console.error(e);
                setError('Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }

        getProfileInfo();
    }, []);

    useEffect(() => {
        const fetchSleepData = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const fetchedData: (SleepEntry | null)[] = [
            { date: '2025-06-07', hours: 7.5 },
            { date: '2025-06-06', hours: 6.0 },
            { date: '2025-06-04', hours: 8.2 },
            { date: '2025-06-03', hours: 8.4 },
            { date: '2025-06-02', hours: 5.5 },
            { date: '2025-06-01', hours: 6.5 },
            { date: '2025-05-31', hours: 6.9 },
        ];
        setSleepHistory(fetchedData);
        };

        fetchSleepData();
    }, []);

    return (
        <>
            <LinearGradient colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.gradient}>
                <ScrollView style={{ flex: 1, paddingTop: 20 }} bounces={false}>
                    {loading && !error ? (
                        <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                    ) : (
                        <>
                        <Greeting first_name={profile.first_name}/>
                        <View style={styles.container}>
                            <Surface style={styles.surfaceCard} elevation={4}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FText style={{color: Colors.Astronaut[50]}}>Último Registro:</FText>
                                    <Button mode="contained" style={{ backgroundColor: Colors.Card.Stroke, backgroundBlendMode: 'multiply', borderWidth: 1, borderColor: Colors.Card.Stroke}}>
                                        <FText style={{ color: Colors.Astronaut[200]}}>Ver todos</FText>
                                    </Button>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <SleepScore iconColor={Colors.Astronaut[200]} shadowColor={Colors.Astronaut[600]} shadowRadius={20} />
                                    <FText style={{ color: Colors.Astronaut[200], overflow: 'visible', padding: 7, fontSize: 32, fontWeight: '700', textShadowColor: '#4767C9', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20, }} >7h</FText>
                                </View>
                                <FText>Você teve uma ótima noite de sono! Isso ajuda a manter sua concentração e energia ao longo do dia.</FText>
                                <SleepChart sleepDataLast7Days={sleepHistory} />
                            </Surface>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 20, width: '100%', flex: 1, height: 140, }}>
                                <Surface style={styles.smallCard} elevation={4}>
                                    <FText style={{ fontWeight: '200' }}>Você está com:</FText>
                                    <FText style={{ fontSize: 32, fontWeight: '700' }}>3h</FText>
                                    <FText style={{ fontWeight: '200' }}>de deficit de sono esta semana</FText>
                                </Surface>
                                <TouchableOpacity style={{ height: 140, flex: 1 }} onPress={onAddSleepPress}>
                                    <Surface style={styles.addButtonCard} elevation={4}>
                                        <FText style={{ fontSize: 48, textAlign: 'right', fontWeight: '200' }}>+</FText>
                                        <FText style={{ textAlign: 'right' }}>Adicionar</FText>
                                        <FText style={{ textAlign: 'right' }}>Registro de Sono</FText>
                                    </Surface>
                                </TouchableOpacity>
                            </View>
                        </View>
                        </>
                    )}                    
                </ScrollView>
            </LinearGradient>
            
            <SleepRegistryModals ref={sleepRegistryRef} onSave={handleSaveSleepPlan} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#161616',
    },
    surfaceCard: {
        padding: 20,
        marginTop: 16,
        gap: 0,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.Card.Stroke,
        backgroundColor: Colors.Card.Background
    },
    smallCard: {
        display: "flex",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20,
        marginTop: 16,
        height: 140,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.Card.Stroke,
        backgroundColor: Colors.Card.Background
    },
    addButtonCard: {
        display: 'flex',
        height: 140,
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 20,
        marginTop: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.Card.Stroke,
        backgroundColor: Colors.Astronaut[900]
    }
});