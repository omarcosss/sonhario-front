import InsightIcon from "@/assets/icons/InsightIcon";
import Readiness from "@/assets/icons/Readiness";
import SleepScore from "@/assets/icons/SleepScore";
import Counter from "@/components/Counter";
import FText from "@/components/FText";
import { QualityChip } from "@/components/QualityChip";
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ModalRN from "react-native-modal";
import { Modalize } from "react-native-modalize";
import { Button, Divider, SegmentedButtons } from "react-native-paper";
import { Portal } from "react-native-portalize";

// ————————————————————————————————————————————————————————————
// Types
// ————————————————————————————————————————————————————————————

export interface SleepPlanData {
  sleepDate: Date;
  goToBedTime: Date;
  wakeUpTime: Date;
  caffeineAmount: number;
  screenTime: number;
}

export interface SleepPrevData extends SleepPlanData {}

interface SleepRegistrySheetProps {
  onSave: (data: SleepPlanData | SleepPrevData) => void;
}

export interface SleepRegistrySheetRef {
  open: () => void;
}

// ————————————————————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————————————————————

const pad = (n: number) => String(n).padStart(2, "0");

const formatLocalDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const formatLocalTime = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}`;

const combineDateAndTime = (date: Date, time: Date) => {
  const merged = new Date(date);
  merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return merged;
};

const toAPIEntryPayload = (state: FormState) => ({
  date: formatLocalDate(state.sleepDate),
  sleep_start_time: formatLocalTime(state.goToBedTime),
  sleep_end_time: formatLocalTime(state.wakeUpTime),
  coffee_cups: state.caffeineAmount,
  screen_time: state.screenTime,
});

// ————————————————————————————————————————————————————————————
// API (thin wrapper + simple error surface)
// ————————————————————————————————————————————————————————————

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const { accessToken } = await getTokens();
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}${path}` as string,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Ocorreu um erro inesperado.");
  return data as T;
}

// ————————————————————————————————————————————————————————————
// State machine (single Modalize + steps)
// ————————————————————————————————————————————————————————————

type Step =
  | "typeSelect"
  | "planForm"
  | "planPrediction"
  | "prevForm"
  | "prevDream";

type FormState = {
  sleepDate: Date;
  goToBedTime: Date;
  wakeUpTime: Date;
  caffeineAmount: number;
  screenTime: number;
  // results / ids
  insightResults?: any | null;
  entryId?: number | null;
  // dream
  dreamDescription: string;
  emotion: "1" | "2" | "3";
};

type Action =
  | { type: "FIELD"; key: keyof FormState; value: any }
  | { type: "RESET_FORMS" };

const initialState: FormState = {
  sleepDate: new Date(),
  goToBedTime: new Date(),
  wakeUpTime: new Date(),
  caffeineAmount: 1,
  screenTime: 30,
  insightResults: null,
  entryId: null,
  dreamDescription: "",
  emotion: "1",
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "FIELD":
      return { ...state, [action.key]: action.value } as FormState;
    case "RESET_FORMS":
      return initialState;
    default:
      return state;
  }
}

// ————————————————————————————————————————————————————————————
// Component
// ————————————————————————————————————————————————————————————

const SleepRegistrySheet = forwardRef<
  SleepRegistrySheetRef,
  SleepRegistrySheetProps
