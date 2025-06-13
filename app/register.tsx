// import Input from '@/components/InputLogin';
// import { Image, StyleSheet, View, Text, Pressable, Platform } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import { LinearGradient } from 'expo-linear-gradient';
// import { Colors } from "@/constants/Colors";
// import { useRouter } from 'expo-router';


// export default function LoginScreen() {


//   const router = useRouter();


//   const toLogin = () => {
//     router.push('/login');
//   }
//   const toForgotPassword = () => {
//     router.push('/forgot_password')
//   }
//   const handleLogin = () => {
//     // Lógica de autenticação (verificar email/senha) viria aqui no futuro. Por enquanto, apenas redirecionamos.
//     // Usamos 'replace' para que o usuário não possa voltar para a tela de login.
//     router.replace('/'); // Redireciona para a rota raiz (app/index.tsx ou app/(tabs)/index.tsx)
//   };
//   return (
//     <LinearGradient
//       colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
//                     start={{ x: 0.5, y: 0 }}
//                     end={{ x: 0.5, y: 1 }}
//                     style={styles.gradient}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.container}>
//           <Image style= {{height: 32, width: 148.41,}}
//           source={require('@/assets/images/splash-icon.png')} />
//           <View style={styles.inputContainer}>
//             <Input placeholder='Nome' icone='User'/>
//             <Input placeholder='Email' icone='Envelope'/>
//             <Input placeholder='Senha' icone='Lock' senha/>
//             <Input placeholder='Confirmar Senha' icone='Lock' senha/>
//           </View>
//           {/* --- BOTÃO DE CADASTRO --- */}
//           <View id={'view entrar/cadastro'} style={styles.containerRegister} >
//               <Pressable style={styles.button} onPress={handleLogin}>
//                 <Text style={styles.buttonText}>CADASTRAR</Text>
//               </Pressable>
//             {/* ÁREA DO LINK DE CADASTRO */}
//             <View style={styles.signupRow}>
//               <Text style={styles.regularText}>
//                 Já tem uma conta?{' '}
//                 </Text>
//                 <Pressable onPress={toLogin}>
//                   <Text style={styles.linkText}>
//                     Entrar
//                   </Text>
//                 </Pressable>
//             </View>
           
//           </View>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }


// const styles = StyleSheet.create({
 
//   gradient: {
//     flex: 1, // Garante que o gradiente ocupe a tela inteira
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     backgroundColor: '#161616',
   
//   },
//   scrollContent: {
//     flexGrow: 1, // Permite que o conteúdo do ScrollView cresça
//     // justifyContent: 'center', // Centraliza o conteúdo verticalmente
//     paddingHorizontal: 40, // Adiciona preenchimento lateral
//     paddingTop: 100
//   },
//   container: {
//     alignItems: 'center', // Centraliza os itens horizontalmente
//     gap: 62, // Espaço entre a logo e o bloco de inputs
//     marginTop: -55,
//   },
//   containerRegister:{
//     width: '100%',
//     gap: 24,
//     alignItems: 'center',
//   },
//   inputContainer: {
//     width: '100%', // Faz o container dos inputs ocupar toda a largura
//     maxWidth: 500,
//     gap: 48, // Adiciona um espaçamento de 20px ENTRE os inputs
    
//   },
//    signupContainer: {
//     marginTop: 20, // Adiciona um espaço acima do texto
//   },
//   regularText: {
//     color: Colors.Astronaut[50], // Cor padrão para o texto
//     fontWeight: 'regular',
//     fontSize: 14,
//     fontFamily: 'Fustast'
//   },
//    linkText: {
//     color: Colors.Astronaut[50], // Uma cor de destaque do seu tema
//     fontWeight: 'bold',         // Deixa o link em negrito
//     fontSize: 14,
//     fontFamily: 'Fustast',
//   },
//   button: {
//     backgroundColor: Colors.Astronaut[900], // Usando uma cor do seu tema
//     width: '100%',
//     maxWidth: 500,
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 2,
//     gap: 24,
//   },
//    buttonText: {
//     color:Colors.Astronaut[100],
//     fontSize: 20,
//     fontWeight: 'semibold',
//     fontFamily: 'Fustat',
//   },
//  // Estilo APENAS para a linha "Já tem uma conta? Entrar"
// signupRow: {
//   flexDirection: 'row', // Alinha os textos lado a lado
//   justifyContent: 'center', // Garante que o conjunto fique centralizado
// },
// });

