import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";

import FText from "@/components/FText";
import { Colors } from "@/constants/Colors";

type DreamEmotion = "1" | "2" | "3";

interface DreamRegisterModalProps {
  description: string;
  emotion: DreamEmotion;
  loading: boolean;
  error: string | null;
  onChangeDescription: (value: string) => void;
  onChangeEmotion: (value: DreamEmotion) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const DreamRegisterModal: React.FC<DreamRegisterModalProps> = ({
  description,
  emotion,
  loading,
  error,
  onChangeDescription,
  onChangeEmotion,
  onBack,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <FText>Descreva o seu sonho</FText>

      <TextInput
        placeholder="Hoje eu sonhei que..."
        value={description}
        onChangeText={onChangeDescription}
        autoCapitalize="none"
        style={styles.dreamInput}
      />

      <SegmentedButtons
        value={emotion}
        onValueChange={(value) => onChangeEmotion(value as DreamEmotion)}
        buttons={[
          { value: "1", label: "😊" },
          { value: "2", label: "😢" },
          { value: "3", label: "🤨" },
        ]}
      />

      {error ? <FText style={styles.errorText}>{error}</FText> : null}

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={onBack}
          style={{ flex: 1, borderColor: Colors.Astronaut[200] }}
        >
          <FText style={{ color: Colors.Astronaut[200] }}>Voltar</FText>
        </Button>

        <Button
          mode="contained"
          onPress={onSubmit}
          style={{ flex: 1, backgroundColor: Colors.Astronaut[900] }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
          ) : (
            "Registrar"
          )}
        </Button>
      </View>
    </View>
  );
};

export default DreamRegisterModal;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
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
  errorText: {
    color: "#ff8a80",
    textAlign: "center",
    fontFamily: "Fustat",
    fontSize: 14,
    marginBottom: -10,
    marginTop: 5,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginVertical: 30,
  },
});
