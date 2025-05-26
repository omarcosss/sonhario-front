import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";
import { StyleSheet, Text, type TextProps } from 'react-native';

export default function Greeting() {
    return(
        <ThemedView style={styles.father}>
            <ThemedView style={styles.greeting}>
                <ThemedView style={styles.text}>
                    <ThemedText style={styles.title}>Bom dia,</ThemedText>
                    <ThemedText style={styles.title}>Pedro</ThemedText>
                </ThemedView>
                <IconSymbol style={styles.icon} color="white" size={70} name="sun.max"/>
            </ThemedView>
            <ThemedText style={styles.data}>Domingo, 25 de Maio de 2025</ThemedText>
        </ThemedView>
       
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 32,
        textAlign: 'left',
        justifyContent: 'flex-start',

    },
    data:{
        textAlign: 'center',
    },
    icon:{
        textAlign: "right",
    },
    father:{
        display:'flex',
        gap: 13,
    },
    text:{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 13,
        justifyContent: 'flex-start',
    },
    greeting:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

}

)