import MoonStars from '@/assets/icons/MoonStars';
import SunIcon from '@/assets/icons/SunIcon';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const getCurrentDateDetails = () => {
  const today = new Date();
  const hour = today.getHours();

  // Date formatting options
  const dateOptions = {
    weekday: 'long' as const,
    year: 'numeric' as const,
    month: 'long'as const,
    day: 'numeric'as const,
  };
  let formattedDate = today.toLocaleDateString('pt-BR', dateOptions);
  formattedDate = formattedDate.replace(/\b\w/g, char => char.toUpperCase());
  formattedDate = formattedDate.replace(/ De /g, ' de ');

  let greetingText = '';
  let IconComponent = SunIcon; // Default to SunIcon

  if (hour >= 5 && hour < 12) { // Morning: 5 AM to 11:59 AM
    greetingText = 'Bom dia';
  } else if (hour >= 12 && hour < 18) { // Afternoon: 12 PM to 5:59 PM
    greetingText = 'Boa tarde';
    IconComponent = SunIcon; // SunIcon can still be appropriate
  } else { // Evening/Night: 6 PM to 4:59 AM
    greetingText = 'Boa noite';
    IconComponent = MoonStars; // Switch to MoonStars icon
  }

  return {
    formattedDate,
    greetingText,
    IconComponent,
  };
};

interface GreetingProps {
  first_name: string;
}

export default function Greeting({first_name}: GreetingProps) {
  const [dateDetails, setDateDetails] = useState(getCurrentDateDetails());

  useEffect(() => {
    setDateDetails(getCurrentDateDetails());
  }, []);


  return (
    <View style={styles.father}>
      <View style={styles.greeting}>
        <View style={styles.text}>
          <Text style={styles.text}>{dateDetails.greetingText},</Text>
          <Text style={styles.text}>{first_name}!</Text>
        </View>
        <dateDetails.IconComponent width={70} height={70} />
        {/* Adjust icon props (width, height, iconColor) as needed */}
      </View>
      <Text style={styles.data}>{dateDetails.formattedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    father:{
        display:'flex',
        gap: 15,
    },

     greeting:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        gap: 10,
        fontSize: 32,
        color: '#F2F5FC',
        fontFamily: 'LibreCaslonTextRegular',

        
    },
   

}

)