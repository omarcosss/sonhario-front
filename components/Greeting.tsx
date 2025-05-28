import { StyleSheet, View } from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

export default function Greeting() {
    return(
        <View style={styles.father}>
            <View style={styles.greeting}>
                <View style={styles.text}>
                    <ThemedText style={styles.text}>Bom dia,</ThemedText>
                    <ThemedText style={styles.text}>Pedro!</ThemedText>
                </View>
                <IconSymbol style={styles.icon} color="white" size={70} name="sun.max"/>
            </View>
            <ThemedText style={styles.data}>Domingo, 25 de Maio de 2025</ThemedText>
        </View>
       
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
        fontFamily: 'LibreCaslonTextRegular',

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
        fontFamily: 'LibreCaslonTextRegular',

        
    },
   

}

)