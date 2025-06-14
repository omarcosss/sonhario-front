import Input from '@/components/InputLogin';
import { Colors } from "@/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function RegisterScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. ESTADO PARA CONTROLAR O PASSO ATUAL (1 ou 2)
  const [step, setStep] = useState(1);

  // 2. ESTADO ÚNICO PARA GUARDAR TODOS OS DADOS DO FORMULÁRIO
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    password: '',
    password_confirm: '',
    birthdate: '',
    gender: '',
  });

  const handleRegister = async (checkOnly: boolean) => {
    setLoading(true);
    setError(null);
    let success = false;
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/register/' + (checkOnly ? 'check/' : '') , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || 'Preencha corretamente todos os campos.');
        } else {
            setError(null);
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

  // Função genérica para atualizar o estado do formulário
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const toLogin = () => {
    router.push('/login');
  };

  // 3. LÓGICA PARA AVANÇAR PARA O PRÓXIMO PASSO
  const handleNextStep = async () => {
    // Validação básica para o primeiro passo
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.')
      return;
    }
    if (formData.password !== formData.password_confirm) {
      setError('Os campos de senha não coincidem.');
      return;
    }
    
    if (await handleRegister(true))
      setStep(2);
  };

  // 4. LÓGICA PARA FINALIZAR O CADASTRO
  const handleFinalSubmit = async () => {
    // Validação para o segundo passo
    if (!formData.birthdate || !formData.display_name) {
       setError('Por favor, preencha todos os campos');
       return;
    }

    if (await handleRegister(false))
      router.replace('/login?success=true');
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
          <Image style={{ height: 32, width: 148.41 }}
            source={require('@/assets/images/splash-icon.png')} />

          
            {/* PASSO 1: DADOS DE LOGIN */}
            {step === 1 && (
            <View style={styles.formSection}>
              <View style={styles.inputsWrapper}>
                <Input placeholder='Email' icone='Envelope' value={formData.email} onChangeText={(text) => handleInputChange('email', text)} autoCapitalize='none'/>
                <Input placeholder='Senha' icone='Lock' senha value={formData.password} onChangeText={(text) => handleInputChange('password', text)} autoCapitalize='none'/>
                <Input placeholder='Confirmar Senha' icone='Lock' senha value={formData.password_confirm} onChangeText={(text) => handleInputChange('password_confirm', text)} autoCapitalize='none'/>
              </View>
              {/* Área de ERRO */}
              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.actionsWrapper}>
                <Pressable style={styles.button} onPress={handleNextStep} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                    ) : (
                        <Text style={styles.solidButtonText}>PRÓXIMO</Text>
                    )}
                </Pressable>
                <View style={styles.loginLinkContainer}>
                  <Text style={styles.regularText}>Já tem uma conta? </Text>
                  <Pressable onPress={toLogin}>
                    <Text style={styles.linkText}>Entrar</Text>
                  </Pressable>
                </View>
              </View>
            </View> 
            )}
            {/* PASSO 2: DADOS PESSOAIS */}
            {step === 2 && (
              <View style={styles.formSection}>
                <View style={styles.inputsWrapper}>
                  <Input placeholder='Seu Nome' icone='User' value={formData.display_name} onChangeText={(text) => handleInputChange('display_name', text)} autoCapitalize='words' />
                  <Input placeholder='Gênero' icone='User' value={formData.gender} onChangeText={(text) => handleInputChange('gender', text)} />
                  <Input placeholder='Data de Nascimento' icone='Calendar' value={formData.birthdate} onChangeText={(text) => handleInputChange('birthdate', text)} />
                </View>
                {/* Área de ERRO */}
                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* --- NOVA FILEIRA DE BOTÕES --- */}
                <View style={styles.actionsWrapper}>
                  <View style={styles.buttonRow}>
                  <Pressable style={styles.outlineButton} onPress={() => setStep(1)}>
                    <Text style={styles.outlineButtonText}>VOLTAR</Text>
                  </Pressable>
                  <Pressable style={styles.solidButton} onPress={handleFinalSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                    ) : (
                        <Text style={styles.solidButtonText}>CADASTRAR</Text>
                    )}
                  </Pressable>
                  </View>

                  <View style={styles.loginLinkContainer}>
                    <Text style={styles.regularText}>Já tem uma conta? </Text>
                    <Pressable onPress={toLogin}>
                      <Text style={styles.linkText}>Entrar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
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
    justifyContent: 'center',
    paddingHorizontal: 40,
    // paddingVertical: 20,
    paddingTop: 50,
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

