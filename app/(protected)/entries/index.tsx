import MoonMeter from "@/assets/icons/MoonMeter";
import FText from "@/components/FText";
import PaginatedSleepChart from "@/components/PaginatedSleepChart";
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Surface } from "react-native-paper";

interface SleepEntry {
  date: string;
  hours: number;
}

export default function AllEntries() {
    const [latestSleep, setLatestSleep] = useState<number>();
    const [sleepHistory, setSleepHistory] = useState<(SleepEntry | null | undefined)[] | undefined>(undefined);
    const [error, setError] = useState<string>('');


    useEffect(() => {
        async function fetchSleepData () {
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
                        fetchedData.push({date: entry.date, hours: entry.total_sleep_hours})
                    })
                    setLatestSleep(data[0].total_sleep_hours.toFixed(0));
                    setSleepHistory(fetchedData);
                }
            } catch (e) {
                console.error(e);
                setError('Não foi possível conectar ao servidor. Tente novamente.');
            }
        }

        fetchSleepData();
    }, []);
    
    return(
        <LinearGradient colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.gradient}>
            <ScrollView bounces={false}>
                <View style={{ display: 'flex', gap: 20 }}>
                    <View style={{ display: 'flex', gap: 20, justifyContent: "center", alignItems: 'center'}}>
                        <FText>Seu último registro:</FText>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <MoonMeter />
                            <FText fontSize={60} fontWeight="700" style={{ color: Colors.Astronaut[200], overflow: 'visible', padding: 7, fontWeight: '700', textShadowColor: Colors.Astronaut[900], textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20, verticalAlign: 'middle' }}>{latestSleep}h</FText>
                        </View>
                        <FText style={{ textAlign: 'center'}} >Você teve uma ótima noite de sono! Isso ajuda a manter sua concentração e energia ao longo do dia.</FText>
                    </View>
                    <View style={styles.divisor} />
                    <View>
                        <PaginatedSleepChart sleepData={sleepHistory} />
                    </View>
                    <Surface elevation={5} style={[styles.surfaceCard, {display: 'flex', flexDirection: "row", padding: 20, gap: 15}]}>
                        <View style={{width: "30%"}}>
                            <FText style={{ textAlign: 'center', }} fontSize={12}>Média da última semana:</FText>
                            <FText style={{color: Colors.Astronaut[200], textAlign: 'center'}} fontSize={32} fontWeight="800">Xh</FText>
                            <FText style={{ textAlign: 'center', }} fontSize={12}>(mini insight)</FText>
                        </View>
                        <View style={{width: 1, height: "100%", backgroundColor: Colors.Card.Stroke}}></View>
                        <View>
                            {/* icon */}
                            <FText>
                                insight
                            </FText>
                        </View>
                    </Surface>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        padding: 20,
        paddingTop: 20,
        backgroundColor: '#161616',
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
});