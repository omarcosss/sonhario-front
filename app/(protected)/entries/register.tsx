import FText from "@/components/FText";
import UniversalDatePicker from "@/components/UniversalDatePicker";
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type TypeSwitchProps = {
    selected: "planejar" | "registrar";
    setSelected: React.Dispatch<React.SetStateAction<"planejar" | "registrar">>;
};

function TypeSwitch({ selected, setSelected }: TypeSwitchProps) {
    const handlePress = (type: "planejar" | "registrar") => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelected(type);

        if (type === "planejar") {
            console.log("planejando");
        } else {
            console.log("registrando");
        }
    };

    return (
        <View
            style={styles.TypeSwitchBackground}
        >
            <PlatformPressable
                onPress={() => handlePress("planejar")}
                style={[
                    styles.TypeSwitchButton,
                    selected === "planejar"
                        ? styles.TypeSwitchButtonActive
                        : styles.TypeSwitchButtonInactive,
                ]}
            >
                <FText>Planejar</FText>
            </PlatformPressable>

            <PlatformPressable
                onPress={() => handlePress("registrar")}
                style={[
                    styles.TypeSwitchButton,
                    selected === "registrar"
                        ? styles.TypeSwitchButtonActive
                        : styles.TypeSwitchButtonInactive,
                ]}
            >
                <FText>Registrar</FText>
            </PlatformPressable>
        </View>
    );
}

const dateConvertTo = (date: Date, output: 'date' | 'time'): string => {
  if (output === 'date') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');    
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  if (output === 'time') {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  throw new Error("Invalid output type specified. Use 'date' or 'time'.");
};

export interface SleepPlanData {
    sleepDate: Date;
    goToBedTime: Date;
    wakeUpTime: Date;
    caffeineAmount: number;
    // exerciseMinutes: number;
    screenTime: number;
}

export interface SleepPrevData {
    sleepDate: Date;
    goToBedTime: Date;
    wakeUpTime: Date;
    caffeineAmount: number;
    // exerciseMinutes: number;
    screenTime: number;
}

export default function SleepRegister() {
    const [selected, setSelected] = useState<"planejar" | "registrar">("planejar");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [sleepDate, setSleepDate] = useState(new Date());
    const [goToBedTime, setGoToBedTime] = useState(new Date());
    const [wakeUpTime, setWakeUpTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [activePicker, setActivePicker] = useState<'date' | 'goToBed' | 'wakeUp'>('date');
    const [caffeineAmount, setCaffeineAmount] = useState(1);
    const [screenTime, setScreenTime] = useState(30);
    const [tempDate, setTempDate] = useState(new Date());

    const [insightResults, setInsightResults] = useState<any>(null);
    
    const [entryId, setEntryId] = useState<number>();

    const handleEntryPost = async (insight: boolean = false) => {
        setLoading(true);
        setError(null);
        let success = false;
        try {
            const { accessToken } = await getTokens();
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + (insight ? '/insight/entry/' : '/entries/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    date: dateConvertTo(sleepDate, "date"),
                    sleep_start_time: dateConvertTo(goToBedTime, "time"),
                    sleep_end_time: dateConvertTo(wakeUpTime, "time"),
                    coffee_cups: caffeineAmount,
                    screen_time: screenTime,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Ocorreu um erro inesperado.');
            } else {
                success = true;
                if (insight) {
                    setInsightResults(data.data);
                } else {
                    setEntryId(data.id);
                }
            }
        } catch (e) {
            console.error(e);
            setError('Não foi possível conectar ao servidor. Tente novamente.');
        } finally {
            setLoading(false);
            return success;
        }
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: Colors.dark.background }} contentContainerStyle={{ gap: 16 }}>
            <TypeSwitch selected={selected} setSelected={setSelected} />


            {selected === "planejar" ? (
                <FText>Planejar Conteúdo</FText>
            ) : (
                <FText>Registrar Conteúdo</FText>
            )}
            <View style={styles.InputRow}>
                <FText fontSize={16}>Data</FText>
                <UniversalDatePicker
                    value={sleepDate}
                    mode="date"
                    onChange={(date) => setSleepDate(date)}
                // maximumDate={new Date()}
                />
            </View>
            <View style={styles.InputRow}>
                {selected === "planejar" ? (
                    <FText fontSize={16}>Dormir</FText>
                ) : (
                    <FText fontSize={16}>Dormiu</FText>
                )}
                <UniversalDatePicker
                    value={goToBedTime}
                    onChange={(d) => setGoToBedTime(d)}
                    mode="time"
                    locale="pt-BR"
                    suggestionKind="goToBed"
                    entryMode={selected}
                    showSuggestions
                />
            </View>
            <View style={styles.InputRow}>
                {selected === "planejar" ? (
                    <FText fontSize={16}>Acordar</FText>
                ) : (
                    <FText fontSize={16}>Acordou</FText>
                )}
                <UniversalDatePicker
                    value={wakeUpTime}
                    mode="time"
                    onChange={(a) => setWakeUpTime(a)}
                    locale="pt-BR"
                    suggestionKind="wakeUp"
                    entryMode={selected}
                    showSuggestions
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    TypeSwitchBackground: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        backgroundColor: Colors.Card.Background,
        borderRadius: 38,
        borderWidth: 1,
        borderColor: Colors.Card.Stroke,
        gap: 4,
    },
    TypeSwitchButton: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        height: 60,
        borderRadius: 30,
        fontSize: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    TypeSwitchButtonActive: {
        backgroundColor: "rgba(242, 245, 252, 0.1)",
    },
    TypeSwitchButtonInactive: {
        backgroundColor: "transparent",
    },
    InputRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: Colors.Card.Background,
        padding: 12,
        borderRadius: 12,
        borderWidth: 0,
        // borderColor: Colors.Card.Stroke,

    }
});