import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getDreamById, Dream } from '@/app/dreamService';
import { Colors } from '@/constants/Colors';





export default function DreamEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // --- 2. INFORME AO useState OS TIPOS POSSÍVEIS: Dream OU null ---
  const [dream, setDream] = useState<Dream | null>(null);
  const [editableText, setEditableText] = useState('');

  

  useEffect(() => {
    if (typeof id === 'string') {
      
      // --- ALTERAÇÃO PRINCIPAL ---
      // Usa a função do serviço para buscar o sonho específico pelo ID
      const foundDream = getDreamById(id);

      if (foundDream) {
        setDream(foundDream); 
        setEditableText(foundDream.fullText);
      } else {
        // Opcional: lidar com o caso em que o sonho não é encontrado
        Alert.alert("Erro", "Sonho não encontrado.");
        router.back();
      }
    }
  }, [id]);

  // Funções para salvar ou excluir
  const handleSaveChanges = () => {
    console.log('Salvando alterações para o sonho:', id);
    console.log('Novo texto:', editableText);
    Alert.alert('Salvo!', 'Suas anotações foram salvas com sucesso.');
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja apagar este sonho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          onPress: () => {
            console.log('Excluindo o sonho:', id);
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };
 const handleGoBack = () => {
    router.back();
  };
  if (!dream) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando sonho...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#1E1E2E' },
          headerTintColor: Colors.Astronaut[100],
          headerTitle: 'Editar Sonho',
          headerBackVisible: false,
          headerRight: () => (
            <Pressable onPress={handleDelete}>
              <Feather name="trash-2" size={24} color="#FF6B6B" />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateText}>{dream.date}</Text>
        
        <TextInput
          style={styles.textInput}
          value={editableText}
          onChangeText={setEditableText}
          multiline={true}
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          {/* Botão Voltar */}
          <Pressable style={styles.outlineButton} onPress={handleGoBack}>
            <Text style={styles.outlineButtonText}>VOLTAR</Text>
          </Pressable>
          {/* Botão Salvar */}
          <Pressable style={styles.solidButton} onPress={handleSaveChanges}>
            <Text style={styles.solidButtonText}>SALVAR</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// Seus estilos continuam aqui...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E2E' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2E' },
  loadingText: { color: '#FFFFFF', fontSize: 18, },
  scrollContent: { padding: 20, },
  dateText: { color: '#A9A9A9', fontSize: 14, marginBottom: 16, textAlign: 'center', },
  textInput: { color: '#E0E0E0', fontSize: 18, lineHeight: 26, backgroundColor: '#2A2A3E', borderRadius: 12, padding: 16, minHeight: 300, },

  saveButton: { 
    borderWidth: 1,
    backgroundColor: Colors.Astronaut[900],
    padding: 15, 
    borderRadius: 30, 
    alignItems: 'center',
   },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
  // Estilos do rodapé e botões
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3A4E',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12, // Espaçamento entre os botões
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
    fontSize: 16,
    fontWeight: '600', // Use '600' ou 'bold'
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
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Fustat',
  },
});
