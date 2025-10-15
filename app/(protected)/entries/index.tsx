import InsightIcon from "@/assets/icons/InsightIcon";
import MoonMeter from "@/assets/icons/MoonMeter";
import FText from "@/components/FText";
import PaginatedSleepChart from "@/components/PaginatedSleepChart";
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Surface } from "react-native-paper";

interface SleepEntry {
    date: string;
    hours: number;
}


export default function AllEntries() {
    const [latestSleep, setLatestSleep] = useState<number>();
    const [sleepHistory, setSleepHistory] = useState<(SleepEntry | null | undefined)[] | undefined>(undefined);
    const [average, setAverage] = useState<number>();
    const [status, setStatus] = useState<string>();
    const [advice, setAdvice] = useState<string>();
    const [latestSleepRating, setLatestSleepRating] = useState<string>();
    const [latestSleepColor, setLatestSleepColor] = useState<any>(Colors.Astronaut);

    const [error, setError] = useState<string | null>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);




    useEffect(() => {
        async function fetchSleepData() {
            const { accessToken } = await getTokens();

            try {
                const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/entries/?limit=7', {
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
                    const fetchedData: (SleepEntry | null)[] = []
                    data.forEach((entry: any) => {
                        fetchedData.push({ date: entry.date, hours: entry.total_sleep_hours })
                    })

                    const latestHours = data[0].total_sleep_hours;

                    const latestHoursFixed: number = Math.round(latestHours);

                    setLatestSleep(latestHoursFixed);
                    setSleepHistory(fetchedData);


                    let rating = "Você teve uma noite de sono moderada. Observe seus hábitos diaramente para obter melhorias.";
                    if (latestHours > 6) {
                        rating = "Você teve uma ótima noite de sono! Isso helps a manter sua concentração e energia ao longo do dia.";
                    }
                    if (latestHours < 5) {
                        rating = "Você não teve uma noite de sono muito boa. Observe seu deficit de sono semanal para manter suas horas em dia!";
                    }

                    setLatestSleepRating(rating);
                    setLatestSleepColor(latestHours < 5 ? Colors.RedOrange : Colors.Astronaut);
                }
            } catch (e) {
                console.error(e);
                setError('Não foi possível conectar ao servidor. Tente novamente.');
            }
        }

        async function fetchAverageData() {
            const { accessToken } = await getTokens();

            try {
                const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/insight/average/', {
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
                    setAverage(data.average);
                    setStatus(data.status);
                    setAdvice(data.advice);
                }
            } catch (e) {
                console.error(e);
                setError('Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }

        fetchAverageData();

        fetchSleepData();

    }, []);

    return (
        <LinearGradient colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.gradient}>
            <ScrollView style={styles.scrollView}>
                {error && <FText style={styles.errorText}>{error}</FText>}
                {loading && !error ? (
                    <ActivityIndicator style={{ marginTop: 420 }} size="large" color={Colors.Astronaut[100]} />
                ) : (
                    <>
                        <View style={{ display: 'flex', gap: 20 }}>
                            <View style={{ display: 'flex', gap: 0, justifyContent: "center", alignItems: 'center' }}>
                                <FText>Seu último registro:</FText>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <MoonMeter iconColor={latestSleepColor[200]} />
                                    <FText fontSize={60} fontWeight="700" style={{ color: latestSleepColor[200], overflow: 'visible', padding: 7, fontWeight: '700', textShadowColor: latestSleepColor[900], textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20, verticalAlign: 'middle' }}>
                                        {latestSleep}h
                                    </FText>
                                </View>
                                <FText style={{ textAlign: 'center' }} >
                                    {latestSleepRating}
                                </FText>
                            </View>
                            {/* <View style={styles.divisor} /> */}
                            <View>
                                <PaginatedSleepChart sleepData={sleepHistory} />
                            </View>
                            <Surface elevation={5} style={[styles.surfaceCard, { display: 'flex', flexDirection: "row", padding: 20, gap: 15, alignItems: "center" }]}>
                                <View style={{ width: "30%", display: 'flex', gap: 10 }}>
                                    <FText style={{ textAlign: 'center', }} fontSize={12}>Média da última semana:</FText>
                                    <FText style={{ color: Colors.Astronaut[200], textAlign: 'center' }} fontSize={32} fontWeight="800">{average}h</FText>
                                    <FText style={{ textAlign: 'center', }} fontSize={12}>{status}</FText>
                                </View>
                                <View style={{ width: 1, height: "100%", backgroundColor: Colors.Card.Stroke }}></View>
                                <View style={{ display: 'flex', gap: 5, flex: 1, }}>
                                    <InsightIcon />
                                    <FText style={{ display: 'flex', flex: 1 }}>
                                        {advice}
                                    </FText>
                                </View>
                            </Surface>
                        </View>
                    </>)}
            </ScrollView>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        backgroundColor: '#161616',
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
    },
    divisor: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.Card.Stroke,
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
    errorText: {
        color: '#ff8a80',
        textAlign: 'center',
        fontFamily: 'Fustat',
        fontSize: 14,
        marginTop: -10,
        marginBottom: 5,
    },
});