>(({ onSave }, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState<Step>("typeSelect");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sheetRef = useRef<Modalize>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setStep("typeSelect");
      setError(null);
      sheetRef.current?.open();
    },
  }));

  const setField = useCallback((key: keyof FormState, value: any) => {
    dispatch({ type: "FIELD", key, value });
  }, []);

  // ——— DateTime picker (shared) ———
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [activePicker, setActivePicker] = useState<
    "date" | "goToBed" | "wakeUp"
  >("date");
  const [tempDate, setTempDate] = useState(new Date());

  const getPickerValue = (id: "date" | "goToBed" | "wakeUp") => {
    if (id === "date") return state.sleepDate;
    if (id === "goToBed") return state.goToBedTime;
    return state.wakeUpTime;
  };

  const showPicker = (
    mode: "date" | "time",
    id: "date" | "goToBed" | "wakeUp"
  ) => {
    setPickerMode(mode);
    setActivePicker(id);
    setTempDate(getPickerValue(id));
    setPickerVisible(true);
  };

  const onChangePicker = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setPickerVisible(false);
    if (!selected) return;
    if (Platform.OS === "android") finalizePicker(selected);
    else setTempDate(selected);
  };

  const finalizePicker = (d: Date) => {
    if (activePicker === "date") setField("sleepDate", d);
    else if (activePicker === "goToBed") setField("goToBedTime", d);
    else setField("wakeUpTime", d);
  };

  // ——— Derived ———
  const plannedDurationText = useMemo(() => {
    const start = combineDateAndTime(state.sleepDate, state.goToBedTime);
    const end = combineDateAndTime(state.sleepDate, state.wakeUpTime);
    const durMs = end.getTime() - start.getTime();
    if (durMs <= 0) return "—";
    const h = Math.floor(durMs / (1000 * 60 * 60));
    const m = Math.floor((durMs / (1000 * 60)) % 60);
    return `${h}h ${pad(m)}m`;
  }, [state.sleepDate, state.goToBedTime, state.wakeUpTime]);

  // ——— Actions ———
  const getInsightAndContinue = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = toAPIEntryPayload(state);
      const data = await apiPost<{ data: any }>("/insight/entry/", payload);
      setField("insightResults", data.data);
      setStep("planPrediction");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (goTo: Step | null = null) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toAPIEntryPayload(state);
      const data = await apiPost<{ id: number }>("/entries/", payload);
      setField("entryId", data.id);
      if (goTo) setStep(goTo);
      else {
        // Confirm-only flow (plan)
        setConfirm({ visible: true, kind: "plan" });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addDream = async () => {
    if (!state.entryId) {
      setError("Não foi possível identificar o registro do sono.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiPost(`/entries/${state.entryId}/dream/`, {
        text: state.dreamDescription,
        emotion: state.emotion,
      });
      setConfirm({ visible: true, kind: "dream" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ——— Confirm modals ———
  const [confirm, setConfirm] = useState<{
    visible: boolean;
    kind: "plan" | "prev" | "dream";
  }>({ visible: false, kind: "plan" });

  const confirmOk = () => {
    const payload: SleepPlanData = {
      sleepDate: state.sleepDate,
      goToBedTime: state.goToBedTime,
      wakeUpTime: state.wakeUpTime,
      caffeineAmount: state.caffeineAmount,
      screenTime: state.screenTime,
    };
    onSave(payload);
    setConfirm({ ...confirm, visible: false });
    sheetRef.current?.close();
    dispatch({ type: "RESET_FORMS" });
  };

  // ————————————————————————————————————————————————————————————
  // UI
  // ————————————————————————————————————————————————————————————

  return (
    <Portal>
      <Modalize ref={sheetRef} {...modalizeOptions}>
        {step === "typeSelect" && (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginBottom: 50,
            }}
          >
            <PrimaryBtn onPress={() => setStep("planForm")}>
              Planejar Sono
            </PrimaryBtn>
            <SecondaryBtn onPress={() => setStep("prevForm")}>
              Registrar Sono Passado
            </SecondaryBtn>
            <GhostBtn onPress={() => sheetRef.current?.close()}>
              Cancelar
            </GhostBtn>
          </View>
        )}

        {step === "planForm" && (
          <FormView
            state={state}
            setField={setField}
            showPicker={showPicker}
            footer={
              <Footer error={error}>
                <Button
                  mode="outlined"
                  onPress={() => setStep("typeSelect")}
                  style={{ flex: 1, borderColor: Colors.Astronaut[200] }}
                >
                  <FText style={{ color: Colors.Astronaut[200] }}>Voltar</FText>
                </Button>
                <Button
                  mode="contained"
                  onPress={getInsightAndContinue}
                  style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.Astronaut[100]}
                    />
                  ) : (
                    "Avançar"
                  )}
                </Button>
              </Footer>
            }
          >
            <Divider />
            <InfoRow label="Duração planejada" value={plannedDurationText} />
          </FormView>
        )}

        {step === "planPrediction" && (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {state.insightResults && (
              <>
                <SleepScore width={48} height={48} />
                <FText fontSize={16}>Você planeja dormir por</FText>
                <FText fontSize={24} fontWeight="bold">
                  {state.insightResults.time_string}
                </FText>
                <Divider />
                <View style={styles.predictionRow}>
                  <View style={styles.predictionLabel}>
                    <Readiness />
                    <FText fontSize={16}>Produtividade:</FText>
                  </View>
                  <QualityChip
                    label={state.insightResults.productivity_string}
                    quality={state.insightResults.productivity_color}
                  />
                </View>
                <View style={styles.predictionRow}>
                  <View style={styles.predictionLabel}>
                    <Readiness />
                    <FText fontSize={16}>Estresse:</FText>
                  </View>
                  <QualityChip
                    label={state.insightResults.stress_string}
                    quality={state.insightResults.stress_color}
                  />
                </View>
                <Divider />
                <InsightIcon style={{ alignSelf: "flex-start" }} />
                <FText style={{ textAlign: "center" }}>
                  {state.insightResults.advice}
                </FText>
              </>
            )}
            <Footer error={error}>
              <Button
                mode="outlined"
                onPress={() => setStep("planForm")}
                style={{ flex: 1, borderColor: Colors.Astronaut[200] }}
              >
                <FText style={{ color: Colors.Astronaut[200] }}>Voltar</FText>
              </Button>
              <Button
                mode="contained"
                onPress={() => saveEntry(null)}
                style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.Astronaut[100]}
                  />
                ) : (
                  "Salvar"
                )}
              </Button>
            </Footer>
          </View>
        )}

        {step === "prevForm" && (
          <FormView
            state={state}
            setField={setField}
            showPicker={showPicker}
            footer={
              <Footer error={error}>
                <Button
                  mode="outlined"
                  onPress={() => setStep("typeSelect")}
                  style={{ flex: 1, borderColor: Colors.Astronaut[200] }}
                >
                  <FText style={{ color: Colors.Astronaut[200] }}>
                    Cancelar
                  </FText>
                </Button>
                <Button
                  mode="contained"
                  onPress={() => saveEntry("prevDream")}
                  style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.Astronaut[100]}
                    />
                  ) : (
                    "Registrar"
                  )}
                </Button>
              </Footer>
            }
          />
        )}

        {step === "prevDream" && (
          <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <FText>Descreva o seu sonho</FText>
            <TextInput
              placeholder="Hoje eu sonhei que..."
              value={state.dreamDescription}
              onChangeText={(t) => setField("dreamDescription", t)}
              autoCapitalize="none"
              style={styles.dreamInput}
            />
            <SegmentedButtons
              value={state.emotion}
              onValueChange={(v) => setField("emotion", v as any)}
              buttons={[
                { value: "1", label: "😊" },
                { value: "2", label: "😢" },
                { value: "3", label: "🤨" },
              ]}
            />
            <Footer error={error}>
              <Button
                mode="outlined"
                onPress={() => setStep("prevForm")}
                style={{ flex: 1, borderColor: Colors.Astronaut[200] }}
              >
                <FText style={{ color: Colors.Astronaut[200] }}>Voltar</FText>
              </Button>
              <Button
                mode="contained"
                onPress={addDream}
                style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.Astronaut[100]}
                  />
                ) : (
                  "Registrar"
                )}
              </Button>
            </Footer>
          </View>
        )}
      </Modalize>

      {/* Shared iOS/Android picker modal */}
      <Modal
        transparent
        animationType="slide"
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPickerVisible(false)}
        >
          <BlurView intensity={40} style={styles.modalContent}>
            <DateTimePicker
              value={tempDate}
              mode={pickerMode}
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangePicker}
              themeVariant="dark"
            />
            {Platform.OS === "ios" && (
              <View style={styles.iosPickerHeader}>
                <Button
                  textColor={Colors.Astronaut[100]}
                  onPress={() => setPickerVisible(false)}
                >
                  Cancelar
                </Button>
                <Button
                  textColor={Colors.Astronaut[100]}
                  onPress={() => {
                    finalizePicker(tempDate);
                    setPickerVisible(false);
                  }}
                >
                  Confirmar
                </Button>
              </View>
            )}
          </BlurView>
        </Pressable>
      </Modal>

      {/* Small confirmations */}
      <ModalRN
        isVisible={confirm.visible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.confirmBox}>
          <FText style={{ marginTop: 10 }}>
            {confirm.kind === "plan"
              ? "Seu sono está planejado! Lembre-se de confirmar ou ajustar os horários reais ao acordar."
              : confirm.kind === "prev"
              ? "Seu sono foi registrado!"
              : "Sonho registrado!"}
          </FText>
          <TouchableOpacity onPress={confirmOk} style={styles.confirmBtn}>
            <FText>Ok</FText>
          </TouchableOpacity>
        </View>
      </ModalRN>
    </Portal>
  );
});

