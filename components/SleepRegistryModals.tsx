import { Colors } from "@/constants/Colors";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalRN from 'react-native-modal';
import { Modalize } from 'react-native-modalize';
import { Button, Divider } from 'react-native-paper';
import { Portal } from 'react-native-portalize';

import Readiness from '@/assets/icons/Readiness';
import SleepScore from '@/assets/icons/SleepScore';
import Counter from '@/components/Counter';
import FText from '@/components/FText';
import { QualityChip } from '@/components/QualityChip';
import { BlurView } from "expo-blur";


export interface SleepPlanData {
    sleepDate: Date;
    goToBedTime: Date;
    wakeUpTime: Date;
    caffeineAmount: number;
    exerciseMinutes: number;
}

export interface SleepPrevData {
    sleepDate: Date;
    goToBedTime: Date;
    wakeUpTime: Date;
    caffeineAmount: number;
    exerciseMinutes: number;
}

interface SleepRegistryModalsProps {
    onSave: (data: SleepPlanData) => void;
}

export interface SleepRegistryModalsRef {
    open: () => void;
}

const SleepRegistryModals = forwardRef<SleepRegistryModalsRef, SleepRegistryModalsProps>(
    ({ onSave }, ref) => {
        
        const [sleepDate, setSleepDate] = useState(new Date());
        const [goToBedTime, setGoToBedTime] = useState(new Date());
        const [wakeUpTime, setWakeUpTime] = useState(new Date());
        const [showPicker, setShowPicker] = useState(false);
        const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
        const [activePicker, setActivePicker] = useState<'date' | 'goToBed' | 'wakeUp'>('date');
        const [caffeineAmount, setCaffeineAmount] = useState(1);
        const [exerciseMinutes, setExerciseMinutes] = useState(30);
        const [tempDate, setTempDate] = useState(new Date());
        const [showConfirmPlan, setShowConfirmPlan] = useState(false);
        const [showConfirmPrev, setShowConfirmPrev] = useState(false);

        const registryTypeSelectRef = useRef<Modalize>(null);
        const registryPlan1Ref = useRef<Modalize>(null);
        const registryPlanPredictionRef = useRef<Modalize>(null);
        const registryPrevRef = useRef<Modalize>(null);


        
        useImperativeHandle(ref, () => ({
        open: () => {
            registryTypeSelectRef.current?.open();
        },
        }));

        
        const onOpenregistryTypeSelect = () => registryTypeSelectRef.current?.open();
        const onCloseregistryTypeSelect = () => registryTypeSelectRef.current?.close();

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
            onCloseregistryPlan1();
            registryPlanPredictionRef.current?.open();
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
            setShowConfirmPlan(true);
        };

        const handleConfirmSavePlan = () => {
            const data: SleepPlanData = {
                sleepDate,
                goToBedTime,
                wakeUpTime,
                caffeineAmount,
                exerciseMinutes
            };
            onSave(data);
            onCloseregistryPlanPrediction();
            setShowConfirmPlan(false);
        };


        const handleSavePrev = () => {
            setShowConfirmPrev(true);
        };

        const handleConfirmSavePrev = () => {
            const data: SleepPrevData = {
                sleepDate,
                goToBedTime,
                wakeUpTime,
                caffeineAmount,
                exerciseMinutes
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
                    <View style={styles.footer}>
                        <Button mode="outlined" onPress={onBackregistryPlan1} style={{ flex: 1, borderColor: Colors.Astronaut[200] }}><FText style={{color:Colors.Astronaut[200]}}>Voltar</FText></Button>
                        <Button mode="contained" onPress={onOpenregistryPlanPrediction} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }}>Avançar</Button>
                    </View>
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
                        <FText>Tempo de exercício</FText>
                        <Counter value={exerciseMinutes} onValueChange={setExerciseMinutes} step={5} minValue={0} label="min" />
                    </View>
                </View>
            </Modalize>

            <Modalize ref={registryPlanPredictionRef} {...modalizeOptions}
                FooterComponent={
                    <View style={styles.footer}>
                        <Button mode="outlined" onPress={onBackregistryPlanPrediction} style={{ flex: 1, borderColor: Colors.Astronaut[200] }} ><FText style={{color:Colors.Astronaut[200]}}>Voltar</FText></Button>
                        <Button mode="contained" onPress={handleSavePlan} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }} >Salvar</Button>
                    </View>
                }>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <SleepScore width={48} height={48} />
                    <FText fontSize={16}>Você planeja dormir por</FText>
                    <FText fontSize={24} fontWeight='bold'>7 horas e 20 minutos</FText>
                    <Divider />
                    <FText>Com base no seu histórico de sono, você pode esperar:</FText>
                    <View style={styles.predictionRow}>
                        <View style={styles.predictionLabel}><Readiness /><FText fontSize={16}>Produtividade:</FText></View>
                        <QualityChip label='Alta' quality="1" />
                    </View>
                    <View style={styles.predictionRow}> 
                        <View style={styles.predictionLabel}><Readiness /><FText fontSize={16}>Estresse:</FText></View>
                        <QualityChip label='Baixo' quality="1" />
                    </View>
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
                    <View style={styles.footer}>
                        <Button mode="outlined" onPress={onBackregistryPrev} style={{ flex: 1, borderColor: Colors.Astronaut[200] }} ><FText style={{color:Colors.Astronaut[200]}}>Voltar</FText></Button>
                        <Button mode="contained" onPress={handleSavePrev} style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }} >Registrar</Button>
                    </View>
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
                        <FText>Tempo de exercício</FText>
                        <Counter value={exerciseMinutes} onValueChange={setExerciseMinutes} step={5} minValue={0} label="min" />
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
});


export default SleepRegistryModals;