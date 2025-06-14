import { Colors } from "@/constants/Colors";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalRN from 'react-native-modal';
import { Modalize } from 'react-native-modalize';
import { Button, Divider } from 'react-native-paper';
import { Portal } from 'react-native-portalize';

import InsightIcon from "@/assets/icons/InsightIcon";
import Readiness from '@/assets/icons/Readiness';
import SleepScore from '@/assets/icons/SleepScore';
import Counter from '@/components/Counter';
import FText from '@/components/FText';
import { QualityChip } from '@/components/QualityChip';
import { getTokens } from "@/utils/authStorage";
import { BlurView } from "expo-blur";


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

interface SleepRegistryModalsProps {
    onSave: (data: SleepPlanData) => void;
}

export interface SleepRegistryModalsRef {
    open: () => void;
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

const SleepRegistryModals = forwardRef<SleepRegistryModalsRef, SleepRegistryModalsProps>(
    ({ onSave }, ref) => {

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        
        const [sleepDate, setSleepDate] = useState(new Date());
        const [goToBedTime, setGoToBedTime] = useState(new Date());
        const [wakeUpTime, setWakeUpTime] = useState(new Date());
        const [showPicker, setShowPicker] = useState(false);
        const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
        const [activePicker, setActivePicker] = useState<'date' | 'goToBed' | 'wakeUp'>('date');
        const [caffeineAmount, setCaffeineAmount] = useState(1);
        // const [exerciseMinutes, setExerciseMinutes] = useState(30);
        const [screenTime, setScreenTime] = useState(30);
        const [tempDate, setTempDate] = useState(new Date());
        const [showConfirmPlan, setShowConfirmPlan] = useState(false);
        const [showConfirmPrev, setShowConfirmPrev] = useState(false);

        const [insightResults, setInsightResults] = useState<any>(null);

        const registryTypeSelectRef = useRef<Modalize>(null);
        const registryPlan1Ref = useRef<Modalize>(null);
        const registryPlanPredictionRef = useRef<Modalize>(null);
        const registryPrevRef = useRef<Modalize>(null);
       
        useImperativeHandle(ref, () => ({
        open: () => {
            registryTypeSelectRef.current?.open();
        },
        }));

        const handleEntryPost = async (insight: boolean=false) => {
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
                    if (insight) setInsightResults(data.data);
                }
            } catch (e) {
                console.error(e);
                setError('Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                setLoading(false);
                return success;
            }
        };

        const onOpenregistryTypeSelect = () => {
            setError(null);
            registryTypeSelectRef.current?.open();
        }
        const onCloseregistryTypeSelect = () => {
            registryTypeSelectRef.current?.close();
        }

        const onOpenregistryPlan1 = () => {
            onCloseregistryTypeSelect();
            registryPlan1Ref.current?.open();
        };
        const onBackregistryPlan1 = () => {
            registryPlan1Ref.current?.close();
            onOpenregistryTypeSelect();
        };
        const onCloseregistryPlan1 = () => registryPlan1Ref.current?.close();

        const onOpenregistryPlanPrediction = () => {
            handleEntryPost(true).then((response) => {
                if (response) {
                    onCloseregistryPlan1();
                    registryPlanPredictionRef.current?.open();
                }
            })
        };
        const onBackregistryPlanPrediction = () => {
            registryPlanPredictionRef.current?.close();
            onOpenregistryPlan1();
        };
        const onCloseregistryPlanPrediction = () => registryPlanPredictionRef.current?.close();

        const onOpenregistryPrev = () => {
            onCloseregistryTypeSelect();
            registryPrevRef.current?.open();
        };
        const onBackregistryPrev = () => {
            registryPrevRef.current?.close();
            onOpenregistryTypeSelect();
        };
        const onCloseregistryPrev = () => registryPrevRef.current?.close();

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
            onSave(data);
            onCloseregistryPlanPrediction();
            setShowConfirmPlan(false);
        };


        const handleSavePrev = () => {
            handleEntryPost(false).then((response) => {
                if (response) {
                    setShowConfirmPrev(true);
                }
            })
        };

        const handleConfirmSavePrev = () => {
            const data: SleepPrevData = {
                sleepDate,
                goToBedTime,
                wakeUpTime,
                caffeineAmount,
                screenTime
            };
            onSave(data);
            onCloseregistryPrev();
            setShowConfirmPrev(false);
        };

        const handleAddDream = () => {
            //nada ainda
        }


