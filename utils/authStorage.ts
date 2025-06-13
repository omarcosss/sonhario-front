import * as SecureStore from 'expo-secure-store';

// Definir as chaves como constantes é uma boa prática para evitar erros de digitação.
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Salva os tokens de acesso e de refresh no armazenamento seguro do dispositivo.
 * @param accessToken O token de acesso a ser salvo.
 * @param refreshToken O token de refresh a ser salvo.
 */
export async function saveTokens(accessToken: string, refreshToken:string): Promise<void> {
  try {
    // Usamos Promise.all para executar as duas operações de salvamento em paralelo.
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
    ]);
    console.log("Tokens salvos com sucesso no SecureStore.");
  } catch (error) {
    console.error("Erro ao salvar os tokens no SecureStore:", error);
    // Você pode querer tratar este erro de forma mais robusta,
    // talvez mostrando uma mensagem para o usuário.
  }
}

/**
 * Obtém os tokens de acesso e de refresh do armazenamento seguro.
 * @returns Uma promessa que resolve para um objeto contendo os tokens.
 * Se um token não for encontrado, seu valor será null.
 */
export async function getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null; }> {
  try {
    // Usamos Promise.all para buscar ambos os tokens em paralelo.
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
    ]);
    
    console.log("Tokens recuperados do SecureStore.");
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Erro ao obter os tokens do SecureStore:", error);
    // Em caso de erro, retorna null para ambos para que o app possa tratar como "não logado".
    return { accessToken: null, refreshToken: null };
  }
}

/**
 * Remove os tokens de acesso e de refresh do armazenamento seguro.
 * Ideal para ser usada na função de logout.
 */
export async function deleteTokens(): Promise<void> {
  try {
    // Usamos Promise.all para remover ambos os tokens em paralelo.
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
    ]);
    console.log("Tokens removidos com sucesso do SecureStore.");
  } catch (error) {
    console.error("Erro ao remover os tokens do SecureStore:", error);
  }
}
