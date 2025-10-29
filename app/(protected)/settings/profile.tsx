import GenderSelect from '@/components/GenderSelect';
import Input from '@/components/InputLogin';
import { Colors } from "@/constants/Colors";
import { getTokens } from "@/utils/authStorage";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileEditScreen () {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    display_name: '',
    birthdate: '',
    gender: '',
  });

  const handleSubmit = async (checkOnly: boolean) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    let success = false;
    const { accessToken } = await getTokens();
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/profile/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || 'Preencha corretamente todos os campos.');
        } else {
            setError(null);
            setSuccess(true);
            success = true;
        }
    } catch (e) {
        console.error(e);
        setError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
        setLoading(false);
        return success;
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    let success = false;
    const { accessToken } = await getTokens();
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/profile/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || 'Houve um problema ao recuperar informações do perfil.');
        } else {
            setError(null);
            console.log(data.birthdate);
            setFormData({
              display_name: data.display_name,
              birthdate: data.birthdate,
              gender: data.gender,
            })
            success = true;
        }
    } catch (e) {
        console.error(e);
        setError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
        setLoading(false);
        return success;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [])

  // Função genérica para atualizar o estado do formulário
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const toUser = () => {
    router.push('/user');
  };

  return (
    <LinearGradient
      colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
            <Text style={styles.title}>Editar minhas informações</Text>         

            <View style={styles.formSection}>
            <View style={styles.inputsWrapper}>
                <Input placeholder='Seu Nome' icone='User' value={formData.display_name} onChangeText={(text) => handleInputChange('display_name', text)} autoCapitalize='words' />
                <GenderSelect icone='User' value={formData.gender} onChangeText={(text) => handleInputChange('gender', text)} items={[
                    { label: 'Masculino', value: 'Male' },
                    { label: 'Feminino', value: 'Female' },
                    { label: 'Outro', value: 'Other' },
                ]} />
                <Input placeholder='Data de Nascimento' icone='Calendar' type="date" value={formData.birthdate} onChangeText={(text) => handleInputChange('birthdate', text)} />
            </View>
            {/* Área de ERRO */}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {success && <Text style={styles.successText}>Dados do perfil atualizados com sucesso!</Text>}

            {/* --- NOVA FILEIRA DE BOTÕES --- */}
            <View style={styles.actionsWrapper}>
                <View style={styles.buttonRow}>
                <Pressable style={styles.outlineButton} onPress={() => toUser()}>
                <Text style={styles.outlineButtonText}>VOLTAR</Text>
                </Pressable>
                <Pressable style={styles.solidButton} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                ) : (
                    <Text style={styles.solidButtonText}>CADASTRAR</Text>
                )}
                </Pressable>
                </View>
            </View>
            </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ESTILOS REFINADOS E MAIS PREVISÍVEIS
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#161616',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 40,
    // paddingVertical: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 27,
    fontFamily: 'LibreCaslonText-Regular',
  },
  container: {
    alignItems: 'center',
    width: '100%',
    height: '80%',
    gap: 62, // Espaçamento consistente entre a logo, o formulário e o link de login
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    gap: 48, // Espaçamento entre os inputs e botões DENTRO do formulário
  },
  button: {
    backgroundColor: Colors.Astronaut[900],
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.Astronaut[100],
    fontSize: 20,
    fontWeight: 'semibold',
    fontFamily: 'Fustat',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.Astronaut[100],
    fontSize: 16,
    fontFamily: 'Fustat',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  regularText: {
    color: Colors.Astronaut[50],
    fontSize: 14,
    fontFamily: 'Fustat', // Corrigido o erro de digitação de 'Fustast'
  },
  linkText: {
    color: Colors.Astronaut[50],
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Fustat',
  },
  errorText: {
      color: '#ff8a80',
      textAlign: 'center',
      fontFamily: 'Fustat',
      fontSize: 14,
      marginTop: -10,
      marginBottom: 5,
  },
  successText: {
    color: '#00C785',
    textAlign: 'center',
    fontFamily: 'Fustat',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 5,
  },
  authWrapper: {
     width: '100%',
    alignItems: 'center',
    gap: 10, // <<-- ESTE É O NOVO ESPAÇO, MENOR, entre o formulário e o link
  },

  // --- NOVOS ESTILOS DE LAYOUT ---
  formSection: {
    width: '100%',
    maxWidth: 500,
    gap: 32, // Espaçamento entre o bloco de INPUTS e o bloco de AÇÕES
  },
  inputsWrapper: {
    width: '100%',
    gap: 48, // Espaçamento ENTRE os inputs
  },
  actionsWrapper: {
    width: '100%',
    gap: 16, // Espaçamento entre a fileira de botões e o link de login
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12, // Espaçamento entre os dois botões
  },

  // --- NOVOS ESTILOS DE BOTÃO ---
  solidButton: {
    flex: 1, // Faz o botão ocupar o espaço disponível
    backgroundColor: Colors.Astronaut[900],
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  solidButtonText: {
    color: Colors.Astronaut[100],
    fontSize: 16, // Ajustado para caber lado a lado
    fontWeight: 'semibold',
    fontFamily: 'Fustat',
  },
  outlineButton: {
    flex: 1, // Faz o botão ocupar o espaço disponível
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.Astronaut[200], // Cor da borda
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: Colors.Astronaut[100],
    fontSize: 16,
    fontWeight: 'semibold',
    fontFamily: 'Fustat',
  },
});

