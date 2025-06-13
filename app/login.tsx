import Input from '@/components/InputLogin';
import { Colors } from "@/constants/Colors";
import { AuthContext } from '@/utils/authContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const authContext = useContext(AuthContext);
  const router = useRouter();

  const toRegister = () => {
    router.push('/register');
  }
  const toForgotPassword = () => {
    router.push('/forgot_password')
  }

  const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/token/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'},
                body: JSON.stringify({
                  email: email,
                  password: password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.detail || 'Email ou senha inválidos.');
            } else {
                const { access, refresh } = data;
                await authContext.logIn(access, refresh);
                router.replace('/');
            }
        } catch (e) {
            console.error(e);
            setError('Não foi possível conectar ao servidor. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <LinearGradient 
      colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Image style= {{height: 32,
        width: 148.41,}}
          source={require('@/assets/images/splash-icon.png')} />
          <View style={styles.inputContainer}>
            <Input 
                placeholder='Email' 
                icone='Envelope' 
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
            />
            <Input 
                placeholder='Senha' 
                icone='Lock' 
                senha 
                value={password}
                onChangeText={setPassword}
            />
          </View>

          {/* Área de ESQUECEU SENHA*/}
          <View style={styles.signupContainer}>
            <Pressable onPress={toForgotPassword}>
              <Text style={styles.linkText}>
                Esqueci minha senha
              </Text>
            </Pressable>
          </View>

          {/* Área de ERRO */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* --- BOTÃO DE ENTRAR --- */}
          <View id={'view entrar/cadastro'} style={styles.containerRegister} >
              <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                  {loading ? (
                      <ActivityIndicator size="small" color={Colors.Astronaut[100]} />
                  ) : (
                      <Text style={styles.buttonText}>ENTRAR</Text>
                  )}
              </Pressable>
            {/* ÁREA DO LINK DE CADASTRO */}
            <View style={styles.signupRow}>
              <Text style={styles.regularText}>
                Não tem uma conta?{' '}
                </Text>
                <Pressable onPress={toRegister}>
                  <Text style={styles.linkText}>
                    Cadastre-se
                  </Text>
                </Pressable>
            </View>

          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  
  gradient: {
    flex: 1, // Garante que o gradiente ocupe a tela inteira
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#161616',
   
  },
  scrollContent: {
    flexGrow: 1, // Permite que o conteúdo do ScrollView cresça
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    paddingHorizontal: 40, // Adiciona preenchimento lateral
  },
  container: {
    alignItems: 'center', // Centraliza os itens horizontalmente
    gap: 50, // Espaço entre a logo e o bloco de inputs
    marginTop: 50,
  },
  containerRegister:{
    width: '100%',
    gap: 24,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%', // Faz o container dos inputs ocupar toda a largura
    maxWidth: 500,
    gap: 20, // Adiciona um espaçamento de 20px ENTRE os inputs
    marginBottom: -55,
  },
   signupContainer: {
    marginTop: 20, // Adiciona um espaço acima do texto
  },
  regularText: {
    color: Colors.Astronaut[50], // Cor padrão para o texto
    fontWeight: 'regular',
    fontSize: 14,
    fontFamily: 'Fustast'
  },
   linkText: {
    color: Colors.Astronaut[50], // Uma cor de destaque do seu tema
    fontWeight: 'bold',         // Deixa o link em negrito
    fontSize: 14,
    fontFamily: 'Fustast',
  },
  errorText: {
      color: '#ff8a80',
      textAlign: 'center',
      fontFamily: 'Fustat',
      fontSize: 14,
      marginTop: -10,
      marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.Astronaut[900], // Usando uma cor do seu tema
    width: '100%',
    maxWidth: 500,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
   buttonText: {
    color:Colors.Astronaut[100],
    fontSize: 20,
    fontWeight: 'semibold',
    fontFamily: 'Fustat',
  },
  // Estilo APENAS para a linha "Não tem conta? Cadastre-se"
  signupRow: {
    flexDirection: 'row', // Alinha os textos lado a lado
    justifyContent: 'center', // Garante que o conjunto fique centralizado
  },
});