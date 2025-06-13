import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, View, FlatList, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DreamCard from '@/components/DreamCard'; // Importe o componente que criamos
import { getDreams } from '@/app/dreamService';




export default function JournalScreen() {
  const dreams = getDreams();
  const router = useRouter();

  const handleCardPress = (dreamId: string) => {
    // Navega para a tela de edição, passando o ID do sonho.
    // Você precisará ter uma rota como 'app/editor/[id].tsx'
    router.push(`/dream/${dreamId}`);
    console.log(`Abrindo editor para o sonho: ${dreamId}`);
  };
  return (
    <LinearGradient colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.gradient}>
      <ScrollView style={{ flex: 1, paddingTop: 20 }} bounces={false}>
        <View style={styles.container}>
      <Text style={styles.title}>Registros de Sonhos</Text>

      <FlatList
        data={dreams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DreamCard
            date={item.date}
            summary={item.summary}
            tags={item.tags}
            onPress={() => handleCardPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
        
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
          flex: 1,
          padding: 20,
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
          backgroundColor: '#161616',
      },
  container: {
    flex: 1,
    paddingTop: 5,
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 27,
    fontFamily: 'LibreCaslonText-Regular',
  },
  listContent: {
    paddingHorizontal: 2,
    paddingBottom: 20,
    gap: 0,
  },
});
