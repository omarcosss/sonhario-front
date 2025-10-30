import IconCalendar from '@/assets/icons/Calendar';
import IconEnvelope from '@/assets/icons/Email';
import IconLock from '@/assets/icons/Password';
import IconUser from '@/assets/icons/User';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

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
type GenderSelectProps={
    placeholder?: object, 
    icone: 'Envelope' | 'Lock' | 'User' | 'Calendar',
    value: string;    
    onChangeText: (text: string) => void;
    items: any[];
}

export default function GenderSelect({
    placeholder={},
    icone,
    value,
    onChangeText,
    items
}:GenderSelectProps){

    if (placeholder) {
        placeholder = {
            label: 'Gênero',
            value: null,
            color: '#9EA0A4',
        };
    }

    return(
        <View>
            <View style={styles.container}>
                <Icon icon={icone}/>
                <RNPickerSelect
                    onValueChange={onChangeText}
                    placeholder={placeholder}
                    value={value}
                    style={pickerSelectStyles}
                    items={items}
                    Icon={() => null}
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
});

const pickerSelectStyles = StyleSheet.create({
    viewContainer: {
        flex: 1, 
    },
    inputWeb: {
        flex: 1,
        width: 'auto',
        
        fontFamily: "Fustat",
        fontSize: 16,
        color: Colors.Astronaut[50],
        backgroundColor: Colors.dark.background,
        marginLeft: -4,
        marginTop: 1,
        marginBottom: 1,
        borderWidth: 0,
        outlineWidth: 0,
    },
    inputIOS: {
        width: 'auto',
        
        fontFamily: "Fustat",
        fontSize: 16,
        color: Colors.Astronaut[50],
        backgroundColor: "#00000000",
        marginLeft: -4,
        marginTop: -2,
        borderWidth: 0,
        outlineWidth: 0,
    },
    inputAndroid: {
        width: 'auto',
        
        fontFamily: "Fustat",
        fontSize: 16,
        color: Colors.Astronaut[50],
        backgroundColor: "#00000000",
        marginLeft: -4,
        marginTop: -2,
        borderWidth: 0,
        outlineWidth: 0,
    },
});