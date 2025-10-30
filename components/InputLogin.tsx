import IconCalendar from '@/assets/icons/Calendar';
import IconEnvelope from '@/assets/icons/Email';
import IconLock from '@/assets/icons/Password';
import IconUser from '@/assets/icons/User';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type IconProps={icon:'Envelope' | 'Lock' | 'User' | 'Calendar'}
const Icon = ({icon}:IconProps) => {
    switch(icon){
        case 'Envelope':
            return  <IconEnvelope height={18} width={22} color={'#D9D9D9'}/>;
        case 'Lock':
            return <IconLock height={23} width={20} color={'#D9D9D9'}/>;
        case 'User':
            return <IconUser height={20} width={20} color={'#D9D9D9'}/>;
        case 'Calendar':
            return <IconCalendar height={22} width={20} color={'#D9D9D9'}/>;
    }

}
type InputLoginProps={
    placeholder: string, 
    icone: 'Envelope' | 'Lock' | 'User' | 'Calendar',
    senha?: boolean,
    value?: string;
    onChangeText: (text: string) => void;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    type?: 'text' | 'date';
}

export default function InputLogin({
    placeholder,
    icone,
    senha=false,
    value="",
    onChangeText,
    autoCapitalize = 'sentences',
    type = 'text'
}:InputLoginProps){
    
    const handleDate = (value: string) => {
        const cleanedDigits = value.replace(/\D/g, '');

        let maskedValue = '';

        // 2. Build the dd/mm/yyyy mask based ONLY on the sequence of digits
        if (cleanedDigits.length > 0) {
            // DD part (up to 2 digits)
            maskedValue += cleanedDigits.substring(0, 2);
        }

        if (cleanedDigits.length >= 3) {
            // Insert first slash (Requirement 3: Slash is inserted only after 2 digits).
            maskedValue += '/';
            maskedValue += cleanedDigits.substring(2, 4);
        }

        if (cleanedDigits.length >= 5) {
            // Insert second slash (Requirement 3: Slash is inserted only after 4 digits).
            maskedValue += '/';
            maskedValue += cleanedDigits.substring(4, 8);
        }

        onChangeText(maskedValue);
    };

    return(
        <View>
            <View style={styles.container}>
                <Icon icon={icone}/>             
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={type == "date" ? handleDate : onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.Astronaut[100]}
                    secureTextEntry={senha}
                    autoCapitalize={autoCapitalize}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        height: 55,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: Colors.dark.background,
        borderColor: Colors.Astronaut[50],
        paddingHorizontal: 20, // Usar paddingHorizontal é mais comum que paddingLeft e gap
        gap: 16, // Um gap menor pode ficar melhor
    },
    input: {
        // --- AS MUDANÇAS ESTÃO AQUI ---
        flex: 1, // 1. FAZ O INPUT OCUPAR TODO O ESPAÇO RESTANTE
        height: '100%', // Garante que a área de toque vertical seja grande
       
        
        // Estilos de fonte que você já tinha
        fontFamily: "Fustat",
        fontSize: 16,
        color: Colors.Astronaut[50],
    },
});