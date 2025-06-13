import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Biblioteca de ícones do Expo
import { Colors } from "@/constants/Colors";

// Definimos os tipos das propriedades que nosso card vai receber
type DreamCardProps = {
  date: string;
  summary?: string;
  tags?: { emoji: string; text: string }[];
  onPress: () => void; // Função a ser chamada quando o card for pressionado
};

export default function DreamCard({ date, summary, tags, onPress }: DreamCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Seção do Cabeçalho: Data e Seta */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{date}</Text>
        <Feather name="chevron-right" size={24} color="#A9A9A9" />
      </View>

      {/* Linha Separadora */}
      <View style={styles.separator} />

      {/* Seção do Resumo */}
      <View style={styles.content}>
        <Text style={styles.summaryText} numberOfLines={3}>
          {summary}
        </Text>
      </View>

      {/* Seção das Tags */}
      {tags && tags.length > 0 && (
        <View style={styles.footer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagEmoji}>{tag.emoji}</Text>
              <Text style={styles.tagText}>{tag.text}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.Card.Background, // Cor de fundo do card
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#5A5F74',
    marginBottom: 12,
  },
  content: {
    marginBottom: 16,
  },
  summaryText: {
    color: '#C0C0C0',
    fontSize: 16,
    lineHeight: 22, // Melhora a legibilidade
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que as tags quebrem a linha
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: '#4A5069',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tagEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  tagText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '500',
  },
});