// ————————————————————————————————————————————————————————————
// Child UI building blocks
// ————————————————————————————————————————————————————————————

const FormView: React.FC<{
  state: FormState;
  setField: (k: keyof FormState, v: any) => void;
  showPicker: (
    mode: "date" | "time",
    id: "date" | "goToBed" | "wakeUp"
  ) => void;
  footer: React.ReactNode;
  children?: React.ReactNode;
}> = ({ state, setField, showPicker, footer, children }) => {
  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <View style={styles.row}>
        <FText>Data</FText>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => showPicker("date", "date")}
        >
          <FText>{state.sleepDate.toLocaleDateString("pt-BR")}</FText>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <FText>Vou dormir às</FText>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => showPicker("time", "goToBed")}
        >
          <FText>
            {state.goToBedTime.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </FText>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <FText>Vou acordar às</FText>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => showPicker("time", "wakeUp")}
        >
          <FText>
            {state.wakeUpTime.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </FText>
        </TouchableOpacity>
      </View>
      <Divider />
      <View style={styles.row}>
        <FText>Cafeína consumida</FText>
        <Counter
          value={state.caffeineAmount}
          onValueChange={(v) => setField("caffeineAmount", v)}
          minValue={0}
        />
      </View>
      <View style={styles.row}>
        <FText>Tempo de tela</FText>
        <Counter
          value={state.screenTime}
          onValueChange={(v) => setField("screenTime", v)}
          step={5}
          minValue={0}
          label="min"
        />
      </View>
      {children}
      <FooterSpacer />
      {footer}
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <FText>{label}</FText>
    <FText>{value}</FText>
  </View>
);

