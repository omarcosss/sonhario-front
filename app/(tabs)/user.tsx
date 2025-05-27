import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, Surface } from "react-native-paper";
import { View } from "react-native";
import { Platform, StyleSheet, Text } from 'react-native';
import { Colors } from "@/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import SleepScore from "@/assets/icons/SleepScore";
import { PlatformPressable } from "@react-navigation/elements";



export default function UserProfile() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}
            >

                <ThemedText type="title">User Profile</ThemedText>
                <ThemedText type="subtitle">This is the user profile screen.</ThemedText>
                <ThemedText type="default">
                    Here you can view and edit your profile information.
                </ThemedText>
                <Surface style={{ padding: 20, marginTop: 16, gap: 15, borderRadius: 30, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background }} elevation={4}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{color: Colors.Astronaut[50], }}>Último Registro:</Text>
                        <Button mode="contained" onPress={() => console.log('Edit Profile Pressed')} style={{ backgroundColor: Colors.Card.Stroke, backgroundBlendMode: 'multiply', borderWidth: 1, borderColor: Colors.Card.Stroke}}>
                            <Text style={{ color: Colors.Astronaut[200]}}>
                                Ver todos
                            </Text>
                        </Button>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <SleepScore iconColor={Colors.Astronaut[200]} shadowColor={Colors.Astronaut[600]} shadowRadius={20} />
                        <Text style={{ color: Colors.Astronaut[200], overflow: 'visible', padding: 7, fontSize: 32, fontWeight: 700, textShadowColor: '#4767C9', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20, }} >
                            7h
                        </Text>
                    </View>
                    <ThemedText type="default" style={{ }}>
                        Você teve uma ótima noite de sono! Isso ajuda a manter sua concentração e energia ao longo do dia.
                    </ThemedText>
                </Surface>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 20, width: '100%' }}>
                    <Surface style={{ display: "flex", padding: 20, marginTop: 16, gap: 15, borderRadius: 30, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background }} elevation={4}>
                        <Text style={{ color: Colors.Astronaut[50] }}>Você está com:</Text>
                        <Text style={{ color: Colors.Astronaut[50], fontSize: 32, fontWeight: 700 }}>3h</Text>
                        <Text style={{ color: Colors.Astronaut[50] }}>de deficit de sono esta semana</Text>
                    </Surface>
                    <PlatformPressable style={{  }}>
                        <Surface style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 20, marginTop: 16, gap: 15, borderRadius: 30, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background }} elevation={4}>
                            <Text style={{ color: Colors.Astronaut[50], fontSize: 32}}>+</Text>
                            <Text style={{ color: Colors.Astronaut[50] }}>Adicionar</Text>
                            <Text style={{ color: Colors.Astronaut[50] }}>Registro de Sono</Text>
                        </Surface>
                    </PlatformPressable>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#161616',
        // backgroundColor: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(50, 64, 123, 0.40) 100%), #161616',
    },
    gradient: {
        flex: 1, // Ensures the gradient covers the entire container
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        gap: 20,
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    
})