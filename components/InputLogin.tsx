import IconEnvelope from '@/assets/icons/Email';
import IconLock from '@/assets/icons/Password';
import IconUser from '@/assets/icons/User';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

type IconProps={icon:'Envelope' | 'Lock' | 'User'}
const Icon = ({icon}:IconProps) => {
    switch(icon){
        case 'Envelope':
            return  <IconEnvelope height={18} width={22} color={'#D9D9D9'}/>;
        case 'Lock':
            return <IconLock height={23} width={20} color={'#D9D9D9'}/>;
        case 'User':
            return <IconUser height={20} width={20} color={'#D9D9D9'}/>;
    }

}
type InputLoginProps={
    placeholder: string, 
    icone: 'Envelope' | 'Lock' | 'User',
    senha?: boolean,
    
}
export default function InputLogin({placeholder,icone,senha=false}:InputLoginProps){

    const [email,setEmail] = useState("");


    return(
        <View>
            <View style={styles.container}>
                <Icon icon={icone}/>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={text =>setEmail(text)}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.Astronaut[100]}
                    secureTextEntry={senha}
                    textAlignVertical="center" 
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