const FooterSpacer = () => <View style={{ height: 10 }} />;

const Footer: React.FC<{ error: string | null; children: React.ReactNode }> = ({
  error,
  children,
}) => (
  <>
    {error && <FText style={styles.errorText}>{error}</FText>}
    <View style={styles.footer}>{children}</View>
  </>
);

const PrimaryBtn: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
}> = ({ onPress, children }) => (
  <TouchableOpacity onPress={onPress} style={styles.primaryBtn}>
    <FText>{children as any}</FText>
  </TouchableOpacity>
);

const SecondaryBtn: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
}> = ({ onPress, children }) => (
  <TouchableOpacity onPress={onPress} style={styles.secondaryBtn}>
    <FText> {children as any} </FText>
  </TouchableOpacity>
);

const GhostBtn: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
}> = ({ onPress, children }) => (
  <TouchableOpacity onPress={onPress} style={styles.ghostBtn}>
    <FText>{children as any}</FText>
  </TouchableOpacity>
);

// ————————————————————————————————————————————————————————————
// Styles
// ————————————————————————————————————————————————————————————

const modalizeOptions = {
  adjustToContentHeight: true,
  modalStyle: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 25,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: Colors.Card.Stroke,
    borderBottomColor: "#00000000",
  },
};

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginVertical: 30,
  },
  predictionRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  predictionLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  datePickerButton: {
    display: "flex",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: Colors.Card.Background,
    borderWidth: 1,
    borderColor: Colors.Card.Stroke,
  },
  dreamInput: {
    backgroundColor: Colors.Card.Background,
    height: 200,
    padding: 12,
    textAlign: "left",
    textAlignVertical: "top",
    borderRadius: 15,
    color: Colors.Astronaut[50],
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderRadius: 20,
    padding: 16,
    margin: 20,
    overflow: "hidden",
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
  },
  errorText: {
    color: "#ff8a80",
    textAlign: "center",
    fontFamily: "Fustat",
    fontSize: 14,
    marginBottom: -10,
    marginTop: 5,
  },
  confirmBox: {
    backgroundColor: "#131623",
    borderColor: Colors.Card.Stroke,
    borderWidth: 1,
    borderRadius: 40,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: Colors.Astronaut[900],
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: Colors.Astronaut[900],
    height: 65,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtn: {
    flex: 1,
    borderColor: Colors.Astronaut[200],
    height: 65,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  ghostBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

SleepRegistrySheet.displayName = "SleepRegistrySheet";

export default SleepRegistrySheet;
