import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View } from "react-native";



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