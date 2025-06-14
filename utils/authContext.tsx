import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
// Importe as funções do seu novo módulo de armazenamento seguro
import { deleteTokens, getTokens, saveTokens } from './authStorage';

// O tipo de estado agora reflete a nova assinatura da função logIn.
type AuthState = {
    isLoggedIn: boolean;
    // logIn agora espera os tokens da API.
    logIn: (access: string, refresh: string) => Promise<void>;
    logOut: () => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    logIn: async () => {},
    logOut: async () => {},
    isLoading: true, // Começa como true para verificar o armazenamento.
});

// Hook customizado para usar o AuthContext de forma mais limpa.
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }:PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Esta função será chamada quando o usuário logar com sucesso.
    const logIn = async (access: string, refresh: string) => {
        // 1. Salva os tokens no SecureStore.
        await saveTokens(access, refresh);
        // 2. Atualiza o estado da aplicação.
        setIsLoggedIn(true);
        // 3. Redireciona para a tela principal (lógica original).
        router.replace("/");
    };
    
    // Esta função será chamada para deslogar o usuário.
    const logOut = async () => {
        // 1. Remove os tokens do SecureStore.
        await deleteTokens();
        // 2. Atualiza o estado da aplicação.
        setIsLoggedIn(false);
        // 3. Redireciona para a tela de login (lógica original).
        router.replace("/login");
    };

    // Este useEffect agora verifica a existência de tokens no SecureStore
    // para decidir se o usuário deve começar a sessão logado ou não.
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Tenta obter os tokens do armazenamento seguro.
                const { accessToken } = await getTokens();
                
                // Se um token de acesso existir, o usuário está logado.
                if (accessToken) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log("Erro ao verificar status de autenticação:", error);
            } finally {
                // Garante que o estado de carregamento termine após a verificação.
                setIsLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);

    return(
        // Fornece o estado e as funções para o resto do seu app.
        <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
