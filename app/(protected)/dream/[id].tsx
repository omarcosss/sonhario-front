import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getDreamById, Dream } from '@/app/dreamService'; // Reutilizamos o serviço
import { Colors } from '@/constants/Colors';

export default function DreamViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [dream, setDream] = useState<Dream | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      const foundDream = getDreamById(id);
      if (foundDream) {
        setDream(foundDream); 
      } else {
        Alert.alert("Erro", "Sonho não encontrado.");
        router.back();
      }
    }
  }, [id]);

  // 1. FUNÇÃO PARA NAVEGAR PARA A TELA DE EDIÇÃO
  const handleEditPress = () => {
    router.push(`/editor/${id}`);
  };

  if (!dream) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#1E1E2E' },
          headerTintColor: Colors.Astronaut[100],
          headerTitle: 'Visualizar Sonho',
          // O botão de voltar padrão será mostrado, o que é bom aqui.
          // 2. BOTÃO DE LÁPIS PARA EDITAR
          headerRight: () => (
            <Pressable onPress={handleEditPress}>
              <Feather name="edit-3" size={24} color={Colors.Astronaut[100]} />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateText}>{dream.date}</Text>
        
        {/* 3. CAMPO DE TEXTO NÃO-EDITÁVEL */}
        <TextInput
          style={styles.textInput}
          value={dream.fullText}
          editable={false} // A chave para bloquear a edição
          multiline={true}
          textAlignVertical="top"
        />
      </ScrollView>

      {/* 4. RODAPÉ REMOVIDO - Sem botões de "Salvar" ou "Voltar" */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E2E' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2E' },
  loadingText: { color: '#FFFFFF', fontSize: 18, },
  scrollContent: { padding: 20 },
  dateText: { color: '#A9A9A9', fontSize: 14, marginBottom: 16, textAlign: 'center', fontFamily: 'LibreCaslonTextRegular'},
  textInput: { 
    color: '#E0E0E0', 
    fontSize: 18, 
    lineHeight: 26, 
    // Fundo transparente para parecer texto normal, mas mantendo a estrutura
    backgroundColor: 'transparent', 
    padding: 16, 
    minHeight: 300, 
    fontFamily: 'Fustat' 
  },
});