//CODIGO ALTERADO LOGICA DE PROXIMO GEMINI
import Input from '@/components/InputLogin';
import { Image, StyleSheet, View, Text, Pressable, Platform, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from "@/constants/Colors";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();

  // 1. ESTADO PARA CONTROLAR O PASSO ATUAL (1 ou 2)
  const [step, setStep] = useState(1);

  // 2. ESTADO ÚNICO PARA GUARDAR TODOS OS DADOS DO FORMULÁRIO
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    dataNascimento: '',
    genero: '',
    nomeExibicao: '',
  });

  // Função genérica para atualizar o estado do formulário
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const toLogin = () => {
    router.push('/login');
  };

  // 3. LÓGICA PARA AVANÇAR PARA O PRÓXIMO PASSO
  const handleNextStep = () => {
    // Validação básica para o primeiro passo
    if (!formData.nome || !formData.email || !formData.senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    
    // Simulação de verificação de disponibilidade (substitua pela sua lógica de API)
    console.log('Verificando disponibilidade para:', formData.email);
    
    // Se tudo estiver ok, avança para o próximo passo
    setStep(2);
  };

  // 4. LÓGICA PARA FINALIZAR O CADASTRO
  const handleFinalSubmit = () => {
    // Validação para o segundo passo
    if (!formData.dataNascimento || !formData.nomeExibicao) {
       Alert.alert('Erro', 'Por favor, preencha a data de nascimento e nome de exibição.');
       return;
    }

    console.log('Enviando dados completos para a API:', formData);
    Alert.alert('Sucesso!', 'Cadastro realizado com sucesso.');
    // Após o cadastro, você pode navegar para a tela principal ou de login
    router.replace('/login'); 
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
                <Input placeholder='Nome' icone='User' value={formData.nome} onChangeText={(text) => handleInputChange('nome', text)} />
                <Input placeholder='Email' icone='Envelope' value={formData.email} onChangeText={(text) => handleInputChange('email', text)} />
                <Input placeholder='Senha' icone='Lock' senha value={formData.senha} onChangeText={(text) => handleInputChange('senha', text)} />
                <Input placeholder='Confirmar Senha' icone='Lock' senha value={formData.confirmarSenha} onChangeText={(text) => handleInputChange('confirmarSenha', text)} />
              </View>

              <View style={styles.actionsWrapper}>
                <Pressable style={styles.solidButton} onPress={handleNextStep}>
                  <Text style={styles.solidButtonText}>PRÓXIMO</Text>
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
                  <Input placeholder='Nome de Usuário' icone='User' value={formData.nomeExibicao} onChangeText={(text) => handleInputChange('nomeExibicao', text)} />
                  <Input placeholder='Gênero' icone='User' value={formData.genero} onChangeText={(text) => handleInputChange('genero', text)} />
                  <Input placeholder='Data de Nascimento' icone='Calendar' value={formData.dataNascimento} onChangeText={(text) => handleInputChange('dataNascimento', text)} />
                </View>

                {/* --- NOVA FILEIRA DE BOTÕES --- */}
                <View style={styles.actionsWrapper}>
                  <View style={styles.buttonRow}>
                  <Pressable style={styles.outlineButton} onPress={() => setStep(1)}>
                    <Text style={styles.outlineButtonText}>VOLTAR</Text>
                  </Pressable>
                  <Pressable style={styles.solidButton} onPress={handleFinalSubmit}>
                    <Text style={styles.solidButtonText}>CADASTRAR</Text>
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
    // justifyContent: 'center',
    paddingHorizontal: 40,
    // paddingVertical: 20,
    paddingTop: 50,
  },
  container: {
    alignItems: 'center',
    width: '100%',
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

