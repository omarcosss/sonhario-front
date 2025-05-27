import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";
import { StyleSheet, Text, type TextProps } from 'react-native';

export default function Greeting() {
    return(
        <ThemedView style={styles.father}>
            <ThemedView style={styles.greeting}>
                <ThemedView style={styles.text}>
                    <ThemedText style={styles.text} >Bom dia,</ThemedText>
                    <ThemedText style={styles.text}>Pedro!</ThemedText>
                </ThemedView>
                <IconSymbol style={styles.icon} color="white" size={70} name="sun.max"/>
            </ThemedView>
            <ThemedText style={styles.data}>Domingo, 25 de Maio de 2025</ThemedText>
        </ThemedView>
       
    )
}

const styles = StyleSheet.create({
 father:{
        display:'flex',
        gap: 13,
    },

     greeting:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    data:{
        textAlign: 'center',
        fontSize: 10,
        color: '#F2F5FC',
    },
    icon:{
        textAlign: "right",
        color: '#FFFEE7',
    },
   
    text:{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 13,
        fontSize: 32,
        color: '#F2F5FC',
        // fontStyle: 'Libre Caslon Text',

        
    },
   

}

)