        // DateTimePicker change handler
        const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
            if (Platform.OS === 'android') setShowPicker(false);
            if (selectedDate) {
                if (Platform.OS === 'android') updateFinalDate(selectedDate);
                else setTempDate(selectedDate);
            }
        };
        const handleIosConfirm = () => {
            updateFinalDate(tempDate);
            setShowPicker(false);
        };
        const updateFinalDate = (dateToSet: Date) => {
            switch (activePicker) {
                case 'date': setSleepDate(dateToSet); break;
                case 'goToBed': setGoToBedTime(dateToSet); break;
                case 'wakeUp': setWakeUpTime(dateToSet); break;
            }
        };
        const showMode = (mode: 'date' | 'time', pickerId: 'date' | 'goToBed' | 'wakeUp') => {
            const currentValue = getPickerValue(pickerId);
            setTempDate(currentValue);
            setShowPicker(true);
            setPickerMode(mode);
            setActivePicker(pickerId);
        };
        const getPickerValue = (pickerId: 'date' | 'goToBed' | 'wakeUp') => {
            switch (pickerId) {
                case 'date': return sleepDate;
                case 'goToBed': return goToBedTime;
                case 'wakeUp': return wakeUpTime;
                default: return new Date();
            }
        };

        return (
        <Portal>
            <Modalize ref={registryTypeSelectRef} {...modalizeOptions}>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 50 }}>
                    <TouchableOpacity onPress={onOpenregistryPlan1} style={{ flex: 1, backgroundColor: Colors.Astronaut[900], height: 65, borderRadius: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <FText>Planejar Sono</FText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onOpenregistryPrev} style={{ flex: 1, borderColor: Colors.Astronaut[200], height: 65, borderRadius: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', borderWidth: 1 }} >
                        <FText>Registrar Sono Passado</FText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onCloseregistryTypeSelect} style={{ flex: 1, height: 40, borderRadius: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <FText>Cancelar</FText>
                    </TouchableOpacity>
                </View>
            </Modalize>
            
            <Modalize ref={registryPlan1Ref} {...modalizeOptions}
                FooterComponent={
                    <>
                    {error && <FText style={styles.errorText}>{error}</FText>}
                    <View style={styles.footer}>
                        <Button mode="outlined" onPress={onBackregistryPlan1} style={{ flex: 1, borderColor: Colors.Astronaut[200] }}><FText style={{color:Colors.Astronaut[200]}}>Voltar</FText></Button>
                        <Button mode="contained" onPress={onOpenregistryPlanPrediction} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }} disabled={loading} >
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                            ) : (
                                "Avançar"
                            )}
                        </Button>
                    </View>
                    </>
                }>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <View style={styles.row}>
                        <FText>Data</FText>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => showMode('date', 'date')} >
                            <FText>{sleepDate.toLocaleDateString('pt-BR')}</FText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FText>Vou dormir às</FText>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => showMode('time', 'goToBed')} >
                            <FText>{goToBedTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</FText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FText>Vou acordar às</FText>
                        <TouchableOpacity onPress={() => showMode('time', 'wakeUp')} style={styles.datePickerButton} >
                            <FText>{wakeUpTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</FText>
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <View style={styles.row}>
                        <FText>Cafeina consumida</FText>
                        <Counter value={caffeineAmount} onValueChange={setCaffeineAmount} minValue={0} />
                    </View>
                    <View style={styles.row}>
                        <FText>Tempo de tela</FText>
                        <Counter value={screenTime} onValueChange={setScreenTime} step={5} minValue={0} label="min" />
                    </View>
                </View>
            </Modalize>

            <Modalize ref={registryPlanPredictionRef} {...modalizeOptions}
                FooterComponent={
                    <>
                    {error && <FText style={styles.errorText}>{error}</FText>}
                    <View style={styles.footer}>
                        <Button mode="outlined" onPress={onBackregistryPlanPrediction} style={{ flex: 1, borderColor: Colors.Astronaut[200] }} ><FText style={{color:Colors.Astronaut[200]}}>Voltar</FText></Button>
                        <Button mode="contained" onPress={handleSavePlan} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }} disabled={loading} >
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                            ) : (
                                "Salvar"
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
                        <InsightIcon style={{ alignSelf: 'flex-start' }}  />
                        <FText style={{textAlign: 'center'}}>{insightResults.advice}</FText>
                    </>}
                </View>
            </Modalize>

            <ModalRN isVisible={showConfirmPlan} animationIn={'zoomIn'} animationOut={'zoomOut'}>
                <View style={{ backgroundColor: '#131623', borderColor: Colors.Card.Stroke, borderWidth: 1, borderRadius: 40, padding: 20, display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
                    <FText style={{ marginTop: 10, }}>Seu sono está planejado! Lembre-se de confirmar ou ajustar os horários reais ao acordar.</FText>
                    <TouchableOpacity onPress={handleConfirmSavePlan} style={{ backgroundColor: Colors.Astronaut[900], width: '100%', height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}><FText>Ok</FText></TouchableOpacity>
                    
                </View>
            </ModalRN>

            <Modal transparent={true} animationType="slide" visible={showPicker} onRequestClose={() => setShowPicker(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)}>
                    <BlurView intensity={40} style={styles.modalContent}>
                        <DateTimePicker value={tempDate} mode={pickerMode} is24Hour={true} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onChange} themeVariant='dark' />
                        {Platform.OS === 'ios' && (
                            <View style={styles.iosPickerHeader}>
                                <Button textColor={Colors.Astronaut[100]} onPress={() => setShowPicker(false)}>Cancelar</Button>
                                <Button textColor={Colors.Astronaut[100]} onPress={handleIosConfirm}>Confirmar</Button>
                            </View>
                        )}
                    </BlurView>
                </Pressable>
            </Modal>

            <Modalize ref={registryPrevRef} {...modalizeOptions}
                FooterComponent={
                    <>
                    {error && <FText style={styles.errorText}>{error}</FText>}
                    <View style={styles.footer}>
                        <Button mode="outlined" onPress={onBackregistryPrev} style={{ flex: 1, borderColor: Colors.Astronaut[200] }} ><FText style={{color:Colors.Astronaut[200]}}>Voltar</FText></Button>
                        <Button mode="contained" onPress={handleSavePrev} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }} disabled={loading} >
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                            ) : (
                                "Registrar"
                            )}
                        </Button>
                    </View>
                    </>
                }>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <View style={styles.row}>
                        <FText>Data</FText>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => showMode('date', 'date')} >
                            <FText>{sleepDate.toLocaleDateString('pt-BR')}</FText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FText>Vou dormir às</FText>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => showMode('time', 'goToBed')} >
                            <FText>{goToBedTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</FText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <FText>Vou acordar às</FText>
                        <TouchableOpacity onPress={() => showMode('time', 'wakeUp')} style={styles.datePickerButton} >
                            <FText>{wakeUpTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</FText>
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <View style={styles.row}>
                        <FText>Cafeina consumida</FText>
                        <Counter value={caffeineAmount} onValueChange={setCaffeineAmount} minValue={0} />
                    </View>
                    <View style={styles.row}>
                        <FText>Tempo de tela</FText>
                        <Counter value={screenTime} onValueChange={setScreenTime} step={5} minValue={0} label="min" />
                    </View>
                </View>
            </Modalize>

            <ModalRN isVisible={showConfirmPrev} animationIn={'zoomIn'} animationOut={'zoomOut'}>
                <View style={{ backgroundColor: '#131623', borderColor: Colors.Card.Stroke, borderWidth: 1, borderRadius: 40, padding: 20, display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
                    <FText style={{ marginTop: 10, }}>Seu sono está planejado! Lembre-se de confirmar ou ajustar os horários reais ao acordar.</FText>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 20, width: '100%' }}>
                        <TouchableOpacity onPress={handleConfirmSavePrev} style={{ borderColor: Colors.Astronaut[900], borderWidth: 1, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 50, flex: 1 }}><FText>Fechar</FText></TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirmSavePrev} style={{ backgroundColor: Colors.Astronaut[900], height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 50, flex: 1 }}><FText>Registrar Sonho</FText></TouchableOpacity>
                    </View>
                    
                </View>
            </ModalRN>
        </Portal>
        );
    }
);

const modalizeOptions = {
    adjustToContentHeight: true,
    modalStyle: { backgroundColor: Colors.dark.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 25, paddingHorizontal: 25, borderWidth: 1, borderColor: Colors.Card.Stroke, borderBottomColor: "#00000000" }
};

const styles = StyleSheet.create({
    row: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    footer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginVertical: 30 },
    predictionRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    predictionLabel: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 },
    datePickerButton: { display: 'flex', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 50, backgroundColor: Colors.Card.Background, borderWidth: 1, borderColor: Colors.Card.Stroke },
    modalBackdrop: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { borderRadius: 20, padding: 16, margin: 20, overflow: 'hidden' },
    iosPickerHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#3A3A3C' },
    errorText: { color: '#ff8a80', textAlign: 'center', fontFamily: 'Fustat', fontSize: 14, marginBottom: -10, marginTop: 5,
  },
});


export default SleepRegistryModals;