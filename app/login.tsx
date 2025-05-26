import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function LoginScreen() {
  return (
    <ThemedView >
      <ThemedText type="title">Login</ThemedText>
      <ThemedText type="subtitle">Please enter your credentials</ThemedText>
    </ThemedView>
  );
}