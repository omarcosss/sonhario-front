import Input from '@/components/InputLogin';
import { Image, StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from "@/constants/Colors";
import { useRouter } from 'expo-router';


export default function LoginScreen() {


  const router = useRouter();


  const toLogin = () => {
    router.push('/login');
  }
  const toForgotPassword = () => {
    router.push('/forgot_password')
  }
  const handleLogin = () => {
    // Lógica de autenticação (verificar email/senha) viria aqui no futuro. Por enquanto, apenas redirecionamos.
    // Usamos 'replace' para que o usuário não possa voltar para a tela de login.
    router.replace('/'); // Redireciona para a rota raiz (app/index.tsx ou app/(tabs)/index.tsx)
  };
  return (
    <LinearGradient
      colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Image style= {{height: 32, width: 148.41,}}
          source={require('@/assets/images/splash-icon.png')} />
          <View style={styles.inputContainer}>
            <Input placeholder='Nome' icone='User'/>
            <Input placeholder='Email' icone='Envelope'/>
            <Input placeholder='Senha' icone='Lock' senha/>
            <Input placeholder='Confirmar Senha' icone='Lock' senha/>
          </View>
          {/* --- BOTÃO DE CADASTRO --- */}
          <View id={'view entrar/cadastro'} style={styles.containerRegister} >
              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>CADASTRAR</Text>
              </Pressable>
            {/* ÁREA DO LINK DE CADASTRO */}
            <View style={styles.signupRow}>
              <Text style={styles.regularText}>
                Já tem uma conta?{' '}
                </Text>
                <Pressable onPress={toLogin}>
                  <Text style={styles.linkText}>
                    Entrar
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
    // justifyContent: 'center', // Centraliza o conteúdo verticalmente
    paddingHorizontal: 40, // Adiciona preenchimento lateral
    paddingTop: 100
  },
  container: {
    alignItems: 'center', // Centraliza os itens horizontalmente
    gap: 62, // Espaço entre a logo e o bloco de inputs
    marginTop: -55,
  },
  containerRegister:{
    width: '100%',
    gap: 24,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%', // Faz o container dos inputs ocupar toda a largura
    maxWidth: 500,
    gap: 48, // Adiciona um espaçamento de 20px ENTRE os inputs
    
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
  button: {
    backgroundColor: Colors.Astronaut[900], // Usando uma cor do seu tema
    width: '100%',
    maxWidth: 500,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    gap: 24,
  },
   buttonText: {
    color:Colors.Astronaut[100],
    fontSize: 20,
    fontWeight: 'semibold',
    fontFamily: 'Fustat',
  },
 // Estilo APENAS para a linha "Já tem uma conta? Entrar"
signupRow: {
  flexDirection: 'row', // Alinha os textos lado a lado
  justifyContent: 'center', // Garante que o conjunto fique centralizado
},
});
