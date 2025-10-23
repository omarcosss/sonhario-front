import { Readiness, SleepScore } from "@/assets/icons";
import InsightIcon from "@/assets/icons/InsightIcon";
import Counter from "@/components/Counter";
import DreamRegisterModal from "@/components/DreamRegisterModal";
import FText from "@/components/FText";
import { QualityChip } from "@/components/QualityChip";
import UniversalDatePicker from "@/components/UniversalDatePicker";
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ModalRN from 'react-native-modal';
import { Modalize } from "react-native-modalize";
import { Button, Divider } from "react-native-paper";

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

interface SleepEntry {
    date: string;
    hours: number;
}

export default function SleepRegister() {
    const [selected, setSelected] = useState<"planejar" | "registrar">("planejar");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const router = useRouter();

    const [profile, setProfile] = useState<any>();
    const [sleepHistory, setSleepHistory] = useState<(SleepEntry | null | undefined)[] | undefined>(undefined);
    const [latestSleep, setLatestSleep] = useState<number>(0);
    const [latestSleepRating, setLatestSleepRating] = useState<string>();
    const [latestSleepColor, setLatestSleepColor] = useState<any>();
    const [deficit, setDeficit] = useState<any>();

    const [sleepDate, setSleepDate] = useState(new Date());
    const [goToBedTime, setGoToBedTime] = useState(new Date());
    const [wakeUpTime, setWakeUpTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [activePicker, setActivePicker] = useState<'date' | 'goToBed' | 'wakeUp'>('date');
    const [caffeineAmount, setCaffeineAmount] = useState(1);
    const [screenTime, setScreenTime] = useState(30);
    const [tempDate, setTempDate] = useState(new Date());

    const [anotacao, setAnotacao] = useState('');
    const [height, setHeight] = useState(40);

    const [insightResults, setInsightResults] = useState<any>(null);

    const [entryId, setEntryId] = useState<number>();
    const dreamModalRef = useRef<Modalize>(null);
    const [showDreamModal, setShowDreamModal] = useState(false);
    const [dreamDescription, setDreamDescription] = useState("");
    const [dreamEmotion, setDreamEmotion] = useState<"1" | "2" | "3">("1");
    const [dreamError, setDreamError] = useState<string | null>(null);
    const [dreamLoading, setDreamLoading] = useState(false);

    const registryPlanPredictionRef = useRef<Modalize>(null);
    const [showConfirmPlan, setShowConfirmPlan] = useState(false);
    const [showConfirmPrev, setShowConfirmPrev] = useState(false);

    const handleSaveSleep = (data: SleepPlanData) => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchPageData = async () => {
            try {
                const { accessToken } = await getTokens();
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                };

                const [profileResponse, sleepResponse, deficitResponse] = await Promise.all([
                    fetch(process.env.EXPO_PUBLIC_API_URL + '/profile/', {
                        method: 'GET', headers
                    }),
                    fetch(process.env.EXPO_PUBLIC_API_URL + '/entries/?limit=7', {
                        method: 'GET', headers
                    }),
                    fetch(process.env.EXPO_PUBLIC_API_URL + '/insight/deficit/', {
                        method: 'GET', headers
                    })
                ]);
                if (!profileResponse.ok || !sleepResponse.ok || !deficitResponse.ok) {
                    throw new Error('Falha em uma das requisições à API.');
                }
                const [profileData, sleepData, deficitData] = await Promise.all([
                    profileResponse.json(),
                    sleepResponse.json(),
                    deficitResponse.json()
                ]);

                setProfile(profileData);
                handleDeficit(deficitData);
                if (sleepData.length > 0)
                    latestSleepRating(sleepData[0].total_sleep_hours.toFixed(0));
                setSleepHistory(sleepData.map((entry: any) => ({
                    date: entry.date,
                    hours: entry.total_sleep_hours
                })));
            } catch (e) {
                console.error(e);
                setError('Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        const latestSleepRating = (hours: number) => {
            setLatestSleep(hours);

            let rating = "Você teve uma noite de sono moderada. Observe seus hábitos diaramente para obter melhorias."
            if (hours > 6)
                rating = "Você teve uma ótima noite de sono! Isso ajuda a manter sua concentração e energia ao longo do dia."
            if (hours < 5)
                rating = "Você não teve uma noite de sono muito boa. Observe seu deficit de sono semanal para manter suas horas em dia!"

            setLatestSleepRating(rating);
            setLatestSleepColor(hours < 5 ? Colors.RedOrange : Colors.Astronaut)
        }

        const handleDeficit = (deficitData: any) => {
            const deficitColor = {
                "deficit": Colors.RedOrange[200],
                "even": Colors.dark.text,
                "surplus": Colors.Shamrock[200]
            }

            deficitData.color = deficitColor[deficitData.status as keyof typeof deficitColor];
            deficitData.natural = deficitData.status == "deficit" ? 'deficit' : 'superavit';
            setDeficit(deficitData)
        }

        fetchPageData();
    }, [refresh]);

    useEffect(() => {
        if (showDreamModal) {
            dreamModalRef.current?.open();
        } else {
            dreamModalRef.current?.close();
        }
    }, [showDreamModal]);

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

    const handlePlanPrediction = () => {
        handleEntryPost(true).then((response) => {
            if (response) {
                registryPlanPredictionRef.current?.open();
            }
        })
    };

    const onBackregistryPlanPrediction = () => {
        registryPlanPredictionRef.current?.close();
    };

    const handleSavePlan = () => {
        handleEntryPost(false).then((response) => {
            if (response) {
                setShowConfirmPlan(true);
            }
        })
    };

    const handleConfirmSavePlan = () => {
        const data: SleepPlanData = {
            sleepDate,
            goToBedTime,
            wakeUpTime,
            caffeineAmount,
            screenTime
        };
        handleSaveSleep(data);
        setShowConfirmPlan(false);
    };

    const handleSavePrev = () => {
        handleEntryPost(false).then((response) => {
            if (response) {
                setShowConfirmPrev(true);
            }
        })
    };

    const resetDreamForm = () => {
        setDreamDescription("");
        setDreamEmotion("1");
        setDreamError(null);
    };

    const finalizePrevSave = () => {
        const data: SleepPrevData = {
            sleepDate,
            goToBedTime,
            wakeUpTime,
            caffeineAmount,
            screenTime
        };
        handleSaveSleep(data);
        setShowConfirmPrev(false);
    };

    const handleClosePrevWithoutDream = () => {
        finalizePrevSave();
        router.replace('/(protected)/(tabs)');
    };

    const handleOpenDreamModal = () => {
        finalizePrevSave();
        resetDreamForm();
        setShowDreamModal(true);
    };

    const handleCloseDreamModal = () => {
        setShowDreamModal(false);
    };

    const handleDreamModalClosed = () => {
        setShowDreamModal(false);
        resetDreamForm();
        router.replace('/(protected)/(tabs)');
    };

    const handleSubmitDream = async () => {
        if (!entryId) {
            setDreamError("Não foi possível identificar o registro do sono.");
            return;
        }
        if (!dreamDescription.trim()) {
            setDreamError("Descreva o sonho antes de registrar.");
            return;
        }

        setDreamLoading(true);
        setDreamError(null);
        try {
            const { accessToken } = await getTokens();
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/entries/${entryId}/dream/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    emotion: Number(dreamEmotion),
                    text: dreamDescription.trim(),
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setDreamError(data.error || "Ocorreu um erro inesperado.");
                return;
            }

            setShowDreamModal(false);
        } catch (e) {
            console.error(e);
            setDreamError("Não foi possível conectar ao servidor. Tente novamente.");
        } finally {
            setDreamLoading(false);
        }
    };


    return (
        <LinearGradient colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.gradient}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ gap: 16 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <TypeSwitch selected={selected} setSelected={setSelected} />

                    <View style={styles.InputRow}>
                        <FText fontSize={16} style={styles.InputLabel}>Data</FText>
                        <UniversalDatePicker
                            value={sleepDate}
                            mode="date"
                            onChange={(date) => setSleepDate(date)}
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
                    {selected === "registrar" ? (
                        <View style={{display: 'flex', gap: 12}} >
                            <Divider />
                            <FText style={{display: 'flex', paddingHorizontal: 12}}>Anotações sobre o sono</FText>
                            <TextInput
                                multiline
                                textAlignVertical="top"
                                placeholder="Escreva suas anotações..."
                                placeholderTextColor={Colors.Astronaut[200]}
                                onContentSizeChange={(event) =>
                                    setHeight(event.nativeEvent.contentSize.height)
                                }
                                value={anotacao}
                                onChangeText={setAnotacao}
                                style={styles.TextInput}
                                returnKeyType="done"
                            />
                        </View>
                    ) : (null)}

                    <Divider />

                    <View style={styles.InputRow}>
                        <View style={{display: 'flex', gap: 4}}>
                            <FText>Cafeína consumida</FText>
                            <FText style={{color: Colors.Card.Stroke}} fontSize={12}>(Xícaras)</FText>
                        </View>
                        <Counter value={caffeineAmount} onValueChange={setCaffeineAmount} minValue={0} />
                    </View>
                    <View style={styles.InputRow}>
                        <FText>
                            Tempo de tela
                        </FText>
                        <Counter value={screenTime} onValueChange={setScreenTime} minValue={0} step={5} />
                    </View>

                    {selected === "planejar" ? (
                        <Button mode="contained" onPress={handlePlanPrediction} style={{ flex: 1, backgroundColor: Colors.Astronaut[900], marginBottom: 80 }} disabled={loading}><FText>Continuar</FText></Button>
                    ) : (
                        <Button mode="contained" onPress={handleSavePrev} style={{ flex: 1, backgroundColor: Colors.Astronaut[900], marginBottom: 80 }} disabled={loading}><FText>Confirmar</FText></Button>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modais */}
            <Modalize ref={registryPlanPredictionRef} {...modalizeOptions}
                FooterComponent={
                    <>
                        {error && <FText style={styles.errorText}>{error}</FText>}
                        <View style={styles.footer}>
                            <Button mode="outlined" onPress={onBackregistryPlanPrediction} style={{ flex: 1, borderColor: Colors.Astronaut[200] }} ><FText style={{ color: Colors.Astronaut[200] }}>Voltar</FText></Button>
                            <Button mode="contained" onPress={handleSavePlan} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }} disabled={loading} >
                                {loading ? (
                                    <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                                ) : (
                                    <FText>Salvar</FText>
                                )}
                            </Button>
                        </View>
                    </>
                }>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
                    {insightResults && <>
                        <SleepScore width={48} height={48} />
                        <FText fontSize={16}>Você planeja dormir por</FText>
                        <FText fontSize={24} fontWeight='bold'>{insightResults.time_string}</FText>
                        <Divider />
                        <View style={styles.predictionRow}>
                            <View style={styles.predictionLabel}><Readiness /><FText fontSize={16}>Produtividade:</FText></View>
                            <QualityChip label={insightResults.productivity_string} quality={insightResults.productivity_color} />
                        </View>
                        <View style={styles.predictionRow}>
                            <View style={styles.predictionLabel}><Readiness /><FText fontSize={16}>Estresse:</FText></View>
                            <QualityChip label={insightResults.stress_string} quality={insightResults.stress_color} />
                        </View>
                        <Divider />
                        <InsightIcon style={{ alignSelf: 'flex-start' }} />
                        <FText style={{ textAlign: 'center' }}>{insightResults.advice}</FText>
                    </>}
                </View>
            </Modalize>
            <ModalRN isVisible={showConfirmPlan} animationIn={'zoomIn'} animationOut={'zoomOut'}>
                <View style={{ backgroundColor: '#131623', borderColor: Colors.Card.Stroke, borderWidth: 1, borderRadius: 40, padding: 20, display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
                    <FText style={{ marginTop: 10, }}>Seu sono está planejado! Lembre-se de confirmar ou ajustar os horários reais ao acordar.</FText>
                    <TouchableOpacity onPress={handleConfirmSavePlan} style={{ backgroundColor: Colors.Astronaut[900], width: '100%', height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}><FText>Ok</FText></TouchableOpacity>

                </View>
            </ModalRN>
            <ModalRN isVisible={showConfirmPrev} animationIn={'zoomIn'} animationOut={'zoomOut'}>
                <View style={{ backgroundColor: '#131623', borderColor: Colors.Card.Stroke, borderWidth: 1, borderRadius: 40, padding: 20, display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
                    <FText style={{ marginTop: 10, }}>Seu sono está registrado!</FText>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 20, width: '100%' }}>
                        <TouchableOpacity onPress={handleClosePrevWithoutDream} style={{ borderColor: Colors.Astronaut[900], borderWidth: 1, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 50, flex: 1 }}><FText>Fechar</FText></TouchableOpacity>
                        <TouchableOpacity onPress={handleOpenDreamModal} style={{ backgroundColor: Colors.Astronaut[900], height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 50, flex: 1 }}><FText>Registrar Sonho</FText></TouchableOpacity>
                    </View>
                </View>
            </ModalRN>
            <Modalize
                ref={dreamModalRef}
                {...modalizeOptions}
                onClosed={handleDreamModalClosed}
                closeOnOverlayTap
            >
                <DreamRegisterModal
                    description={dreamDescription}
                    emotion={dreamEmotion}
                    loading={dreamLoading}
                    error={dreamError}
                    onChangeDescription={setDreamDescription}
                    onChangeEmotion={setDreamEmotion}
                    onBack={handleCloseDreamModal}
                    onSubmit={handleSubmitDream}
                />
            </Modalize>
        </LinearGradient>
    );
}

const modalizeOptions = {
    adjustToContentHeight: true,
    modalStyle: { backgroundColor: Colors.dark.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 25, paddingHorizontal: 25, borderWidth: 1, borderColor: Colors.Card.Stroke, borderBottomColor: "#00000000" }
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
        paddingHorizontal: 20,
        paddingTop: 20,
        // paddingBottom: 60
        
    },
    TextInput: {
        height: "auto",
        borderWidth: 1,
        padding: 16,
        borderRadius: 20,
        backgroundColor: Colors.Card.Background,
        borderColor: Colors.Card.Stroke,
        color: Colors.Astronaut[50],
    },
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
        gap: 8,
        // backgroundColor: Colors.Card.Background,
        padding: 12,
        borderRadius: 12,
        borderWidth: 0,
        // borderColor: Colors.Card.Stroke,

    },
    InputLabel:{
        display: 'flex',
        paddingVertical: 10
    },

    predictionRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    predictionLabel: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 },
    errorText: { color: '#ff8a80', textAlign: 'center', fontFamily: 'Fustat', fontSize: 14, marginBottom: -10, marginTop: 5, },
    footer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginVertical: 30 },
});
