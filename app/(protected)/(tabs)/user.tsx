import { IconHelp, IconLogout, IconNotification, IconSecurity, IconSettings, IconUserCircle, IconUserEdit } from '@/assets/icons'; // Seus ícones
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { getTokens } from '@/utils/authStorage';
import { Feather } from '@expo/vector-icons'; // Para o ícone de seta
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";

// Componente reutilizável para cada item do menu
type ProfileMenuItemProps = {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
};

const ProfileMenuItem = ({ icon, label, onPress }: ProfileMenuItemProps) => (
    <Pressable style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemContent}>
            {icon}
            <Text style={styles.menuItemLabel}>{label}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#A9A9A9" />
    </Pressable>
);

export default function UserProfile() {
    const authContext = useContext(AuthContext);

    const [error, setError] = useState<string | null>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);

    const [profile, setProfile] = useState<any>();

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

                const [profileResponse] = await Promise.all([
                    fetch(process.env.EXPO_PUBLIC_API_URL + '/profile/', {
                        method: 'GET', headers
                    }),
                ]);
                if (!profileResponse.ok) {
                    throw new Error('Falha em uma das requisições à API.');
                }
                const [profileData] = await Promise.all([
                    profileResponse.json(),
                ]);

                setProfile(profileData);
            } catch (e) {
                console.error(e);
                setError('Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [refresh]);

    // Funções de clique (por enquanto, apenas um log)
    const handlePress = async (action: string) => {
        console.log(`Ação: ${action}`);
        if (action == "Sair") {
            await authContext.logOut();
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}
            >
                {error && <Text style={styles.errorText}>{error}</Text>}
                {loading && !error ? (
                    <ActivityIndicator style={{marginTop: 420}} size="large" color={Colors.Astronaut[100]} />
                ) : (
                    <>
                    {/* Seção de Informações do Usuário */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <IconUserCircle width={48} height={48} color={Colors.Astronaut[400]} />
                        </View>
                        <Text style={styles.userName}>{profile.display_name}</Text>
                        <Text style={styles.userAge}>Idade: {profile.age}</Text>
                    </View>

                    {/* Seção de Configurações */}
                    <View style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>Configurações</Text>
                        <ProfileMenuItem 
                            icon={<IconSecurity width={24} height={24} color={Colors.Astronaut[50]} />} 
                            label="Segurança da Conta"
                            onPress={() => handlePress('Segurança')} 
                        />
                        <ProfileMenuItem 
                            icon={<IconSettings width={24} height={24} color={Colors.Astronaut[50]}/>} 
                            label="Ajustes" 
                            onPress={() => handlePress('Ajustes')}
                        />
                        <ProfileMenuItem 
                            icon={<IconNotification width={24} height={24} color={Colors.Astronaut[50]} />} 
                            label="Notificações" 
                            onPress={() => handlePress('Notificações')}
                        />
                        <ProfileMenuItem 
                            icon={<IconUserEdit width={24} height={24} color={Colors.Astronaut[50]}/>} 
                            label="Editar minhas informações" 
                            onPress={() => handlePress('Editar Informações')}
                        />
                        <ProfileMenuItem 
                            icon={<IconHelp width={24} height={24} color={Colors.Astronaut[50]}/>} 
                            label="Ajuda" 
                            onPress={() => handlePress('Ajuda')}
                        />
                        <ProfileMenuItem 
                            icon={<IconLogout width={24} height={24} color={Colors.Astronaut[50]}/>} 
                            label="Sair" 
                            onPress={() => handlePress('Sair')}
                        />
                    </View>
                </>)}                
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161616',
    },
    gradient: {
        flex: 1, 
        paddingTop: Platform.OS === 'ios' ? 80 : 60, // Aumentado para dar espaço no topo
        paddingHorizontal: 20,
    },

    // --- NOVOS ESTILOS ABAIXO ---

    profileHeader: {
        alignItems: 'center',
        marginBottom: 40, // Espaço entre o header e o menu
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45, // Metade da largura/altura para um círculo perfeito
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 22,
        color: Colors.Astronaut[50],
        marginBottom: 4,
        fontFamily: 'LibreCaslonText-Bold'
    },
    userAge: {
        fontSize: 17,
        color: Colors.Astronaut[50],
        fontWeight: 'regular',
        fontFamily: 'Fustast'
    },
    menuSection: {
        width: '100%',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'regular',
        color: Colors.Astronaut[50],
        marginBottom: 12, // Espaço entre o título da seção e o primeiro item
        fontFamily: 'Fustast',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 17, // Espaçamento vertical para cada item
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A3E',
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15, // Espaço entre o ícone e o texto
    },
    menuItemLabel: {
        fontSize: 17,
        color: Colors.Astronaut[50],
        fontFamily: 'Fustast'
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
