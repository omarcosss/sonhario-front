import { Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import Input from '@/components/InputLogin';

export default function ForgotPassword (){

    return(
        <View>
            <Text style={{color: Colors.Astronaut[400]}}>Tela de esqueceu senha</Text>
            <Input placeholder="Teste" icone="User"></Input>
        </View>
    )
}