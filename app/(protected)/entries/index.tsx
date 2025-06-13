import FText from "@/components/FText";
import PaginatedSleepChart from "@/components/PaginatedSleepChart";
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface SleepEntry {
  date: string;
  hours: number;
}

export default function AllEntries() {
    const [latestSleep, setLatestSleep] = useState<number>();
    const [sleepHistory, setSleepHistory] = useState<(SleepEntry | null | undefined)[] | undefined>(undefined);
    const [error, setError] = useState<string>('');


    useEffect(() => {
        // const fetchSleepData = async () => {
        //     await new Promise(resolve => setTimeout(resolve, 1000));
        //     const fetchedData: (SleepEntry | null)[] = [
        //         { date: '2025-06-07', hours: 7.5 },
        //         { date: '2025-06-06', hours: 6.0 },
        //         { date: '2025-06-04', hours: 8.2 },
        //         { date: '2025-06-03', hours: 8.4 },
        //         { date: '2025-06-02', hours: 5.5 },
        //         { date: '2025-06-01', hours: 6.5 },
        //         { date: '2025-05-31', hours: 6.9 },
        //     ];
        //     setSleepHistory(fetchedData);
        // };

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
            <ScrollView style={{ display: 'flex', gap: 20 }} bounces={false}>
                <View style={{ display: 'flex', gap: 20, justifyContent: "center", alignItems: 'center'}}>
                    <FText>Seu último registro:</FText>
                    <FText fontSize={48} fontWeight="700" style={{ }}>{latestSleep}h</FText>
                    <FText style={{ textAlign: 'center'}} >Você teve uma ótima noite de sono! Isso ajuda a manter sua concentração e energia ao longo do dia.</FText>
                </View>
                <View style={styles.divisor} />
                <View>
                    <PaginatedSleepChart sleepData={sleepHistory} />
                </View>
            </ScrollView>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#161616',
    },
    divisor: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.Card.Stroke,
    }
});