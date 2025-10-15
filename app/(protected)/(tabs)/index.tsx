import EvenDeficit from "@/assets/icons/EvenDeficit";
import SleepScore from "@/assets/icons/SleepScore";
import FText from "@/components/FText";
import Greeting from "@/components/Greeting";
import SleepChart from "@/components/SleepChart";
import SleepRegistrySheet, {
  SleepPlanData,
  SleepRegistrySheetRef,
} from "@/components/SleepRegistryModals";
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import { LinearGradient } from "expo-linear-gradient";
import { Link, RelativePathString } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View,Text,Alert, ScrollView } from "react-native";
import { ActivityIndicator, Button, Surface } from "react-native-paper";
// --- 1. IMPORTAÇÕES DAS NOTIFICAÇÕES ---
// Importações das notificações
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { scheduleSleepNotification, scheduleWakeUpNotification, cancelAllNotifications } from '@/services/notificationService';

interface SleepEntry {
  date: string;
  hours: number;
}


export default function HomeScreen() {
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [profile, setProfile] = useState<any>();
  const [sleepHistory, setSleepHistory] = useState<
    (SleepEntry | null | undefined)[] | undefined
  >(undefined);
  const [latestSleep, setLatestSleep] = useState<number>(0);
  const [latestSleepRating, setLatestSleepRating] = useState<string>();
  const [latestSleepColor, setLatestSleepColor] = useState<any>();
  const [deficit, setDeficit] = useState<any>();

  // --- 2. ESTADOS PARA CONTROLE DAS NOTIFICAÇÕES ---
  // --- Novos estados para as notificações ---
  const [sleepTime, setSleepTime] = useState(new Date());
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerFor, setPickerFor] = useState<'sleep' | 'wake' | null>(null);

  const sleepRegistryRef = useRef<SleepRegistrySheetRef>(null);
  // --- 3. FUNÇÕES PARA LIDAR COM AS NOTIFICAÇÕES ---
  // --- Novas funções para notificações ---
  const openPicker = (forTime: 'sleep' | 'wake') => {
    setPickerFor(forTime);
    setShowPicker(true);
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // No iOS, o picker fica aberto
    if (selectedDate) {
      if (pickerFor === 'sleep') {
        setSleepTime(selectedDate);
      } else if (pickerFor === 'wake') {
        setWakeUpTime(selectedDate);
      }
    }
  };

  const handleSaveReminders = () => {
    // Agenda ambas as notificações
    scheduleSleepNotification({ hour: sleepTime.getHours(), minute: sleepTime.getMinutes() });
    scheduleWakeUpNotification({ hour: wakeUpTime.getHours(), minute: wakeUpTime.getMinutes() });
    setShowPicker(false);
  };
  const handleCancelReminders = () => {
    cancelAllNotifications();
    setShowPicker(false);
  };

  const handleSaveSleepPlan = (data: SleepPlanData) => {
    setRefresh(!refresh);
  };

  const onAddSleepPress = () => {
    sleepRegistryRef.current?.open();
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchPageData = async () => {
      try {
        const { accessToken } = await getTokens();
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        const [profileResponse, sleepResponse, deficitResponse] =
          await Promise.all([
            fetch(process.env.EXPO_PUBLIC_API_URL + "/profile/", {
              method: "GET",
              headers,
            }),
            fetch(process.env.EXPO_PUBLIC_API_URL + "/entries/?limit=7", {
              method: "GET",
              headers,
            }),
            fetch(process.env.EXPO_PUBLIC_API_URL + "/insight/deficit/", {
              method: "GET",
              headers,
            }),
          ]);
        if (!profileResponse.ok || !sleepResponse.ok || !deficitResponse.ok) {
          throw new Error("Falha em uma das requisições à API.");
        }
        const [profileData, sleepData, deficitData] = await Promise.all([
          profileResponse.json(),
          sleepResponse.json(),
          deficitResponse.json(),
        ]);

        setProfile(profileData);
        handleDeficit(deficitData);
        if (sleepData.length > 0)
          latestSleepRating(sleepData[0].total_sleep_hours.toFixed(0));
        setSleepHistory(
          sleepData.map((entry: any) => ({
            date: entry.date,
            hours: entry.total_sleep_hours,
          }))
        );
      } catch (e) {
        console.error(e);
        setError("Não foi possível conectar ao servidor. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    const latestSleepRating = (hours: number) => {
      setLatestSleep(hours);

      let rating =
        "Você teve uma noite de sono moderada. Observe seus hábitos diaramente para obter melhorias.";
      if (hours > 6)
        rating =
          "Você teve uma ótima noite de sono! Isso ajuda a manter sua concentração e energia ao longo do dia.";
      if (hours < 5)
        rating =
          "Você não teve uma noite de sono muito boa. Observe seu deficit de sono semanal para manter suas horas em dia!";

      setLatestSleepRating(rating);
      setLatestSleepColor(hours < 5 ? Colors.RedOrange : Colors.Astronaut);
    };

    const handleDeficit = (deficitData: any) => {
      const deficitColor = {
        deficit: Colors.RedOrange[200],
        even: Colors.dark.text,
        surplus: Colors.Shamrock[200],
      };

      deficitData.color =
        deficitColor[deficitData.status as keyof typeof deficitColor];
      deficitData.natural =
        deficitData.status == "deficit" ? "deficit" : "superavit";
      setDeficit(deficitData);
    };

    fetchPageData();
  }, [refresh]);

  return (
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.00)", "rgba(50, 64, 123, 0.40)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView>
          {error && <FText style={styles.errorText}>{error}</FText>}
          {loading && !error ? (
            <ActivityIndicator
              style={{ marginTop: 420 }}
              size="large"
              color={Colors.Astronaut[100]}
            />
          ) : (
            <>
              <Greeting first_name={profile.first_name} />
              <View style={styles.container}>
                <Surface style={styles.surfaceCard} elevation={4}>
                  {sleepHistory && sleepHistory.length > 0 ? (
                    <>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FText
                          style={{
                            color: Colors.Astronaut[50],
                          }}
                        >
                          Último Registro:
                        </FText>
                        <Link href={"/entries" as RelativePathString}>
                          <Button
                            mode="contained"
                            style={{
                              backgroundColor: Colors.Card.Stroke,
                              backgroundBlendMode: "multiply",
                              borderWidth: 1,
                              borderColor: Colors.Card.Stroke,
                            }}
                          >
                            <FText
                              style={{
                                color: Colors.Astronaut[200],
                              }}
                            >
                              Ver todos
                            </FText>
                          </Button>
                        </Link>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <SleepScore
                          iconColor={latestSleepColor[200]}
                          shadowColor={latestSleepColor[600]}
                          shadowRadius={20}
                        />
                        <FText
                          style={{
                            color: latestSleepColor[200],
                            overflow: "visible",
                            padding: 7,
                            fontSize: 32,
                            fontWeight: "700",
                            textShadowColor: latestSleepColor[900],
                            textShadowOffset: {
                              width: 0,
                              height: 0,
                            },
                            textShadowRadius: 20,
                          }}
                        >
                          {latestSleep}h
                        </FText>
                      </View>
                      <FText>{latestSleepRating}</FText>
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <FText
                          style={{
                            color: Colors.Astronaut[50],
                          }}
                        >
                          Seus Registros:
                        </FText>
                        <Link href={"/entries" as RelativePathString}>
                          <Button
                            mode="contained"
                            style={{
                              backgroundColor: Colors.Card.Stroke,
                              backgroundBlendMode: "multiply",
                              borderWidth: 1,
                              borderColor: Colors.Card.Stroke,
                            }}
                          >
                            <FText
                              style={{
                                color: Colors.Astronaut[200],
                              }}
                            >
                              Ver todos
                            </FText>
                          </Button>
                        </Link>
                      </View>
                      <FText>Você ainda não fez nenhum registro de sono.</FText>
                      <FText>Vamos começar hoje?</FText>
                    </>
                  )}

                  <SleepChart sleepDataLast7Days={sleepHistory} />
                </Surface>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 20,
                    width: "100%",
                    flex: 1,
                    height: 140,
                  }}
                >
                  <Surface style={styles.smallCard} elevation={4}>
                    {deficit && deficit.status != "even" ? (
                      <>
                        <FText
                          style={{
                            fontWeight: "200",
                          }}
                        >
                          Você está com:
                        </FText>
                        <FText
                          style={{
                            color: deficit.color,
                            fontSize: 32,
                            fontWeight: "700",
                          }}
                        >
                          {deficit.value}h
                        </FText>
                        <FText
                          style={{
                            fontWeight: "400",
                          }}
                        >
                          de {deficit.natural} de sono esta semana
                        </FText>
                      </>
                    ) : (
                      <>
                        <EvenDeficit />
                        <FText
                          style={{
                            fontWeight: "400",
                          }}
                        >
                          Parabéns, sono em dia esta semana!
                        </FText>
                      </>
                    )}
                  </Surface>
                  <TouchableOpacity
                    style={{ height: 140, flex: 1 }}
                    onPress={onAddSleepPress}
                  >
                    <Surface style={styles.addButtonCard} elevation={4}>
                      <FText
                        style={{
                          fontSize: 48,
                          textAlign: "right",
                          fontWeight: "200",
                        }}
                      >
                        +
                      </FText>
                      <FText style={{ textAlign: "right" }}>Adicionar</FText>
                      <FText style={{ textAlign: "right" }}>
                        Registro de Sono
                      </FText>
                    </Surface>
                  </TouchableOpacity>
                </View>

               {/* --- NOVO CARD PARA O PLANEJAMENTO DE SONO --- */}
          {!loading && !error && (
            <Surface style={styles.surfaceCard} elevation={4}>
              <FText style={styles.cardTitle}>Planejamento de Sono</FText>
              <FText style={styles.cardSubtitle}>
                Defina lembretes diários para dormir e acordar.
              </FText>
              
              <View style={styles.timeSelectorRow}>
                <TouchableOpacity style={styles.timeDisplay} onPress={() => openPicker('sleep')}>
                  <FText style={styles.timeDisplayLabel}>Hora de Dormir</FText>
                  <FText style={styles.timeDisplayText}>
                    {sleepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </FText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.timeDisplay} onPress={() => openPicker('wake')}>
                  <FText style={styles.timeDisplayLabel}>Hora de Acordar</FText>
                  <FText style={styles.timeDisplayText}>
                    {wakeUpTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </FText>
                </TouchableOpacity>
              </View>

              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={pickerFor === 'sleep' ? sleepTime : wakeUpTime}
                  mode={'time'}
                  is24Hour={true}
                  display="default"
                  onChange={onTimeChange}
                />
              )}

              {/* No iOS, o picker fica visível, então mostramos os botões de ação */}
              {Platform.OS === 'ios' && showPicker && (
                 <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.outlineButton} onPress={() => setShowPicker(false)}>
                      <FText style={styles.outlineButtonText}>FECHAR</FText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.solidButton} onPress={handleSaveReminders}>
                      <FText style={styles.solidButtonText}>SALVAR</FText>
                    </TouchableOpacity>
                  </View>
              )}

              {/* No Android, mostramos um botão de salvar principal */}
              {Platform.OS !== 'ios' && (
                <View style={styles.buttonRow}>
                   <TouchableOpacity style={styles.outlineButton} onPress={cancelAllNotifications}>
                      <FText style={styles.outlineButtonText}>CANCELAR TUDO</FText>
                    </TouchableOpacity>
                   <TouchableOpacity style={styles.solidButton} onPress={handleSaveReminders}>
                      <FText style={styles.solidButtonText}>SALVAR LEMBRETES</FText>
                    </TouchableOpacity>
                </View>
              )}
            </Surface>
          )}

              </View>
            </>
          )}
        </ScrollView>
        <SleepRegistrySheet ref={sleepRegistryRef} onSave={handleSaveSleepPlan} />
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20, // Adiciona um espaço entre os cards
  },
  gradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    flex: 1,
    padding: 20,
    backgroundColor: "#161616",
  },
  surfaceCard: {
    padding: 20,
    gap: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.Card.Stroke,
    backgroundColor: Colors.Card.Background,
  },
  smallCard: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
    height: 140,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.Card.Stroke,
    backgroundColor: Colors.Card.Background,
  },
  addButtonCard: {
    display: "flex",
    height: 140,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.Card.Stroke,
    backgroundColor: Colors.Astronaut[900],
  },
  errorText: {
    color: "#ff8a80",
    textAlign: "center",
    fontFamily: "Fustat",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 5,
  },
  // --- 5. NOVOS ESTILOS PARA O CARD DE NOTIFICAÇÕES ---
   // --- NOVOS ESTILOS PARA O CARD DE NOTIFICAÇÕES ---
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Astronaut[100],
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.Astronaut[200],
    marginBottom: 16,
  },
  timeSelectorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeDisplay: {
    flex: 1,
    backgroundColor: Colors.Card.Stroke,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  timeDisplayLabel: {
    color: Colors.Astronaut[200],
    fontSize: 12,
    marginBottom: 4,
  },
  timeDisplayText: {
    color: Colors.Astronaut[50],
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  solidButton: {
    flex: 1,
    backgroundColor: Colors.Astronaut[900],
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  solidButtonText: {
    color: Colors.Astronaut[100],
    fontSize: 14,
    fontWeight: 'semibold',
    fontFamily: 'Fustat',
  },
  outlineButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.Astronaut[200],
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: Colors.Astronaut[100],
    fontSize: 14,
    fontWeight: 'semibold',
    fontFamily: 'Fustat',
  },
});

