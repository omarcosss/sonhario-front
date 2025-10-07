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
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Surface } from "react-native-paper";

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

  const sleepRegistryRef = useRef<SleepRegistrySheetRef>(null);

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
              </View>
            </>
          )}
        <SleepRegistrySheet ref={sleepRegistryRef} onSave={handleSaveSleepPlan} />
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    flex: 1,
    padding: 20,
    backgroundColor: "#161616",
  },
  surfaceCard: {
    padding: 20,
    marginTop: 16,
    gap: 0,
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
    marginTop: 16,
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
    marginTop: 16,
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
});
