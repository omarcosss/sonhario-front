import DreamCard from '@/components/DreamCard'; // Importe o componente que criamos
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// import { getDreams } from '@/app/dreamService';
import { Colors } from '@/constants/Colors';
import { getTokens } from '@/utils/authStorage';
import React, { useEffect, useState } from 'react';

export default function JournalScreen() {
  // const dreams = getDreams();
  const router = useRouter();

  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [dreams, setDreams] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchPageData = async () => {
        try {
            const { accessToken } = await getTokens();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            const [dreamsResponse] = await Promise.all([
                fetch(process.env.EXPO_PUBLIC_API_URL + '/entries/dreams/', {
                    method: 'GET', headers
                })
            ]);
            if (!dreamsResponse.ok) {
                throw new Error('Falha em uma das requisições à API.');
            }
            const [dreamsData] = await Promise.all([
                dreamsResponse.json(),
            ]);

            setDreams(dreamsData);            
        } catch (e) {
            console.error(e);
            setError('Não foi possível conectar ao servidor. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    fetchPageData();
}, [refresh]);

  const handleCardPress = (dreamId: string) => {
    // Navega para a tela de edição, passando o ID do sonho.
    // Você precisará ter uma rota como 'app/editor/[id].tsx'
    // router.push(`/dream/${dreamId}`);
    console.log(`Abrindo editor para o sonho: ${dreamId}`);
  };
  return (
    <LinearGradient colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.gradient}>
      <ScrollView style={{ flex: 1, paddingTop: 20 }} bounces={false}>
        {error && <Text style={styles.errorText}>{error}</Text>}
          {loading && !error ? (
              <ActivityIndicator style={{marginTop: 420}} size="large" color={Colors.Astronaut[100]} />
          ) : (<>
              <View style={styles.container}>
              <Text style={styles.title}>Registros de Sonhos</Text>

              {dreams.length > 0 ? (
                <FlatList
                  data={dreams}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <DreamCard
                      date={item.date}
                      text={item.text}
                      emotion={item.emotion}
                      onPress={() => handleCardPress(item.id)}
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                />
              ): (
                <View style={{marginTop: 250}}>
                  <Text style={styles.title}>Nenhum registro de sonho ainda.</Text>
                  <Text style={styles.title}>Adicione um após registrar sua noite de sono!</Text>
                </View>
              )}              
            </View>
          </>)}
        
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
  errorText: {
      color: '#ff8a80',
      textAlign: 'center',
      fontFamily: 'Fustat',
      fontSize: 14,
      marginTop: -10,
      marginBottom: 5,
  },
});
